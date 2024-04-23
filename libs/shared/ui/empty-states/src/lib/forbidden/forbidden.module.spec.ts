import { TranslocoService } from '@jsverse/transloco';

import { ForbiddenModule } from './forbidden.module';
import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import esJson from './i18n/es.json';
import frJson from './i18n/fr.json';
import ruJson from './i18n/ru.json';
import zhJson from './i18n/zh.json';

describe('ForbiddenModule', () => {
  describe('setLanguageFiles', () => {
    test('should set the german language file for "de"', () => {
      const serviceMock = {
        setTranslation: jest.fn(),
      } as unknown as TranslocoService;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      new ForbiddenModule(serviceMock);

      expect(serviceMock.setTranslation).toHaveBeenCalledTimes(6);
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(deJson, 'de');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(enJson, 'en');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(esJson, 'es');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(frJson, 'fr');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(ruJson, 'ru');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(zhJson, 'zh');
    });
  });
});
