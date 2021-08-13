import { TranslocoService } from '@ngneat/transloco';

import deJson from '../assets/i18n/de.json';
import enJson from '../assets/i18n/en.json';
import esJson from '../assets/i18n/es.json';
import frJson from '../assets/i18n/fr.json';
import ruJson from '../assets/i18n/ru.json';
import zhJson from '../assets/i18n/zh.json';
import { LegalModule } from './legal.module';

describe('LegalModule', () => {
  describe('setLanguageFiles', () => {
    test('should set the language file locale', () => {
      const serviceMock = {
        setTranslation: jest.fn(),
      } as unknown as TranslocoService;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      new LegalModule(serviceMock);

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
