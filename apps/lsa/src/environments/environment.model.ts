export interface Environment {
  production: boolean;
  localDev: boolean;
  assetsPath: string;
  lsaApiBaseUrl: string;
  staticStorageUrl: string;
  showDebugJson: boolean;
  enablePDFDownload: boolean;
}
