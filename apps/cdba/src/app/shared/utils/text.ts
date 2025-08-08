export const toCamelCase = (input: string): string => {
  const words = input.split(/[\s,_-]+/).filter((word) => word !== '');

  return words
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
};
