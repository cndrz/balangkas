export function renderTitleCards(titles, onSelect) {
  const grid = document.getElementById('titles-grid');
  grid.innerHTML = '';

  titles.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'title-card';
    card.dataset.index = i;

    card.innerHTML = `
      <div class="card-index">TITLE ${String(i + 1).padStart(2, '0')}</div>
      <div class="card-title">${item.title}</div>
      <div class="card-meta">${item.feasibility}</div>
      <span class="feasibility-badge">${item.level}</span>
      <div class="card-action-hint">Select →</div>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.title-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      onSelect(item);
    });

    grid.appendChild(card);
  });

  document.getElementById('titles-section').style.display = 'block';
}

export function renderTitleSkeletons() {
  const grid = document.getElementById('titles-grid');
  grid.innerHTML = '';

  for (let i = 0; i < 3; i++) {
    const card = document.createElement('div');
    card.className = 'skeleton-card';
    card.innerHTML = `
      <div class="skeleton" style="width:40px; height:0.6rem; margin-bottom:0.6rem;"></div>
      <div class="skeleton" style="width:90%; height:1rem; margin-bottom:0.4rem;"></div>
      <div class="skeleton" style="width:70%; height:1rem; margin-bottom:0.8rem;"></div>
      <div class="skeleton" style="width:60%; height:0.75rem; margin-bottom:0.4rem;"></div>
      <div class="skeleton" style="width:75%; height:0.75rem;"></div>
    `;
    grid.appendChild(card);
  }

  document.getElementById('titles-section').style.display = 'block';
}
