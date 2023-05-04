/**
 * Rounds a number to meaningful precision.
 * @param num
 * @returns
 */
export function meaningfulRound(num: number): number {
  if (!num) {
    return num;
  }

  if (num >= 1000) {
    return Math.round(num / 10) * 10;
  } else if (num >= 100) {
    return Math.round(num);
  } else if (num >= 10) {
    return Number.parseFloat(num.toFixed(1));
  } else {
    return Number.parseFloat(num.toFixed(2));
  }
}
