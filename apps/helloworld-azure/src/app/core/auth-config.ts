import { AuthConfig } from 'angular-oauth2-oidc';

import { environment } from '../../environments/environment';

const baseUrl = 'https://login.microsoftonline.com/';
const origin = window.location.origin;

export const authConfig: AuthConfig = {
  issuer: `${baseUrl}${environment.azureTenantId}/v2.0`,
  tokenEndpoint: `${baseUrl}${environment.azureTenantId}/oauth2/v2.0/token`,
  loginUrl: `${baseUrl}${environment.azureTenantId}/oauth2/v2.0/authorize`,
  logoutUrl: `${baseUrl}${environment.azureTenantId}/oauth2/v2.0/logout`,
  redirectUri: origin,
  silentRefreshRedirectUri: `${origin}/silent-refresh.html`,
  postLogoutRedirectUri: origin,
  clientId: `${environment.azureClientId}`,
  scope: `openid profile email ${environment.azureBackendAPI}`,
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  oidc: true,
  skipIssuerCheck: true,
  responseType: 'id_token token',
  clearHashAfterLogin: false,
  disableAtHashCheck: true,
  silentRefreshTimeout: 1000,
};
