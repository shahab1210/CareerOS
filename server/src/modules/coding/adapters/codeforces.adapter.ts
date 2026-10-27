export interface CodeforcesStats {
  solved: number;
  rating: number;
  rank: number;
  streak: number;
  maxRating?: number;
  rankTitle?: string;
}

export async function fetchCodeforcesStats(username: string): Promise<CodeforcesStats> {
  try {
    // 1. Fetch user rating and ranking info
    const infoRes = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(username)}`, {
      headers: { 'User-Agent': 'CareerOS-Platform/1.0' }
    });

    let rating = 0;
    let rank = 0;
    let rankTitle = '';
    let maxRating = 0;

    if (infoRes.ok) {
      const infoData = await infoRes.json();
      if (infoData.status === 'OK' && infoData.result && infoData.result.length > 0) {
        const user = infoData.result[0];
        rating = user.rating || 0;
        maxRating = user.maxRating || 0;
        rankTitle = user.rank || 'Unrated';
      }
    }

    // 2. Fetch distinct solved count from submissions
    let solved = 0;
    const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(username)}&from=1&count=1000`, {
      headers: { 'User-Agent': 'CareerOS-Platform/1.0' }
    });

    if (statusRes.ok) {
      const statusData = await statusRes.json();
      if (statusData.status === 'OK' && Array.isArray(statusData.result)) {
        const solvedProblems = new Set<string>();
        for (const sub of statusData.result) {
          if (sub.verdict === 'OK' && sub.problem) {
            const key = `${sub.problem.contestId}-${sub.problem.index}`;
            solvedProblems.add(key);
          }
        }
        solved = solvedProblems.size;
      }
    }

    return {
      solved,
      rating,
      rank: 0,
      streak: 0,
      maxRating,
      rankTitle,
    };
  } catch (error) {
    console.error(`Failed to fetch Codeforces stats for ${username}:`, error);
    return { solved: 0, rating: 0, rank: 0, streak: 0 };
  }
}
