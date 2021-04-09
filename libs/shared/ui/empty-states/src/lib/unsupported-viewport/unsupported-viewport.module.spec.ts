// tslint:disable: no-default-import
import { TranslocoService } from '@ngneat/transloco';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import { UnsupportedViewportModule } from './unsupported-viewport.module';

describe('UnsupportedViewportModule', () => {
  describe('setLanguageFiles', () => {
    test('should set the german language file for "de"', () => {
      const serviceMock = ({
        setTranslation: jest.fn(),
      } as unknown) as TranslocoService;

      // tslint:disable-next-line: no-unused-expression
      new UnsupportedViewportModule(serviceMock);

      expect(serviceMock.setTranslation).toHaveBeenCalledTimes(2);
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(deJson, 'de');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(enJson, 'en');
    });
  });
});
