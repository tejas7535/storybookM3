/**
 * @jest-environment-options {"url": "http://other-than-localhost"}
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import { Capacitor } from '@capacitor/core';

import { PartnerVersion } from '@ga/shared/models';

import {
  detectAppDelivery,
  detectMediasLoginState,
  detectPartnerVersion,
} from './settings-helpers';

const { origin, top, self } = window;

const isNativePlatformMock = jest.fn();
Capacitor.isNativePlatform = isNativePlatformMock;

describe('Settings helpers', () => {
  afterEach(() => {
    window.origin = origin;
    window.location = { href: 'https://localhost:4200' } as Location;
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

  describe('detectpartnerVersion', () => {
    it('should return undefined', () => {
      expect(detectPartnerVersion()).toBe(undefined);
    });

    it('should return the partnerVersion', () => {
      for (const partnerVersion of Object.values(PartnerVersion)) {
        delete window.origin;
        window.origin = `${partnerVersion}.greaseapp.com`;

        expect(detectPartnerVersion()).toBe(partnerVersion);
      }
    });
  });

  describe('detectMediasLoginState', () => {
    it('should return false with the medias_customer set to anonymous', () => {
      delete window.location;
      window.location = {
        search: new URL('https://localhost:4200/app?medias_customer=anonymous')
          .search,
      } as Location;
      expect(detectMediasLoginState()).toBe(false);
    });

    it('should return true with medias_customer set and not being anoynmous', () => {
      delete window.location;
      window.location = {
        search: new URL('https://localhost:4200/app?medias_customer=Doe')
          .search,
      } as Location;
      expect(detectMediasLoginState()).toBe(true);
    });

    it('should detect false when the parameter is not present', () => {
      delete window.location;
      window.location = {
        search: new URL('https://localhost:4200/app').search,
      } as Location;
      expect(detectMediasLoginState()).toBe(false);
    });
  });
});
