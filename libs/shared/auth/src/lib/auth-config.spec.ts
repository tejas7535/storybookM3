import { getAuthConfig } from './auth-config';
import { AzureConfig } from './models';

describe('Auth Config', () => {
  test('should return config', () => {
    const origin = 'http://localhost';
    Object.defineProperty(window, 'location', {
      value: {
        origin,
      },
    });

    const azureConfig = new AzureConfig(
      'tenant',
      'client',
      'app',
      true,
      'loginUrl'
    );

    const config = getAuthConfig(azureConfig);

    expect(config).toEqual({
      issuer: `${azureConfig.loginUrl}${azureConfig.tenantId}/v2.0`,
      tokenEndpoint: `${azureConfig.loginUrl}${azureConfig.tenantId}/oauth2/v2.0/token`,
      loginUrl: `${azureConfig.loginUrl}${azureConfig.tenantId}/oauth2/v2.0/authorize`,
      logoutUrl: `${azureConfig.loginUrl}${azureConfig.tenantId}/oauth2/v2.0/logout`,
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
      showDebugInformation: azureConfig.showDebugInfo,
    });
  });
});
