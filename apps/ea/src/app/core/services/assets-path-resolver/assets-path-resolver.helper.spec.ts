import { Capacitor } from '@capacitor/core';

import { getAssetsPath } from './assets-path-resolver.helper';

const isNativePlatformMock = jest.fn();
Capacitor.isNativePlatform = isNativePlatformMock;

const platformMock = jest.fn();
Capacitor.getPlatform = platformMock;

describe('Assets Path Resolver Helper', () => {
  describe('when the platform is not native', () => {
    beforeEach(() => {
      isNativePlatformMock.mockReturnValue(false);
    });

    it('should return the correct path for a given asset', () => {
      const assetPath = getAssetsPath();
      expect(assetPath).toEqual('/assets');
    });
  });

  describe('when the platform is native', () => {
    beforeEach(() => {
      isNativePlatformMock.mockReturnValue(true);
    });

    describe('when the platform is iOS', () => {
      beforeEach(() => {
        platformMock.mockReturnValue('ios');
      });

      it('should return the correct path for a given asset', () => {
        const assetPath = getAssetsPath();
        expect(assetPath).toEqual('capacitor://localhost/assets');
      });
    });

    describe('when the platform is Android', () => {
      beforeEach(() => {
        platformMock.mockReturnValue('android');
      });

      it('should return the correct path for a given asset', () => {
        const assetPath = getAssetsPath();
        expect(assetPath).toEqual('https://localhost/assets');
      });
    });
  });
});
