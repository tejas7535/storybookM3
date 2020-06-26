import { AzureConfig } from './models';

const origin = window.location.origin;

export const getAuthConfig = ({
  tenantId,
  clientId,
  appId,
  showDebugInfo,
  loginUrl,
}: AzureConfig) => ({
  issuer: `${loginUrl}${tenantId}/v2.0`,
  tokenEndpoint: `${loginUrl}${tenantId}/oauth2/v2.0/token`,
  loginUrl: `${loginUrl}${tenantId}/oauth2/v2.0/authorize`,
  logoutUrl: `${loginUrl}${tenantId}/oauth2/v2.0/logout`,
  redirectUri: origin,
  silentRefreshRedirectUri: `${origin}/silent-refresh.html`,
  silentRefreshTimeout: 1000,
  postLogoutRedirectUri: origin,
  clientId: `${clientId}`,
  scope: `openid profile email ${appId}`,
  strictDiscoveryDocumentValidation: false,
  oidc: true,
  skipIssuerCheck: true,
  responseType: 'id_token token',
  clearHashAfterLogin: false,
  disableAtHashCheck: true,
  showDebugInformation: showDebugInfo,
});
