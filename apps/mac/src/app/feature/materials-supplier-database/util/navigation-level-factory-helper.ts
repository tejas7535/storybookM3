import { MaterialClass, NavigationLevel } from '../constants';

export function navigationLevelFactory<T = any>(
  defaultValue?: T
): {
  [key in MaterialClass]: {
    [NavigationLevel.MATERIAL]: T;
    [NavigationLevel.SUPPLIER]: T;
    [NavigationLevel.STANDARD]: T;
  };
} {
  const innerBase = {
    [NavigationLevel.MATERIAL]: defaultValue,
    [NavigationLevel.SUPPLIER]: defaultValue,
    [NavigationLevel.STANDARD]: defaultValue,
  };

  const base: {
    [key in MaterialClass]?: {
      [NavigationLevel.MATERIAL]: T;
      [NavigationLevel.SUPPLIER]: T;
      [NavigationLevel.STANDARD]: T;
    };
  } = {};

  for (const materialClass of Object.values(MaterialClass)) {
    base[materialClass] = innerBase;
  }

  return base as {
    [key in MaterialClass]: {
      [NavigationLevel.MATERIAL]: T;
      [NavigationLevel.SUPPLIER]: T;
      [NavigationLevel.STANDARD]: T;
    };
  };
}
