/* ══════════════════════════════════════════════
    BOIL EFFECT
    Hand-drawn "line boil" wiggle for any element with class="boil".
    Needs the #boil-0/1/2 SVG filters in the page.
══════════════════════════════════════════════ */
document.querySelectorAll('.boil').forEach((el) => {
    // Keep the real sentence for screen readers
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());

    // Wrap every letter in its own span (keeps inner tags like <i> and images)
    const wrap = (node) => {
        [...node.childNodes].forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                const frag = document.createDocumentFragment();
                child.textContent.split(/(\s+)/).forEach((part) => {
                    if (!part) return;
                    if (/^\s+$/.test(part)) { frag.append(' '); return; }
                    const word = document.createElement('span');
                    word.className = 'boil-word';
                    word.setAttribute('aria-hidden', 'true');
                    [...part].forEach((ch) => {
                        const letter = document.createElement('span');
                        letter.className = 'boil-letter';
                        letter.textContent = ch;
                        word.append(letter);
                    });
                    frag.append(word);
                });
                child.replaceWith(frag);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName === 'IMG') child.setAttribute('aria-hidden', 'true');
                wrap(child);
            }
        });
    };
    wrap(el);

    // Skip the animation for people who turned off motion in their settings
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Nudge each letter and swap the edge filter a few times per second
    const letters = el.querySelectorAll('.boil-letter');
    const rand = (n) => (Math.random() * 2 - 1) * n;
    let frame = 0;
    setInterval(() => {
        letters.forEach((l) => {
            l.style.transform = `translate(${rand(0.35)}px, ${rand(0.35)}px) rotate(${rand(0.5)}deg)`;
        });
        el.style.filter = `url(#boil-${frame++ % 3})`;
    }, 150);
});
