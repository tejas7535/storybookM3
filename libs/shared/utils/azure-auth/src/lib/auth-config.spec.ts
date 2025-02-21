import { MsalGuardAuthRequest } from '@azure/msal-angular';
import {
  InteractionType,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';

import {
  getMsalGuardConfig,
  getMsalInstanceConfig,
  getMsalInterceptorConfig,
  loggerCallback,
} from './auth-config';
import {
  MsalGuardConfig,
  MsalInterceptorConfig,
  ProtectedResource,
} from './models';
import { MsalInstanceConfig } from './models/msal-instance-config.model';

jest.mock('@azure/msal-browser', () => ({
  ...jest.requireActual<PublicClientApplication>('@azure/msal-browser'),
  PublicClientApplication: jest.fn(),
}));

describe('Azure Auth Config', () => {
  describe('loggerCallback', () => {
    beforeEach(() => {
      global.console = {
        warn: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
        log: jest.fn(),
      } as unknown as Console;
    });

    test('should do nothing when Pii', () => {
      loggerCallback(LogLevel.Info, 'msg', true);

      // eslint-disable-next-line no-console
      expect(console.info).not.toHaveBeenCalled();
    });

    test('should error on loglevel error', () => {
      const message = 'message';
      loggerCallback(LogLevel.Error, message, false);

      expect(console.error).toHaveBeenCalledWith(message);
    });
    test('should info on loglevel info', () => {
      const message = 'message';
      loggerCallback(LogLevel.Info, message, false);

      // eslint-disable-next-line no-console
      expect(console.info).toHaveBeenCalledWith(message);
    });
    test('should debug on loglevel verbose', () => {
      const message = 'message';
      loggerCallback(LogLevel.Verbose, message, false);

      // eslint-disable-next-line no-console
      expect(console.debug).toHaveBeenCalledWith(message);
    });
    test('should warn on loglevel warning', () => {
      const message = 'message';
      loggerCallback(LogLevel.Warning, message, false);

      expect(console.warn).toHaveBeenCalledWith(message);
    });

    test('should log on default', () => {
      const message = 'message';
      loggerCallback('any' as unknown as LogLevel, message, false);

      // eslint-disable-next-line no-console
      expect(console.log).toHaveBeenCalledWith(message);
    });
  });

  describe('getMsalInstanceConfig', () => {
    test('should return created object', () => {
      const config = new MsalInstanceConfig(
        'clientId',
        'tenantId',
        true,
        'redirectUri',
        'postlogoutUri',
        'https://login.microsoftonline.com/',
        true
      );

      const result = getMsalInstanceConfig(config);

      expect(result).toBeDefined();
    });
  });

  describe('getMsalInterceptorConfig', () => {
    test('should return correct config', () => {
      const config = new MsalInterceptorConfig([
        new ProtectedResource('api/*', ['testscope']),
      ]);

      const result = getMsalInterceptorConfig(config);

      expect(result.interactionType).toEqual(InteractionType.Redirect);
      expect(result.protectedResourceMap.get('api/*')).toEqual(['testscope']);
    });
  });

  describe('getMsalGuardConfig', () => {
    test('should return config', () => {
      const config = new MsalGuardConfig(
        'failed route',
        ['testscope'],
        InteractionType.Popup
      );

      const result = getMsalGuardConfig(config);

      expect(result.interactionType).toEqual(InteractionType.Popup);
      expect(result.loginFailedRoute).toEqual('failed route');
      expect((result.authRequest as MsalGuardAuthRequest).scopes).toEqual([
        'testscope',
      ]);
    });
  });
});
