-- Apply once in the Supabase SQL editor (or with Supabase CLI migrations).
-- All application data is server-only. Public and authenticated browser roles have no access.
begin;
create table public.rfq_staff (
 user_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check(length(display_name) between 1 and 100),
 enabled boolean not null default true
);
create sequence public.rfq_reference_seq;
create function public.rfq_next_reference() returns text language plpgsql volatile security invoker set search_path='' as $$
declare serial text := nextval('public.rfq_reference_seq')::text;
begin
 return 'UA-RFQ-' || to_char(now() at time zone 'Asia/Kolkata','YYYY') || '-' || lpad(serial,greatest(6,length(serial)),'0');
end;$$;
revoke all on function public.rfq_next_reference() from public,anon,authenticated;
grant execute on function public.rfq_next_reference() to service_role;
create table public.rfq_requests (
 id uuid primary key default gen_random_uuid(),
 reference text not null unique default public.rfq_next_reference(),
 owner_hash text not null unique, payload_digest text not null,
 payload jsonb not null,
 status text not null default 'Received' check(status in ('Received','Under technical review','Information required','Quotation sent','Closed')),
 version integer not null default 0,
 deletion_started_at timestamptz,
 owner_id uuid references public.rfq_staff(user_id) on delete set null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), closed_at timestamptz
);
create table public.rfq_uploads (
 id uuid primary key default gen_random_uuid(), owner_hash text not null,
 rfq_id uuid references public.rfq_requests(id) on delete cascade,
 path text not null unique, name text not null, size bigint not null check(size between 1 and 20971520),
 mime_type text not null, created_at timestamptz not null default now(), deletion_started_at timestamptz
);
create index rfq_uploads_owner on public.rfq_uploads(owner_hash);
create index rfq_uploads_request on public.rfq_uploads(rfq_id);
create table public.rfq_events (
 id uuid primary key default gen_random_uuid(), rfq_id uuid not null references public.rfq_requests(id) on delete cascade,
 status text not null, message text not null default '', internal_note text not null default '',
 actor_id uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);
create index rfq_events_request on public.rfq_events(rfq_id,created_at);
create table public.rfq_outbox (
 id uuid primary key default gen_random_uuid(), rfq_id uuid not null references public.rfq_requests(id) on delete cascade,
 event_id uuid references public.rfq_events(id) on delete cascade,
 kind text not null check(kind in ('staff_received','customer_received','customer_update')),
 state text not null default 'pending' check(state in ('pending','sending','sent','failed')),
 attempts integer not null default 0, next_attempt_at timestamptz not null default now(), locked_until timestamptz,
 provider_id text, last_error text, created_at timestamptz not null default now(), sent_at timestamptz
);
create index rfq_outbox_due on public.rfq_outbox(state,next_attempt_at);
create table public.rfq_rate_limits (key text primary key, window_start timestamptz not null default now(), hits integer not null default 1);
create index rfq_requests_updated on public.rfq_requests(updated_at desc);

alter table public.rfq_staff enable row level security;
alter table public.rfq_requests enable row level security;
alter table public.rfq_uploads enable row level security;
alter table public.rfq_events enable row level security;
alter table public.rfq_outbox enable row level security;
alter table public.rfq_rate_limits enable row level security;
revoke all on public.rfq_staff,public.rfq_requests,public.rfq_uploads,public.rfq_events,public.rfq_outbox,public.rfq_rate_limits from public,anon,authenticated;
grant all on public.rfq_staff,public.rfq_requests,public.rfq_uploads,public.rfq_events,public.rfq_outbox,public.rfq_rate_limits to service_role;
revoke all on sequence public.rfq_reference_seq from public,anon,authenticated;
grant usage,select on sequence public.rfq_reference_seq to service_role;

create function public.rfq_rate_limit(p_key text,p_limit integer,p_window_seconds integer) returns boolean language plpgsql security invoker set search_path='' as $$
declare count_now integer;
begin
 insert into public.rfq_rate_limits as r(key) values(p_key)
 on conflict(key) do update set hits=case when r.window_start<now()-make_interval(secs=>p_window_seconds) then 1 else r.hits+1 end,
 window_start=case when r.window_start<now()-make_interval(secs=>p_window_seconds) then now() else r.window_start end returning hits into count_now;
 return count_now<=p_limit;
