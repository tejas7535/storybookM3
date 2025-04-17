export const mergeDefaults = <T>(userConfig: Partial<T> = {}, defaults: T) => ({
  ...defaults,
  ...userConfig,
});
