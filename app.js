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
    FOOTER
══════════════════════════════════════════════ */

// Copy email button
document.querySelectorAll('.sf-copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(btn.dataset.email); } catch (e) {}
        btn.classList.add('copied');
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.classList.remove('copied'); btn.textContent = 'Copy'; }, 1800);
    });
});

// Live Pacific time
const timeEl = document.querySelector('.sf-time');
const emojiEl = document.querySelector('.sf-time-emoji');

function updateTime() {
    if (!timeEl) return;
    const now = new Date();

    // e.g. "2:21 PM PST" (switches to PDT in summer automatically)
    timeEl.textContent = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
    }).format(now);

    // Pick an emoji based on the hour in Pacific time
    const hour = Number(new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles', hour: 'numeric', hourCycle: 'h23'
    }).format(now));

    let emoji = '🌙 (probably asleep)';
    if (hour >= 6 && hour < 12) emoji = '☀️';
    else if (hour >= 12 && hour < 18) emoji = '🌤️';
    else if (hour >= 18 && hour < 23) emoji = '🌆';
    if (emojiEl) emojiEl.textContent = emoji;
}

updateTime();
setInterval(updateTime, 30000); // refresh every 30 seconds
