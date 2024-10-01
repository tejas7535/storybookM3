export function countComparator(
  a: { count: number },
  b: { count: number }
): number {
  if (a.count === b.count) {
    return 0;
  }

  return a.count > b.count ? 1 : -1;
}
