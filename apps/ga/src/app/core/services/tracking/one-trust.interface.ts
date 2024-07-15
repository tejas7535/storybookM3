export enum ConsentValues {
  ConsentGiven = 1,
  ConsentNotGiven = 0,
  ConsentNotDefined = -1,
}

export interface ConsentResponse {
  isTrusted: string;
  categoryId: string;
  consentStatus: ConsentValues;
}

export interface OneTrustInterface {
  /**
   *
   * @param storageLocation location of the storage obtain from oneTrust website once application is configured named CDN Location
   * @param domainId appId obtain from oneTrust website once application is configured named App ID
   * @param langCode desired language code
   * @param params additional params
   * @param callback callback function to be called after the sdk is started
   * @returns
   */
  startSDK: (
    storageLocation: string,
    domainId: string,
    langCode: string,
    params: any,
    callback: (status: any) => void,
    errorCallback: (error: any) => void
  ) => void;
  observeChanges: (categoryId: string) => void;
  shouldShowBanner: (callback: (shouldShow: boolean) => void) => void;
  showBannerUI: () => void;
}
