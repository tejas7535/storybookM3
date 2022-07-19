/**
 * @jest-environment-options {"url": "http://other-than-localhost"}
 */

import { detectAppDelivery } from './settings-helpers';

const { origin, top, self } = window;

describe('Settings helpers', () => {
  afterEach(() => {
    window.origin = origin;
    window.top = top;
    window.self = self;
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.top = {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.self = {};

      expect(detectAppDelivery()).toBe('embedded');
    });
  });
});
