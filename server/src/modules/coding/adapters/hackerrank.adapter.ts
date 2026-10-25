export interface HackerRankStats {
  solved: number;
  rating: number;
  rank: number;
  streak: number;
  badgesCount?: number;
}

export async function fetchHackerRankStats(username: string): Promise<HackerRankStats> {
  try {
    const res = await fetch(`https://www.hackerrank.com/rest/hackers/${encodeURIComponent(username)}/badges`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        'Accept': 'application/json'
      }
    });

    let solved = 0;
    let badgesCount = 0;

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.models)) {
        badgesCount = data.models.length;
        // Total solved problems across badges
        solved = data.models.reduce((acc: number, badge: any) => acc + (badge.solved || 0), 0);
      }
    }

    return {
      solved,
      rating: 0,
      rank: 0,
      streak: 0,
      badgesCount,
    };
  } catch (error) {
    console.error(`Failed to fetch HackerRank stats for ${username}:`, error);
    return { solved: 0, rating: 0, rank: 0, streak: 0 };
  }
}
