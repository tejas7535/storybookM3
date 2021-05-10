import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
} from '@azure/msal-angular';
import {
  BrowserCacheLocation,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';

import {
  MsalGuardConfig,
  MsalInstanceConfig,
  MsalInterceptorConfig,
  ProtectedResource,
} from './models';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1; // Remove this line to use Angular Universal

export const loggerCallback = (
  logLevel: LogLevel,
  message: string,
  containsPii: boolean
) => {
  if (containsPii) {
    return;
  }
  switch (logLevel) {
    case LogLevel.Error:
      console.error(message);
      break;
    case LogLevel.Info:
      // eslint-disable-next-line no-console
      console.info(message);
      break;
    case LogLevel.Verbose:
      // eslint-disable-next-line no-console
      console.debug(message);
      break;
    case LogLevel.Warning:
      console.warn(message);
      break;
    default:
      console.log(message);
  }
};

export const getMsalInstanceConfig = (
  msalInstanceConfig: MsalInstanceConfig
): IPublicClientApplication => {
  return new PublicClientApplication({
    auth: {
      clientId: msalInstanceConfig.clientId,
      authority: `${msalInstanceConfig.loginUrl}${msalInstanceConfig.tenantId}/`,
      redirectUri: msalInstanceConfig.redirectUri,
      postLogoutRedirectUri: msalInstanceConfig.postLogoutRedirectUri,
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11. Remove this line to use Angular Universal
    },
    system: {
      loggerOptions: {
        loggerCallback: msalInstanceConfig.loggingEnabled
          ? loggerCallback
          : undefined,
        piiLoggingEnabled: false, // do not log personal information
      },
    },
  });
};

export const getMsalInterceptorConfig = (
  msalInterceptorConfig: MsalInterceptorConfig
): MsalInterceptorConfiguration => {
  const protectedResourceMap = new Map<string, string[]>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', [
    'user.read',
  ]);

  msalInterceptorConfig.protectedResources.forEach(
    (protectedResource: ProtectedResource) => {
      protectedResourceMap.set(
        protectedResource.route,
        protectedResource.scopes
      );
    }
  );

  return {
    protectedResourceMap,
    interactionType: msalInterceptorConfig.interactionType,
  };
};

export const getMsalGuardConfig = (
  msalGuardConfig: MsalGuardConfig
): MsalGuardConfiguration => {
  return {
    interactionType: msalGuardConfig.interactionType,
    loginFailedRoute: msalGuardConfig.loginFailedRoute,
    authRequest: {
      scopes: msalGuardConfig.scopes,
    },
  };
};
