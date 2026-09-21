> Archived Phase 1 research (21 September 2026). Later decisions in the repository README and PHOTO_LOG take precedence: the authorized scope is replacement of the existing site, with its contact details and original logo reused.

# UNIT ALFA — Phase 1 research brief

Research date: 21 September 2026. Scope: research, photography inventory and design specification only. No website layout, application code, generated imagery or deployment has been produced.

## 1. Identity and the central finding

**UNIT ALFA is the Bommasandra sheet-metal / hydraulic-excavator-component manufacturer described in the brief.** Its corporate profile identifies sheet-metal fabrication for light and medium industrial applications, establishment in 1991, hydraulic excavator components, individual proprietorship and GSTIN **29ACLPS6365B1Z8**. TradeIndia independently matches the GSTIN, proprietor and No. 15 address. This is not a software, PEB, industrial-gas or packaging company. [Corporate profile](https://www.unitalfa.in/unit-alfa-company-profile/), [TradeIndia](https://www.tradeindia.com/unit-alfa-5103959/).

**An existing company website was found: [unitalfa.in](https://www.unitalfa.in/).** It matches the exact GSTIN and company details. Its product link leads to [Weldtables.in](https://www.weldtables.in/), which names Unit Alfa as its manufacturer and links back to the corporate site. The future project should therefore be treated as a new manufacturing website with a possible migration from an existing site, rather than assuming a first-ever web presence. Domain ownership and whether this replaces that site remain implementation decisions.

Recommended positioning:

> Sheet-metal pressed and fabricated components for hydraulic excavators and industrial equipment. Manufacturing in Bommasandra, Bengaluru, since 1991.

This is positioning copy based on the sources, not a quotation.

## 2. Company facts and publication decisions

| Item            | Finding                                                                                                                        | Decision for the new website                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trade name      | UNIT ALFA                                                                                                                      | Use this exact business name.                                                                                                                                             |
| Proprietor      | TradeIndia: Sashidhar K G. GST directory: Sashidhar Govindarajulu Kannaiah. Corporate site uses a different ordering/spelling. | Use **Sashidhar K. G.** in ordinary copy and the user-supplied / GST-directory legal name in legal details. Do not silently normalize the corporate site's spelling.      |
| Established     | Corporate About and Profile both say 1991.                                                                                     | Use **Established 1991**.                                                                                                                                                 |
| Legal form      | Individual proprietorship.                                                                                                     | Do not add “Pvt Ltd” or describe a board of directors.                                                                                                                    |
| Address         | No. 15, 1st Cross, KIADB Industrial Area, Bommasandra 4th Phase, Bengaluru, Karnataka 560099.                                  | Use consistently in Contact, footer and structured data.                                                                                                                  |
| GSTIN           | 29ACLPS6365B1Z8                                                                                                                | Publish as a business identifier; do not expose unrelated proprietor identifiers.                                                                                         |
| GST date        | Directory records say 1 July 2017.                                                                                             | This is a tax-registration date, not establishment.                                                                                                                       |
| TradeIndia date | “Registered in 2011.”                                                                                                          | Treat as marketplace registration, not founding.                                                                                                                          |
| Shop area       | Profile: about 6,000 sq ft floor + 4,000 sq ft open area. Home/About/Services: 16,600 sq ft premises.                          | **Unresolved conflict.** Keep the profile's split labelled “published company profile”; omit a current total-area headline until reconciled. Never add all three numbers. |
| Contact phone   | Corporate pages publish +91 8792904185.                                                                                        | A real first-party candidate exists. Record it; confirm it is the intended RFQ line before replacing `[PHONE]`.                                                           |
| Contact email   | Contact/Home: enquiry@unitalfa.com; About/Profile: info@unitalfa.com; Weldtables policies also reference info@unitalfa.in.     | Prefer the Contact-page address as the candidate RFQ inbox, but retain `[EMAIL]` until destination is selected. No message was sent or deliverability tested.             |
| Working hours   | No sufficiently reliable hours established.                                                                                    | Retain `[WORKING_HOURS]`.                                                                                                                                                 |
| Map             | Corporate pages link a Google Maps short URL. Exact entrance/pin not verified.                                                 | Retain `[MAP_EMBED]` during implementation; verify against No. 15 before launch.                                                                                          |

Sources: [About](https://www.unitalfa.in/about-unit-alfa/), [Profile](https://www.unitalfa.in/unit-alfa-company-profile/), [Contact](https://www.unitalfa.in/contact-unit-alfa/), [KnowYourGST](https://www.knowyourgst.com/gst-number-search/unit-alfa-29ACLPS6365B1Z8/), [Tenderkart GST directory](https://tenderkart.in/gst-number-search/29ACLPS6365B1Z8). GST aggregators are secondary records; current government-portal registration status was not independently verified.

## 3. Products and capability boundaries

The company profile names **shims, spacers, cylinder mounting brackets, seat sliders, grease baths and latch assemblies** for hydraulic excavators. The corporate catalogue also illustrates **battery boxes, seat adjusters, lamp guards and covers, mufflers and cabin joints**. [Product and company profile](https://www.unitalfa.in/unit-alfa-company-profile/).

| Product family                          | Evidence / image status                                                                     | Appropriate buyer-facing detail                                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Battery boxes / excavator battery boxes | Named catalogue photo plus official welding video                                           | Fabricated enclosure; ask for envelope, mounting pattern, access/lid arrangement, material, coating and batch quantity. |
| Grease baths                            | Named photograph                                                                            | Formed circular components; ask for drawing, diameter, depth, fit and finish. Do not infer a tank capacity.             |
| Seat sliders / adjusters                | Profile names sliders; catalogue labels photo “seat adjuster”                               | Preserve the catalogue label on its photo; confirm whether slider and adjuster refer to the same assembly.              |
| Cylinder mounting brackets              | Named in profile; no confidently matched photo found                                        | Drawing-specific mounting geometry and hole positions. Do not assign load ratings.                                      |
| Shims and spacers                       | Named in profile; no confidently matched photo found                                        | Ask for thickness, dimensions, material and required tolerances. Publish no invented tolerance range.                   |
| Latch assemblies                        | Named in profile; no confidently matched photo found                                        | Ask for mounting, actuation and mating-component requirements.                                                          |
| Lamp guards, mufflers, cabin joints     | Each has a matching catalogue image                                                         | Include as additional examples of manufactured components. Do not rename the cabin-joint photo as a cylinder bracket.   |
| Custom fabrication and assemblies       | Corporate service descriptions                                                              | Drawing/sample discussion, tooling, forming, welding, machining and assembly subject to feasibility review.             |
| Tool / fixture development              | Corporate service descriptions cover tools, jigs and fixtures                               | Discuss project requirements; no unverified tool-life or turnaround claim.                                              |
| Tool / fixture refurbishment            | Supplied in the user's brief; not independently reconfirmed in the accessible current pages | Keep in the content backlog until service scope is confirmed.                                                           |

Material grades, working thickness range, achievable tolerances, MOQs, output per month, lead times and inspection reports are **not established across this range**. Machine ratings do not prove those product specifications. Use enquiry prompts rather than made-up spec values.

Weldtables is a verified adjacent Unit Alfa product activity. Recommend a modest external link or secondary product note; keep excavator and pressed-component sourcing as the main journey. Its welding-table specifications must not become blanket tolerances for Unit Alfa's component work. [Weldtables](https://www.weldtables.in/).

## 4. Plant and manufacturing evidence

The [corporate profile](https://www.unitalfa.in/unit-alfa-company-profile/) publishes the following equipment. These are **listed capabilities, not an audited inventory as of 2026**.

| Operation          | Published equipment                     | Important boundary                                                   |
| ------------------ | --------------------------------------- | -------------------------------------------------------------------- |
| Shearing           | 6 mm × 1,500 mm shearing machine        | Material basis not given; do not advertise 6 mm for every alloy.     |
| Press work         | 20 T, 75 T and 160 T mechanical presses | Tonnage is not a dimensional tolerance or universal part-size limit. |
| Hydraulic pressing | 300 T hydraulic press                   | Bed dimensions and working envelope not found.                       |
| Deburring          | Conveyorized deburring                  | Media, finish and edge requirements need job review.                 |
| Welding            | Spot welding; 400 A MIG/MAG             | Do not infer WPS/PQR qualifications or weld-strength guarantees.     |
| Toolroom           | CNC wire EDM; machine shop              | Travels, accuracy and full machine list not found.                   |

About/Services also mention laser cutting, but without a detailed machine specification or clear in-house/partner distinction. Record this lead; avoid promoting a laser capacity without further evidence. [Services](https://www.unitalfa.in/unit-alfa-services/).

The official [Unit Alfa channel video](https://www.youtube.com/watch?v=l7yseQ1enEg) describes automated robotic welding of an excavator battery box. Playback was visually checked around 00:22: a sheet-metal box, perforated modular table and automated welding torch are visible. This establishes a company-published demonstration, not ownership of a robotic cell or proof of the filming location. Other channel videos explicitly mention client factories, so their interiors must not be presented as Unit Alfa's own plant.

Recommended process explanation: **drawing / sample review → blank preparation / shear → press / form → weld / assemble → deburr / specified finish → inspect against the agreed drawing**. This is a proposed explanatory sequence; actual routing varies by part. Do not imply every operation is in-house, or that the company owns a powder-coating line, merely because a photo shows coating.

## 5. Quality: use evidence, not a badge

The corporate profile and services pages still refer to **ISO 9001:2008**. No current certificate, issuer, scope, certificate number or expiry was verified. ISO's own transition notice states that accredited ISO 9001:2008 certification is no longer valid. [Company claim](https://www.unitalfa.in/unit-alfa-company-profile/), [ISO transition notice](https://committee.iso.org/sites/tc176sc2/home/news/content-left-area/news-and-updates/the-iso-90012015-transition-peri.html).

Recommended transparent wording:

> The published company profile references ISO 9001:2008. Current certification details have not been verified.

Do not put an “ISO certified” seal in the hero, invent ISO 9001:2015/2026, or redraw a certificate. The Quality page can explain the information required for quality planning: drawing revision, material specification, critical dimensions, weld/finish requirements and acceptance criteria. Confirm actual inspection equipment and records before describing them as existing company practice. Avoid unsupported PPAP, CMM, traceability, first-pass-yield or zero-defect promises.

## 6. Real photography selected for the build

**The planned core set is six company-published component photos plus the signed factory exterior.** The company-hosted infrastructure interior is a qualified candidate. Five larger Weldtables photographs provide optional tooling detail, not substitute excavator-product imagery. Exact URLs, saved files, alt text and exclusions are in [PHOTO_LOG.md](PHOTO_LOG.md).

| Asset                                               |                        Available dimensions | Planned placement                                                                                   |
| --------------------------------------------------- | ------------------------------------------: | --------------------------------------------------------------------------------------------------- |
| Battery box                                         |                                   345 × 260 | Products; compact Home product proof                                                                |
| Grease bath                                         |                                   345 × 260 | Products                                                                                            |
| Seat adjuster                                       |                                   345 × 260 | Products                                                                                            |
| Lamp guard & cover                                  |                                   345 × 260 | Products / additional components                                                                    |
| Muffler                                             |                                   345 × 260 | Products / additional components                                                                    |
| Cabin joint                                         |                                   345 × 260 | Products / additional components                                                                    |
| Exterior with Unit Alfa sign                        |                                   640 × 320 | About and Contact; identify as existing published photography                                       |
| Interior with yellow gantry                         |                                   680 × 510 | Capabilities / About; company-published infrastructure photograph, current configuration unverified |
| Weldtable assembly / corner / ribs / face / modules |                  Five images, 1,080 × 1,080 | Optional tooling/assembly detail and external Weldtables reference                                  |
| Excavator battery-box welding video                 | About two minutes; visual excerpt inspected | Click-to-play process feature; no autoplay background                                               |

The six catalogue images show genuine part photography with modest backgrounds and uneven quality. Keep that honesty. Display close to their native resolution; do not enlarge a 345 px image to fill a desktop hero or imply detail through AI upscaling. The purple video title card is not a suitable poster for this design.

No usable, individually identified photographs of the listed shear, presses or wire EDM were confirmed. Brackets, shims/spacers and latches also lack verified matching photos. These are **asset gaps**, not permission to show a generic machine as Unit Alfa's. Plan company originals or fresh photography first; if no real image is obtainable, an explicitly labelled illustrative generated image may be considered later under the user's rules. Nothing has been generated in Phase 1.

The corporate site contains stock-like process imagery and client-logo files. Company hosting alone does not prove that every depicted factory is Unit Alfa's. Exclude these images as plant evidence. Public logo claims including Komatsu were found, but no client relationship was independently confirmed; the recommended design needs no customer-logo strip.

## 7. What the comparable manufacturers establish

Seven comparable websites were studied: **Deva Industries, MST Precision Technology, TSK Industrial Services, Excellent Dies & Moulds, Sri Sai Industries, Orbit Laser Cutting and NASH Industries**. They cover Bengaluru, Hosur and Pune; NASH is a larger-scale off-highway benchmark. See [COMPETITOR_REVIEW.md](COMPETITOR_REVIEW.md) for source links and observations.

The recurring information architecture is company history, processes/capabilities, plant/equipment, finished-product galleries, quality and direct enquiry/contact. Machine-capacity tables and actual part close-ups answer procurement questions more directly than abstract service icons. Drawings are usually requested privately by email or upload; finished parts are public. Do not publish customer drawings without an authorized example.

Real sites use varied colors and fonts: blue/white, dark navy/yellow, red/charcoal, teal/charcoal and drawing-paper neutrals. Some also use generic fonts and marketing templates. The charcoal/steel/orange recommendation below is a deliberate fit to Unit Alfa's material and photography, not a claim that all manufacturers use it.

## 8. Recommended sitemap and content intent

| URL              | Page / unique search title                                   | Content and evidence                                                                                                   | Buyer action                            |
| ---------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `/`              | UNIT ALFA — Sheet-Metal & Excavator Components, Bengaluru    | Exact manufacturer positioning, 1991, Bommasandra, compact real parts, process/plant preview                           | Request a quote; inspect products       |
| `/about/`        | About UNIT ALFA — Bommasandra Manufacturer Since 1991        | Proprietor, address, origin, exterior; explain published area rather than inflate it                                   | Discuss a part                          |
| `/capabilities/` | Pressing, Fabrication & Plant Capabilities — UNIT ALFA       | Machine table, part-dependent process sequence, tooling, qualified infrastructure image, welding video                 | Send requirements                       |
| `/products/`     | Excavator Battery Boxes & Sheet-Metal Components — UNIT ALFA | All requested families; six exact named photographs; photo gaps resolved before claiming complete catalogue            | Product-prefilled RFQ                   |
| `/quality/`      | Quality Requirements & Certification Status — UNIT ALFA      | Honest ISO status, drawing/inspection requirements, verified practice only                                             | Include quality requirements            |
| `/enquiry/`      | Request a Quote — UNIT ALFA Component Manufacturing          | Part name, quantity, material, thickness, industry, drawing/sample availability, delivery requirement, contact details | Submit only when delivery is configured |
| `/contact/`      | Contact UNIT ALFA — Bommasandra, Bengaluru                   | Full postal address, GSTIN, selected phone/email, hours, verified map/entrance, Hosur Road approach                    | Call, email, directions                 |
| `/privacy/`      | Privacy — UNIT ALFA                                          | Stub until actual form delivery, data retention and service providers are known                                        | Read data handling                      |
| `/terms/`        | Website Terms — UNIT ALFA                                    | Website-use and quotation-basis stub; no invented commercial terms                                                     | Understand enquiry status               |

Use separate generated HTML pages and ordinary links. Product detail pages should follow only when there is enough distinct verified copy, photography and specifications; do not create thin pages solely for keywords. Privacy and Terms belong in the footer. No blog is required for launch.

Contact directions should mention the Hosur Road / Bommasandra industrial belt. Include the Yellow Line as regional arrival context only after checking the factory entrance and relevant station connection; do not invent a nearest-station walking distance, exit number or travel time. The published [company map link](https://maps.app.goo.gl/bueVTNxHDbxbZMvi6) is a lead, not a pin verification.

## 9. Industrial visual direction

**A drawing sheet beside a working press shop:** graphite structure, off-white information surfaces, raw steel photography and one safety-orange accent. Strong condensed headings, readable body text, precise rules and table labels. Let folded edges, weld seams, punch holes and actual surfaces carry the identity. See [DESIGN_TOKENS.md](DESIGN_TOKENS.md).

Home should make the part and the manufacturing location obvious immediately. Vary subsequent structure: a numbered process sequence, a proper machine table, compact product images with specification prompts, a plant photograph with a source-aware caption, and a short RFQ invitation. Avoid repeated three-card rows, decorative gradients, glass panels, generic icons, giant empty sections and fake achievement counters.

Motion should clarify sequence: one restrained entrance, once-only scroll reveals, focus/hover feedback, native-size photo inspection, and an optional process selector that keeps all information reachable. No scroll hijacking, synthetic factory tour or invented before/after. Reduced-motion mode must retain all information with movement removed.

## 10. Recommended stack and implementation constraints

**Astro with static generation, TypeScript and owned CSS** is the recommended stack. This is a small, content-led multi-page manufacturing site; static HTML suits it, with small client scripts for navigation, disclosure, gallery and form feedback. Astro prerenders pages by default. [Astro rendering documentation](https://docs.astro.build/en/guides/on-demand-rendering/).

Use CSS plus IntersectionObserver for modest animation; add a focused animation library only if a verified interaction needs it. Keep facts, product data, source references and contact placeholders in shared content modules. Self-host licensed font files and optimized responsive images. No framework installation has occurred.

RFQ fields must be labelled and usable on mobile. Product links prefill the part name while leaving it editable. Show drawing upload as **not yet connected** until a real secure recipient and service exist; selecting a file must never trigger a fake success message. A local demo must not claim to send email. A quotation is subject to review, not an instant binding offer. Avoid promising a 24-hour response without a company commitment.

For structured data, use one stable business entity represented with valid **Organization / LocalBusiness** types, then reference it through the **`manufacturer` property of Product records** where appropriate. `Manufacturer` is not the documented Schema.org organization type requested by that spelling; do not invent an invalid `@type`. Include address, GST as an identifier and 1991; omit unknown geo, hours, phone/email placeholders, offers, ratings and certification claims. [Schema.org manufacturer property](https://schema.org/manufacturer), [LocalBusiness](https://schema.org/LocalBusiness).

The build needs unique descriptions, canonical URLs, Open Graph title/type/URL/description, sitemap, robots, crawlable links and consistent Bangalore/Bengaluru/Bommasandra wording. Resolve the production domain and any redirects from existing pages before setting canonical URLs. No fake social-preview image or placeholder metadata.

## 11. Research coverage and remaining questions

| Requested source             | What could be established                                                                                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IndiaMART Home and About     | Web retrieval failed. Browser access was explicitly blocked by site-safety policy. No bypass attempted; contents/photos were not independently read.                                      |
| Justdial                     | Indexed page matches the postal address but calls the business IT Enabled Services/LAMP and lists 2018. Treat category/date as conflicting directory data; no usable image set retrieved. |
| TradeIndia                   | Read successfully: manufacturer/supplier, sheet-metal pressed components, proprietor, GSTIN and exact address. No useful photo gallery found.                                             |
| GST records                  | Two secondary directories corroborate identity/proprietorship/address. No official live status check completed.                                                                           |
| YouTube                      | Official channel linked from Weldtables; six video records catalogued. Excavator welding footage excerpt visually inspected.                                                              |
| Additional first-party pages | Corporate Home, About, Profile, Services, Contact and Weldtables pages read; original photo files saved and visually inspected.                                                           |
| Comparable manufacturers     | Seven content and visual reviews; detailed source pages and enquiry patterns recorded. Forms were inspected, not submitted.                                                               |

Phase 1 is complete with the access limitations above. The brief now establishes the manufacturer, identifies real photographs to use, and specifies the industrial direction. Before launch, resolve the area discrepancy, current quality documentation, preferred RFQ contact, photo gaps, live form delivery and factory pin. The [living TODO](TODO.md) carries those items into the next phase. **Implementation remains unstarted as requested.**
