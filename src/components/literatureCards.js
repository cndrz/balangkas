export function renderLiterature(papers) {
  const section = document.getElementById('literature-section');
  const grid = document.getElementById('literature-grid');
  grid.innerHTML = '';

  if (!papers || papers.length === 0) {
    grid.innerHTML = `<div class="lit-card"><div class="lit-title" style="color:#888">No matching studies found for this title. Try a different selection.</div></div>`;
    section.style.display = 'block';
    return;
  }

  papers.forEach((paper, i) => {
    const link = paper.doi
      ? `https://doi.org/${paper.doi.replace('https://doi.org/', '')}`
      : paper.oaUrl;

    const card = document.createElement('div');
    card.className = 'lit-card';
    card.innerHTML = `
      <div class="lit-index">STUDY ${String(i + 1).padStart(2, '0')}</div>
      <span class="citation-badge">${paper.category || 'PAPER'}</span>
      <div class="lit-title">${paper.title}</div>
      <div class="lit-authors">${paper.authors}</div>
      <div class="lit-year">${paper.year}</div>
      ${link
        ? `<a class="lit-link" href="${link}" target="_blank" rel="noopener noreferrer">View Paper ↗</a>`
        : `<span class="lit-link" style="opacity:0.4;cursor:default;">No Link Available</span>`
      }
    `;
    grid.appendChild(card);
  });

  section.style.display = 'block';
}

export function renderLiteratureSkeletons() {
  const section = document.getElementById('literature-section');
  const grid = document.getElementById('literature-grid');
  grid.innerHTML = '';

  for (let i = 0; i < 3; i++) {
    const card = document.createElement('div');
    card.className = 'lit-card';
    card.innerHTML = `
      <div class="skeleton" style="width:50px; height:0.6rem; margin-bottom:0.6rem;"></div>
      <div class="skeleton" style="width:85%; height:0.9rem; margin-bottom:0.4rem;"></div>
      <div class="skeleton" style="width:65%; height:0.9rem; margin-bottom:0.6rem;"></div>
      <div class="skeleton" style="width:40%; height:0.7rem; margin-bottom:0.5rem;"></div>
      <div class="skeleton" style="width:30%; height:0.7rem;"></div>
    `;
    grid.appendChild(card);
  }

  section.style.display = 'block';
}
