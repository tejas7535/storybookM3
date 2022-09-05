/**
 * Convert Gram to Ounces
 */
export const convertGramToOunces = (gram: number): number =>
  Math.round((+gram / 28.349_52) * 1000) / 1000;
