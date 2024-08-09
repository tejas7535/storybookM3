// eslint-disable-next-line import/no-extraneous-dependencies
import { Capacitor } from '@capacitor/core';

import { detectAppDelivery } from './settings-helpers';

const { origin, top, self } = window;

const isNativePlatformMock = jest.fn();
Capacitor.isNativePlatform = isNativePlatformMock;

describe('Settings helpers', () => {
  afterEach(() => {
    window.origin = origin;
    Object.defineProperty(window, 'top', { ...top, writable: true });
    Object.defineProperty(window, 'self', { ...self, writable: true });
  });

  describe('detectAppDelivery', () => {
    it('should return standalone', () => {
      expect(detectAppDelivery()).toBe('standalone');
    });

    it('should return native', () => {
      isNativePlatformMock.mockReturnValue(true);

      expect(detectAppDelivery()).toBe('native');
    });

    it('should return embedded', () => {
      isNativePlatformMock.mockReturnValue(false);
      delete window.top;
      delete window.self;

      window.top = {} as WindowProxy;
      window.self = {} as Window & typeof globalThis;

      expect(detectAppDelivery()).toBe('embedded');
    });
  });
});
