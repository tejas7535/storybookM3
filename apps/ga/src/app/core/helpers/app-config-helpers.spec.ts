import { TranslocoModule } from '@jsverse/transloco';

import { detectAppDelivery } from '@ga/core/helpers/settings-helpers';

import { OneTrustMobileService } from '../services/tracking/one-trust-mobile.service';
import { getAppFooterLinks } from './app-config-helpers';

jest.mock('@ga/core/helpers/settings-helpers');

const mockedDetectAppDelivery = jest.mocked(detectAppDelivery, {
  shallow: true,
});

const oneTrustMobileService: OneTrustMobileService = {
  showPreferenceCenterUI: jest.fn(),
} as Partial<OneTrustMobileService> as OneTrustMobileService;

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

describe('App Config helpers', () => {
  describe('getAppFooterLinks', () => {
    it('should provide 4 footer links', () => {
      mockedDetectAppDelivery.mockImplementation(() => 'standalone');

      expect(getAppFooterLinks(oneTrustMobileService).length).toBe(4);
    });

    describe('when app delivery is native', () => {
      beforeEach(() => {
        mockedDetectAppDelivery.mockImplementation(() => 'native');
      });

      it('should provide 4 footer links', () => {
        expect(getAppFooterLinks(oneTrustMobileService).length).toBe(4);
      });

      it('should perform onClick action', () => {
        const footerLinks = getAppFooterLinks(oneTrustMobileService);

        const onClick = footerLinks[3].onClick as (event: MouseEvent) => void;

        const event = {
          preventDefault: jest.fn(),
        } as Partial<MouseEvent> as MouseEvent;

        onClick(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(oneTrustMobileService.showPreferenceCenterUI).toHaveBeenCalled();
      });
    });

    it('should provide 0 footer links', () => {
      mockedDetectAppDelivery.mockImplementation(() => 'embedded');

      expect(getAppFooterLinks(oneTrustMobileService).length).toBe(0);
    });
  });
});
