/* ══════════════════════════════════════════════
    PROGRESS BAR
══════════════════════════════════════════════ */
const bar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
    if (!bar) return; // pages without a progress bar (e.g. home)
    const s = document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (s / h * 100) + '%';
}, { passive: true });

/* ══════════════════════════════════════════════
    TOC HIGHLIGHT
══════════════════════════════════════════════ */
const tocLinks = document.querySelectorAll('#tocList a');
const sections = Array.from(tocLinks)
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

const tocObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
    if (e.isIntersecting) {
        tocLinks.forEach(a => a.classList.remove('active'));
        const a = document.querySelector(`#tocList a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
    }
    });
}, { rootMargin: '-60px 0px -60% 0px', threshold: 0 });
sections.forEach(s => tocObs.observe(s));

tocLinks.forEach(a => {
    a.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById(a.getAttribute('href').slice(1))
        ?.scrollIntoView({ behavior: 'smooth' });
    });
});

/* ══════════════════════════════════════════════
    IMAGE SLIDESHOW
══════════════════════════════════════════════ */