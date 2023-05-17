/**
 * Rounds a number to three significant figures.
 * E.g. 0.0001234 => 0.000123
 * E.g. 1234 => 1230
 * @param num
 * @returns
 */
export function roundToThreeSigFigs(num: number): string {
  if (num === 0) {
    return '0';
  }

  const magnitude: number = Math.floor(Math.log10(Math.abs(num))) + 1;

  if (magnitude >= 3) {
    const divisor: number = Math.pow(10, magnitude - 3);

    return (Math.round(num / divisor) * divisor).toFixed(0);
  } else {
    const factor = Math.pow(10, 3 - magnitude);
    const rounded = Math.round(num * factor) / factor;
    const newMagnitude: number = Math.floor(Math.log10(Math.abs(rounded))) + 1;
    let decimalPlaces = Math.max(0, 3 - newMagnitude);
    if (newMagnitude >= 1) {
      decimalPlaces = Math.min(decimalPlaces, 2); // Limit decimal places to 2 for numbers 1 or greater
    }

    return rounded.toFixed(decimalPlaces);
  }
}
