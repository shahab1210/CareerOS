export interface CodeChefStats {
  solved: number;
  rating: number;
  rank: number;
  streak: number;
  stars?: string;
}

export async function fetchCodeChefStats(username: string): Promise<CodeChefStats> {
  try {
    // CodeChef public profile endpoint / scraping fallback
    const res = await fetch(`https://www.codechef.com/users/${encodeURIComponent(username)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      return { solved: 0, rating: 0, rank: 0, streak: 0 };
    }

    const html = await res.text();

    // Regex extract rating: <div class="rating-number">1750</div>
    const ratingMatch = html.match(/class="rating-number"[^>]*>(\d+)</);
    const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 0;

    // Regex extract global rank: <a href="/ratings/all"><strong>(\d+)</strong></a>
    const rankMatch = html.match(/href="\/ratings\/all"[^>]*>\s*<strong>(\d+)<\/strong>/i);
    const rank = rankMatch ? parseInt(rankMatch[1], 10) : 0;

    // Regex extract solved count: <h5>Fully Solved \((\d+)\)</h5>
    const solvedMatch = html.match(/Fully Solved\s*\(([0-9]+)\)/i);
    const solved = solvedMatch ? parseInt(solvedMatch[1], 10) : 0;

    // Regex stars
    const starsMatch = html.match(/class="rating-star"[^>]*>([^<]+)</);
    const stars = starsMatch ? starsMatch[1].trim() : undefined;

    return {
      solved,
      rating,
      rank,
      streak: 0,
      stars,
    };
  } catch (error) {
    console.error(`Failed to fetch CodeChef stats for ${username}:`, error);
    return { solved: 0, rating: 0, rank: 0, streak: 0 };
  }
}
