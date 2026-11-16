/* ══════════════════════════════════════════════
    MASONRY
    Puts each project card into the shortest column, in order.
    Uses the width/height on each cover, so it never waits for images to load.
══════════════════════════════════════════════ */
(function () {
    const grid = document.querySelector('.home-grid');
    if (!grid) return;

    const cards = [...grid.children];
    let current = 0;

    // How many columns for the current screen width (matches style.css)
    function columnCount() {
        if (window.innerWidth <= 740) return 1;
        if (window.innerWidth <= 1040) return 2;
        return 3;
    }

    // A card's height relative to its width, from the cover's width/height
    function cardShape(card) {
        const media = card.querySelector('a img, a video');
        const w = media && Number(media.getAttribute('width'));
        const h = media && Number(media.getAttribute('height'));
        const cover = w && h ? h / w : 0.75;
        return cover + 0.35; // + a little for the logo row and text
    }

    function layout() {
        const n = columnCount();
        if (n === current) return;
        current = n;

        const cols = [];
        const heights = [];
        for (let i = 0; i < n; i++) {
            const col = document.createElement('div');
            col.className = 'masonry-col';
            cols.push(col);
            heights.push(0);
        }

        cards.forEach((card) => {
            const shortest = heights.indexOf(Math.min(...heights));
            cols[shortest].appendChild(card);
            heights[shortest] += cardShape(card);
        });

        grid.replaceChildren(...cols);
        grid.classList.add('is-masonry');

        // Moving a video can pause it, so start them again
        grid.querySelectorAll('video').forEach((v) => v.play().catch(() => {}));
    }

    layout();
    window.addEventListener('resize', layout);
})();
