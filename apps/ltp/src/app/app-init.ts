import { KeycloakService } from 'keycloak-angular';

import { environment } from '../environments/environment';

export const initializer = (
  keycloak: KeycloakService
): (() => Promise<any>) => {
  return async (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        await keycloak.init({
          config: {
            url: environment.AUTH_URL,
            realm: environment.KEYCLOAK_REALM,
            clientId: environment.KEYCLOAK_CLIENT
          },
          initOptions: {
            onLoad: 'login-required',
            checkLoginIframe: false
          },
          enableBearerInterceptor: true,
          bearerPrefix: 'Bearer',
          bearerExcludedUrls: ['/assets', '/signout']
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };
};
