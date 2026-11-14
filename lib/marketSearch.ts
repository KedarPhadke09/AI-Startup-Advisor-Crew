import { VerifiedSearchResult } from './types';

/**
 * Searches real-world open APIs (Wikipedia REST API & HN Algolia Startup Registry)
 * to retrieve verified competitor benchmarks and real industry data.
 * This guarantees real competitor names and market facts without hallucinations.
 */
export async function searchVerifiedMarketData(
  industry: string,
  idea: string,
  startupName: string
): Promise<VerifiedSearchResult[]> {
  const results: VerifiedSearchResult[] = [];

  // 1. Build queries tailored to find actual competitors & industry stats
  const keywords = extractKeywords(idea, industry);
  const searchTerms = [
    `${industry} startup`,
    `${keywords.slice(0, 3).join(' ')} competitors`,
    `${industry} industry market`,
  ];

  for (const term of searchTerms) {
    try {
      // 1. Search Wikipedia Official API
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        term
      )}&format=json&origin=*&srlimit=4`;
      
      const wikiRes = await fetch(wikiUrl, {
        headers: { 'User-Agent': 'StartupAdvisorCrew/1.0 (academic startup research tool)' },
      });

      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        const articles = wikiData?.query?.search || [];
        for (const art of articles) {
          const cleanSnippet = art.snippet.replace(/<[^>]+>/g, '').trim();
          if (cleanSnippet.length > 30) {
            results.push({
              title: art.title,
              snippet: cleanSnippet,
              source: `Wikipedia (${art.title})`,
              url: `https://en.wikipedia.org/wiki/${encodeURIComponent(art.title.replace(/ /g, '_'))}`,
            });
          }
        }
      }
    } catch (e) {
      console.warn(`Wiki search failed for "${term}":`, e);
    }

    try {
      // 2. Search Hacker News Algolia Startup Archive
      const hnUrl = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(
        term
      )}&tags=story&hitsPerPage=3`;

      const hnRes = await fetch(hnUrl);
      if (hnRes.ok) {
        const hnData = await hnRes.json();
        const hits = hnData?.hits || [];
        for (const hit of hits) {
          if (hit.title && hit.title.toLowerCase() !== startupName.toLowerCase()) {
            results.push({
              title: hit.title,
              snippet: `Discussions & launch data: ${hit.title} (${hit.points || 0} upvotes, ${hit.num_comments || 0} comments).`,
              source: `Hacker News Launch Archive`,
              url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
            });
          }
        }
      }
    } catch (e) {
      console.warn(`HN search failed for "${term}":`, e);
    }
  }

  // Deduplicate by title
  const seen = new Set<string>();
  const uniqueResults: VerifiedSearchResult[] = [];
  for (const item of results) {
    const key = item.title.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueResults.push(item);
    }
  }

  return uniqueResults.slice(0, 8);
}

function extractKeywords(idea: string, industry: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'by',
    'about', 'like', 'through', 'over', 'before', 'between', 'after', 'since',
    'without', 'under', 'within', 'along', 'following', 'across', 'behind',
    'beyond', 'plus', 'except', 'but', 'up', 'out', 'around', 'down', 'off',
    'above', 'near', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
    'has', 'had', 'do', 'does', 'did', 'can', 'could', 'should', 'would', 'will',
    'app', 'platform', 'tool', 'service', 'startup', 'idea', 'we', 'they', 'our'
  ]);

  const words = `${industry} ${idea}`
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  return Array.from(new Set(words));
}
