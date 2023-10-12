/**
 * @jest-environment-options {"url": "http://other-than-localhost"}
 */

import { detectAppDelivery } from './settings-helpers';

const { origin, top, self } = window;

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
      delete window.origin;

      window.origin = 'capacitor://';

      expect(detectAppDelivery()).toBe('native');
    });

    it('should return embedded', () => {
      delete window.top;
      delete window.self;

      window.top = {} as WindowProxy;
      window.self = {} as Window & typeof globalThis;

      expect(detectAppDelivery()).toBe('embedded');
    });
  });
});
