import { AzureConfig } from './models';

const baseUrl = 'https://login.microsoftonline.com/';
const origin = window.location.origin;

export const getAuthConfig = (azureConfig: AzureConfig) => ({
  issuer: `${baseUrl}${azureConfig.tenantId}/v2.0`,
  tokenEndpoint: `${baseUrl}${azureConfig.tenantId}/oauth2/v2.0/token`,
  loginUrl: `${baseUrl}${azureConfig.tenantId}/oauth2/v2.0/authorize`,
  logoutUrl: `${baseUrl}${azureConfig.tenantId}/oauth2/v2.0/logout`,
  redirectUri: origin,
  silentRefreshRedirectUri: `${origin}/silent-refresh.html`,
  silentRefreshTimeout: 1000,
  postLogoutRedirectUri: origin,
  clientId: `${azureConfig.clientId}`,
  scope: `openid profile email ${azureConfig.appId}`,
  strictDiscoveryDocumentValidation: false,
  oidc: true,
  skipIssuerCheck: true,
  responseType: 'id_token token',
  clearHashAfterLogin: false,
  disableAtHashCheck: true,
  showDebugInformation: azureConfig.showDebugInfo
});
