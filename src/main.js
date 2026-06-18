import './styles/main.css';
import { generateTitles } from './utils/groq.js';
import { findLiterature } from './utils/openalex.js';
import { renderTitleCards, renderTitleSkeletons } from './components/titleCards.js';
import { renderLiterature, renderLiteratureSkeletons } from './components/literatureCards.js';

// ─── ROUTER ──────────────────────────────────────────────────────────────────
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });
  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.add('active');
  window.scrollTo(0, 0);
}

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    navigate(a.dataset.page);
  });
});

// ─── HOME PAGE LOGIC ──────────────────────────────────────────────────────────
const keywordInput = document.getElementById('keyword-input');
const generateBtn = document.getElementById('generate-btn');
const statusBar = document.getElementById('status-bar');
const statusText = document.getElementById('status-text');
const errorBox = document.getElementById('error-box');
const titlesSection = document.getElementById('titles-section');
const literatureSection = document.getElementById('literature-section');

function setStatus(msg, show = true) {
  statusText.textContent = msg;
  statusBar.classList.toggle('visible', show);
}

function setError(msg) {
  document.getElementById('error-msg').textContent = msg;
  errorBox.classList.add('visible');
}

function clearError() {
  errorBox.classList.remove('visible');
}

function setLoading(loading) {
  generateBtn.disabled = loading;
  generateBtn.textContent = loading ? 'Generating...' : 'Generate';
}

async function handleGenerate() {
  const keywords = keywordInput.value.trim();
  if (!keywords) {
    setError('Please enter a research topic or keywords.');
    return;
  }

  clearError();
  titlesSection.style.display = 'none';
  literatureSection.style.display = 'none';
  setLoading(true);
  setStatus('Generating thesis titles via Groq…');
  renderTitleSkeletons();

  try {
    const result = await generateTitles(keywords);
    const titles = result.titles;

    if (!titles || titles.length === 0) throw new Error('No titles returned.');

    setStatus('', false);
    renderTitleCards(titles, handleTitleSelect);
  } catch (err) {
    setStatus('', false);
    titlesSection.style.display = 'none';
    setError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
}

async function handleTitleSelect(titleItem) {
  literatureSection.style.display = 'none';
  setStatus('Finding relevant literature via OpenAlex…');
  renderLiteratureSkeletons();

  try {
    const papers = await findLiterature(titleItem.title);
    setStatus('', false);
    renderLiterature(papers);
    literatureSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    setStatus('', false);
    setError('Failed to fetch literature: ' + err.message);
    literatureSection.style.display = 'none';
  }
}

generateBtn.addEventListener('click', handleGenerate);
keywordInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleGenerate();
});

// Init
navigate('home');
