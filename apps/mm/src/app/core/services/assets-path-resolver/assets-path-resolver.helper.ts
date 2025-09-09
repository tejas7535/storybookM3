import { Capacitor } from '@capacitor/core';
import { environment } from '@mm/environments/environment';

import {
  EMAPlatform,
  getAssetsPath,
} from '@schaeffler/engineering-apps-behaviors/utils';

export const getMMAssetsPath = () => {
  const platform: EMAPlatform | undefined = Capacitor.isNativePlatform()
    ? (Capacitor.getPlatform() as EMAPlatform)
    : undefined;

  return getAssetsPath(environment.assetsPath, platform);
};
