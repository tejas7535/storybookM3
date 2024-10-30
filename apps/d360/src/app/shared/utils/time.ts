export const millisecondsInSecond = 1000;
export const secondsInMinutes = 60;

/**
 * Converts minutes to milliseconds
 * @param minutes The minutes to convert
 */
export function minutesToMilliseconds(minutes: number): number {
  return minutes * secondsInMinutes * millisecondsInSecond;
}
