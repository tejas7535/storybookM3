/* eslint-disable */
import { TranslocoService } from '@ngneat/transloco';

import { ForbiddenModule } from './forbidden.module';
import deJson from './i18n/de.json';
import enJson from './i18n/en.json';

describe('ForbiddenModule', () => {
  describe('setLanguageFiles', () => {
    test('should set the german language file for "de"', () => {
      const serviceMock = {
        setTranslation: jest.fn(),
      } as unknown as TranslocoService;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      new ForbiddenModule(serviceMock);

      expect(serviceMock.setTranslation).toHaveBeenCalledTimes(2);
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(deJson, 'de');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(enJson, 'en');
    });
  });
});
