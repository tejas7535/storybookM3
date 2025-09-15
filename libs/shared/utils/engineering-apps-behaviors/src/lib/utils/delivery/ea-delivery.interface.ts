export interface EaCapacitor {
  isNativePlatform: () => boolean;
  getPlatform: () => string;
}

export enum EMAPlatform {
  IOS = 'ios',
  ANDROID = 'android',
}
