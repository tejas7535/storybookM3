import { TranslocoModule } from '@ngneat/transloco';

import { detectAppDelivery } from '@ga/core/helpers/settings-helpers';

import { getAppFooterLinks } from './app-config-helpers';

jest.mock('@ga/core/helpers/settings-helpers');

const mockedDetectAppDelivery = jest.mocked(detectAppDelivery, {
  shallow: true,
});

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

describe('App Config helpers', () => {
  describe('getAppFooterLinks', () => {
    it('should provide 4 footer links', () => {
      mockedDetectAppDelivery.mockImplementation(() => 'standalone');

      expect(getAppFooterLinks().length).toBe(4);
    });

    it('should provide 3 footer links', () => {
      mockedDetectAppDelivery.mockImplementation(() => 'native');

      expect(getAppFooterLinks().length).toBe(3);
    });

    it('should provide 0 footer links', () => {
      mockedDetectAppDelivery.mockImplementation(() => 'embedded');

      expect(getAppFooterLinks().length).toBe(0);
    });
  });
});
