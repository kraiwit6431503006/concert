export function cosineSimilarity(userA: any, userB: any): number {
  const commonMovies = Object.keys(userA)
    .filter((movie) => userB[movie] !== undefined);

  if (commonMovies.length === 0) return 0;

  let dot = 0, sumA = 0, sumB = 0;

  commonMovies.forEach((movie) => {
    dot += userA[movie] * userB[movie];
    sumA += userA[movie] ** 2;
    sumB += userB[movie] ** 2;
  });

  return dot / (Math.sqrt(sumA) * Math.sqrt(sumB));
}