end;$$;

create function public.rfq_create(p_owner_hash text,p_digest text,p_payload jsonb,p_upload_ids uuid[]) returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.rfq_requests; existing public.rfq_requests; count_files integer; total_bytes bigint; e uuid;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_owner_hash,0));
 select * into existing from public.rfq_requests where owner_hash=p_owner_hash;
 if found then
   if existing.payload_digest<>p_digest then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
   return jsonb_build_object('id',existing.id,'reference',existing.reference,'reused',true);
 end if;
 -- Lock attachments before validation so retention cannot claim them mid-submission.
 perform 1 from public.rfq_uploads where id=any(p_upload_ids) order by id for update;
 if cardinality(p_upload_ids)>6 or cardinality(p_upload_ids)<>(select count(distinct x) from unnest(p_upload_ids) x) then raise exception 'INVALID_ATTACHMENTS'; end if;
 select count(*),coalesce(sum(u.size),0) into count_files,total_bytes from public.rfq_uploads u
 join storage.objects o on o.bucket_id='rfq-drawings' and o.name=u.path
 where u.id=any(p_upload_ids) and u.owner_hash=p_owner_hash and u.rfq_id is null
 and u.deletion_started_at is null and u.created_at>now()-interval '24 hours' and (o.metadata->>'size')::bigint=u.size
 and o.metadata->>'mimetype'=u.mime_type;
 if count_files<>cardinality(p_upload_ids) or total_bytes>41943040 then raise exception 'INVALID_ATTACHMENTS'; end if;
 insert into public.rfq_requests(owner_hash,payload_digest,payload) values(p_owner_hash,p_digest,p_payload) returning * into r;
 update public.rfq_uploads set rfq_id=r.id where id=any(p_upload_ids);
 insert into public.rfq_events(rfq_id,status,message) values(r.id,'Received','Your enquiry has been received for review.') returning id into e;
 insert into public.rfq_outbox(rfq_id,event_id,kind) values(r.id,e,'staff_received'),(r.id,e,'customer_received');
 return jsonb_build_object('id',r.id,'reference',r.reference,'reused',false);
end;$$;

create function public.rfq_update(p_id uuid,p_version integer,p_status text,p_message text,p_internal_note text,p_owner_id uuid,p_actor uuid) returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.rfq_requests; e uuid;
begin
 if not exists(select 1 from public.rfq_staff where user_id=p_actor and enabled) then raise exception 'NOT_STAFF'; end if;
 if p_owner_id is not null and not exists(select 1 from public.rfq_staff where user_id=p_owner_id and enabled) then raise exception 'INVALID_OWNER'; end if;
 select * into r from public.rfq_requests where id=p_id for update;
 if not found then raise exception 'NOT_FOUND'; end if;
 if r.deletion_started_at is not null then raise exception 'RETENTION_EXPIRED'; end if;
 if r.version<>p_version then raise exception 'VERSION_CONFLICT'; end if;
 if r.status<>p_status and length(trim(p_message))=0 then raise exception 'PUBLIC_MESSAGE_REQUIRED'; end if;
 if r.status=p_status and r.owner_id is not distinct from p_owner_id and length(trim(p_message))=0 and length(trim(p_internal_note))=0 then raise exception 'NO_CHANGE'; end if;
 update public.rfq_requests set status=p_status,owner_id=p_owner_id,version=version+1,updated_at=now(),
 closed_at=case when p_status='Closed' then coalesce(closed_at,now()) else null end where id=p_id;
 insert into public.rfq_events(rfq_id,status,message,internal_note,actor_id) values(p_id,p_status,p_message,p_internal_note,p_actor) returning id into e;
 if length(trim(p_message))>0 then insert into public.rfq_outbox(rfq_id,event_id,kind) values(p_id,e,'customer_update'); end if;
 return jsonb_build_object('id',p_id,'version',p_version+1);
end;$$;

