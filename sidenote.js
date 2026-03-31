function buildNotes(notes) {
  const notesCol = document.getElementById('notesCol');
  const noteMap = {};
  const MIN_GAP = 12;

  notes.forEach(note => {
    const el = document.createElement('div');
    el.className = 'sidenote';
    el.id = 'sn-' + note.id;
    el.innerHTML = `
      <div class="sidenote-inner">
        <p>${note.text}</p>
      </div>`;
    notesCol.appendChild(el);
    noteMap[note.id] = el;
  });

  function positionNotes() {
    if (window.innerWidth <= 1024) return;
    const colRect = notesCol.getBoundingClientRect();
    const scrollTop = window.scrollY;
    const colTop = colRect.top + scrollTop;
    let lastBottom = 0;

    notes.forEach(note => {
      const anchor = document.querySelector(`[data-note-id="${note.id}"]`);
      const noteEl = noteMap[note.id];
      if (!anchor || !noteEl) return;
      const anchorRect = anchor.getBoundingClientRect();
      const anchorTop = anchorRect.top + scrollTop;
      let idealTop = anchorTop - colTop + (anchorRect.height / 2) - 20;
      const top = Math.max(idealTop, lastBottom + MIN_GAP);
      noteEl.style.top = top + 'px';
      lastBottom = top + noteEl.offsetHeight;
    });

    if (lastBottom > 0) notesCol.style.minHeight = lastBottom + 'px';
    Object.values(noteMap).forEach(el => el.classList.add('visible'));
  }

  window.addEventListener('load', positionNotes);
  window.addEventListener('resize', positionNotes);
  window.addEventListener('scroll', positionNotes, { passive: true });
}