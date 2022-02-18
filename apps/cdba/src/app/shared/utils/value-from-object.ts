export const getValueFromObject = <T>(object: any, key: keyof T) =>
  object ? object[key] : undefined;
