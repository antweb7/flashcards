/**
 * Sample n items from array without replacement. Does not mutate original.
 */
export function sample<T>(array: T[], n: number): T[] {
  const copy = [...array];
  const result: T[] = [];
  const count = Math.min(n, copy.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return result;
}
