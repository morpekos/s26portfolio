/* ══════════════════════════════════════════════
    ABOUT LETTER (modal)
══════════════════════════════════════════════ */
(function () {
    const letter = document.getElementById('aboutLetter');
    if (!letter || !letter.showModal) return; // very old browsers just follow the link

    const paper = letter.querySelector('.letter');
    const photo = letter.querySelector('.letter-photo');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Builds three paper panels (top, middle, bottom) from copies of the letter,
    // starts them folded, then flips the top and bottom panels open.
    function unfold() {
        photo.classList.remove('is-dropping');
        if (reduceMotion.matches) return;

        const W = paper.offsetWidth;
        const H = paper.offsetHeight;
        const third = H / 3;

        // Shrink the letter while it unfolds so the whole thing is on screen,
        // then grow it to full size at the end.
        const top = paper.getBoundingClientRect().top;
        const s = Math.min(1, (window.innerHeight - top - 24) / H);

        const stage = document.createElement('div');
        stage.className = 'fold-stage';
        stage.setAttribute('aria-hidden', 'true');
        stage.style.transform = `scale(${s})`;

        const inner = document.createElement('div');
        inner.className = 'fold-inner';
        stage.appendChild(inner);

        const panels = [0, 1, 2].map((i) => {
            const panel = document.createElement('div');
            panel.className = 'fold-panel';
            panel.style.top = i * third + 'px';
            panel.style.height = third + 'px';
            panel.style.transformOrigin = i === 0 ? '50% 100%' : '50% 0%';

            const face = document.createElement('div');
            face.className = 'fold-face';
            const copy = paper.cloneNode(true);
            copy.classList.remove('is-folding');
            copy.removeAttribute('id');
            copy.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
            copy.style.width = W + 'px';
            copy.style.height = H + 'px';
            copy.style.top = -i * third + 'px';
            face.appendChild(copy);

            const back = document.createElement('div');
            back.className = 'fold-back';

            panel.append(face, back);
            inner.appendChild(panel);
            return { panel, face };
        });

        paper.classList.add('is-folding');
        paper.appendChild(stage);

        const ease = 'cubic-bezier(.45, .05, .25, 1)';
        const [topPanel, , bottomPanel] = panels;

        // 1. The folded letter rises into place
        inner.animate(
            [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }],
            { duration: 300, easing: 'ease-out', fill: 'backwards' }
        );

        // 2. Top flap opens first (it was folded last, so it sits on top)
        topPanel.panel.animate(
            [{ transform: 'translateZ(2px) rotateX(-180deg)' }, { transform: 'translateZ(0) rotateX(0deg)' }],
            { duration: 600, delay: 300, easing: ease, fill: 'backwards' }
        );
        topPanel.face.animate([{ filter: 'brightness(.8)' }, { filter: 'brightness(1)' }],
            { duration: 600, delay: 300, easing: ease, fill: 'backwards' });

        // 3. Then the bottom flap
        const lastFlip = bottomPanel.panel.animate(
            [{ transform: 'translateZ(1px) rotateX(180deg)' }, { transform: 'translateZ(0) rotateX(0deg)' }],
            { duration: 600, delay: 750, easing: ease, fill: 'backwards' }
        );
        bottomPanel.face.animate([{ filter: 'brightness(.8)' }, { filter: 'brightness(1)' }],
            { duration: 600, delay: 750, easing: ease, fill: 'backwards' });

        // 4. Grow to full size, then swap in the real letter
        lastFlip.finished
            .then(() => (s < 1
                ? stage.animate([{ transform: `scale(${s})` }, { transform: 'scale(1)' }],
                    { duration: 450, easing: 'cubic-bezier(.3, .7, .2, 1)', fill: 'forwards' }).finished
                : null))
            .then(() => {
                stage.remove();
                paper.classList.remove('is-folding');
                dropPhoto(0);
            })
            .catch(() => {}); // animation was cancelled because the letter closed
    }

    function dropPhoto(delay) {
        photo.style.animationDelay = delay + 'ms';
        void photo.offsetWidth;
        photo.classList.add('is-dropping');
    }

    function open() {
        letter.showModal();
        letter.scrollTop = 0;
        unfold();
    }

    function close() {
        letter.close();
        letter.querySelector('.fold-stage')?.remove();
        paper.classList.remove('is-folding');
    }

    // Clicking any About link opens the letter instead of about.html
    document.querySelectorAll('a[href="about.html"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            open();
        });
    });

    // Close with the × button, or by clicking the dimmed area around the paper
    letter.querySelector('.letter-close').addEventListener('click', close);
    letter.addEventListener('click', (e) => {
        if (e.target === letter) close();
    });
    letter.addEventListener('close', () => {
        letter.querySelector('.fold-stage')?.remove();
        paper.classList.remove('is-folding');
    });
})();
