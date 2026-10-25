export interface LeetCodeStats {
  solved: number;
  rating: number;
  rank: number;
  streak: number;
  easy?: number;
  medium?: number;
  hard?: number;
}

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats> {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
        }
      }
      userContestRanking(username: $username) {
        rating
        globalRanking
        attendedContestsCount
      }
    }
  `;

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CareerOS-Platform/1.0',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!res.ok) {
      throw new Error(`LeetCode API returned status ${res.status}`);
    }

    const data = await res.json();
    const matchedUser = data.data?.matchedUser;
    const contestRanking = data.data?.userContestRanking;

    if (!matchedUser) {
      return { solved: 0, rating: 0, rank: 0, streak: 0 };
    }

    const submissions = matchedUser.submitStats?.acSubmissionNum || [];
    const all = submissions.find((s: any) => s.difficulty === 'All')?.count || 0;
    const easy = submissions.find((s: any) => s.difficulty === 'Easy')?.count || 0;
    const medium = submissions.find((s: any) => s.difficulty === 'Medium')?.count || 0;
    const hard = submissions.find((s: any) => s.difficulty === 'Hard')?.count || 0;

    const rank = contestRanking?.globalRanking || matchedUser.profile?.ranking || 0;
    const rating = Math.round(contestRanking?.rating || 0);

    return {
      solved: all,
      rating,
      rank,
      streak: 0,
      easy,
      medium,
      hard,
    };
  } catch (error) {
    console.error(`Failed to fetch LeetCode stats for ${username}:`, error);
    return { solved: 0, rating: 0, rank: 0, streak: 0 };
  }
}
