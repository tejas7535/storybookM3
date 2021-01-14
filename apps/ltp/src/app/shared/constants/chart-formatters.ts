export const lowPrecisionFormatter = (value: number): string => {
  if ((value * 100) % 10 !== 0) {
    return `${value.toFixed(2)}`;
  }

  return `${value}`;
};

export const scientificFormatter = (value: number): string => {
  return `1.0E + ${Math.log10(value)}`;
};
