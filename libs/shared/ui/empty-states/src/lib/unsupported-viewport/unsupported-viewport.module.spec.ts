import { TranslocoService } from '@ngneat/transloco';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import { UnsupportedViewportModule } from './unsupported-viewport.module';

describe('UnsupportedViewportModule', () => {
  describe('setLanguageFiles', () => {
    test('should set the german language file for "de"', () => {
      const serviceMock = {
        setTranslation: jest.fn(),
      } as unknown as TranslocoService;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      new UnsupportedViewportModule(serviceMock);

      expect(serviceMock.setTranslation).toHaveBeenCalledTimes(2);
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(deJson, 'de');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(enJson, 'en');
    });
  });
});
