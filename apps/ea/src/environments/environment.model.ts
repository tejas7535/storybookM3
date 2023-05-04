export interface Environment {
  production: boolean;
  localDev: boolean;
  devToolsEnabled: boolean;
  catalogApiBaseUrl: string;
  frictionApiBaseUrl: string;
  co2UpstreamApiBaseUrl: string;
  tenantId: string;
  groupId: string;
  assetsPath: string;
}
