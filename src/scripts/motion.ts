const root = document.documentElement;
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector<HTMLElement>('.site-header');
const progress = document.querySelector<HTMLElement>('.reading-progress');
let observer: IntersectionObserver | undefined;
let frame = 0;

// Advance only with the reader's real scroll position. Scrolling remains native.
const updateProgress = () => {
  frame = 0;
  const distance = Math.max(0, root.scrollHeight - window.innerHeight);
  const fraction = distance ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
  progress?.style.setProperty('--reading-progress', String(fraction));
  header?.classList.toggle('is-scrolled', window.scrollY > 20);
};
const scheduleProgress = () => {
  if (!frame) frame = window.requestAnimationFrame(updateProgress);
};

function revealSections() {
  observer?.disconnect();
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>('[data-reveal], .intro-grid > *, .quote-inner > *'),
  );
  if (preference.matches || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.remove('reveal-ready'));
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      let order = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.style.setProperty('--reveal-delay', `${Math.min(order++ * 75, 225)}ms`);
        element.classList.add('is-revealed');
        observer?.unobserve(element);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
  );

  elements.forEach((element) => {
    // Never hide content already visible when the script arrives, including a deep link.
    if (element.getBoundingClientRect().top < window.innerHeight - 20) {
      element.classList.add('is-revealed');
      return;
    }
    element.classList.add('reveal-ready');
    observer?.observe(element);
  });
}

preference.addEventListener('change', () => {
  root.classList.toggle('motion-enabled', !preference.matches);
  root.classList.remove('intro-pending');
  revealSections();
});
window.addEventListener('scroll', scheduleProgress, { passive: true });
window.addEventListener('resize', scheduleProgress, { passive: true });
window.addEventListener('pageshow', scheduleProgress);
if ('ResizeObserver' in window) new ResizeObserver(scheduleProgress).observe(document.body);
document.addEventListener('focusin', (event) => {
  if (!(event.target instanceof Element)) return;
  const section = event.target.closest<HTMLElement>('.reveal-ready');
  if (section) {
    section.classList.add('is-revealed');
    observer?.unobserve(section);
  }
});
revealSections();
updateProgress();
