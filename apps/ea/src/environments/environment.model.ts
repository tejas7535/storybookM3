export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;
  catalogBaseUrl: string;
  co2BaseUrl: string;
  tenantId: string;
  groupId: string;
  translationPath: string;
}
