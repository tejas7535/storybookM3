import { TranslocoService } from '@jsverse/transloco';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import esJson from './i18n/es.json';
import frJson from './i18n/fr.json';
import jaJson from './i18n/ja.json';
import ruJson from './i18n/ru.json';
import zhJson from './i18n/zh.json';
import { ReportModule } from './report.module';

describe('ReportModule', () => {
  describe('setLanguageFiles', () => {
    test('should set the language file locale', () => {
      const serviceMock = {
        setTranslation: jest.fn(),
      } as unknown as TranslocoService;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      new ReportModule(serviceMock);

      expect(serviceMock.setTranslation).toHaveBeenCalledTimes(7);
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(enJson, 'en');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(deJson, 'de');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(esJson, 'es');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(frJson, 'fr');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(jaJson, 'ja');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(ruJson, 'ru');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(zhJson, 'zh');
    });
  });
});
