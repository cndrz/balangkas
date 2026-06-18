const OPENALEX_BASE = 'https://api.openalex.org/works';

export async function findLiterature(title) {
  const query = encodeURIComponent(title);
  const url = `${OPENALEX_BASE}?search=${query}&filter=is_paratext:false&sort=cited_by_count:desc&per-page=3&select=title,authorships,publication_year,doi,open_access`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Balangkas/1.0 (mailto:user@example.com)' },
  });

  if (!res.ok) throw new Error(`OpenAlex API error: ${res.status}`);

  const data = await res.json();
  const works = data.results || [];

  return works.map((w) => ({
    title: w.title || 'Untitled',
    authors: (w.authorships || [])
      .slice(0, 3)
      .map((a) => a.author?.display_name || '')
      .filter(Boolean)
      .join(', ') || 'Unknown Authors',
    year: w.publication_year || '—',
    doi: w.doi || null,
    oaUrl: w.open_access?.oa_url || null,
  }));
}
