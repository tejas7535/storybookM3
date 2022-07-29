/**
 * Convert Celsius to Fahrenheit
 */
export const convertCelsiusToFahrenheit = (centigrade: number): number =>
  Math.round(+centigrade * 1.8 + 32);