create function public.rfq_claim_mail(p_request_id uuid default null,p_limit integer default 10) returns setof public.rfq_outbox language plpgsql security invoker set search_path='' as $$
begin
 -- A function can time out during its final attempt. Surface the expired lease for staff retry.
 update public.rfq_outbox set state='failed',locked_until=null,last_error='Final delivery attempt expired. Check provider logs before retrying.'
 where state='sending' and locked_until<now() and attempts>=8 and (p_request_id is null or rfq_id=p_request_id);
 return query update public.rfq_outbox set state='sending',locked_until=now()+interval '5 minutes',attempts=attempts+1
 where id in (select id from public.rfq_outbox where (p_request_id is null or rfq_id=p_request_id) and attempts<8
 and ((state='pending' and next_attempt_at<=now()) or (state='sending' and locked_until<now()))
 order by created_at for update skip locked limit greatest(0,least(p_limit,20))) returning *;
end;$$;

revoke all on function public.rfq_rate_limit(text,integer,integer),public.rfq_create(text,text,jsonb,uuid[]),public.rfq_update(uuid,integer,text,text,text,uuid,uuid),public.rfq_claim_mail(uuid,integer) from public,anon,authenticated;
grant execute on function public.rfq_rate_limit(text,integer,integer),public.rfq_create(text,text,jsonb,uuid[]),public.rfq_update(uuid,integer,text,text,text,uuid,uuid),public.rfq_claim_mail(uuid,integer) to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('rfq-drawings','rfq-drawings',false,20971520,array['application/pdf','image/png','image/jpeg','application/dxf','image/vnd.dxf','image/vnd.dwg','application/acad','model/step','application/step','model/iges','application/iges','application/octet-stream'])
 on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
-- Do not add anonymous storage policies. Uploads use short-lived signed URLs; staff downloads are server authorised.

-- Reserve upload slots transactionally, before issuing signed upload URLs.
create function public.rfq_reserve_upload(p_id uuid,p_owner_hash text,p_path text,p_name text,p_size bigint,p_mime text) returns void language plpgsql security invoker set search_path='' as $$
declare count_files integer; total_bytes bigint;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_owner_hash,0));
 if exists(select 1 from public.rfq_requests where owner_hash=p_owner_hash) then raise exception 'ALREADY_SUBMITTED'; end if;
 select count(*),coalesce(sum(size),0) into count_files,total_bytes from public.rfq_uploads where owner_hash=p_owner_hash;
 if count_files>=6 or total_bytes+p_size>41943040 then raise exception 'UPLOAD_LIMIT'; end if;
 insert into public.rfq_uploads(id,owner_hash,path,name,size,mime_type) values(p_id,p_owner_hash,p_path,p_name,p_size,p_mime);
end;$$;
revoke all on function public.rfq_reserve_upload(uuid,text,text,text,bigint,text) from public,anon,authenticated;
grant execute on function public.rfq_reserve_upload(uuid,text,text,text,bigint,text) to service_role;

-- Claim abandoned uploads before deleting objects; a claimed upload cannot be attached.
create function public.rfq_claim_orphan_uploads() returns table(id uuid,path text) language sql security invoker set search_path='' as $$
 update public.rfq_uploads set deletion_started_at=coalesce(deletion_started_at,now())
 where rfq_uploads.id in (select u.id from public.rfq_uploads u where u.rfq_id is null and u.created_at<now()-interval '24 hours' order by u.created_at for update skip locked limit 100)
 returning rfq_uploads.id,rfq_uploads.path;
$$;
revoke all on function public.rfq_claim_orphan_uploads() from public,anon,authenticated;
grant execute on function public.rfq_claim_orphan_uploads() to service_role;

create function public.rfq_claim_retention() returns table(id uuid) language sql security invoker set search_path='' as $$
 update public.rfq_requests set deletion_started_at=coalesce(deletion_started_at,now())
 where rfq_requests.id in (select r.id from public.rfq_requests r where r.status='Closed' and r.closed_at<now()-interval '365 days' order by r.closed_at for update skip locked limit 20)
 returning rfq_requests.id;
$$;
revoke all on function public.rfq_claim_retention() from public,anon,authenticated;
grant execute on function public.rfq_claim_retention() to service_role;
commit;
