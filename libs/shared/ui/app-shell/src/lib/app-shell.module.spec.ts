import { TranslocoService } from '@jsverse/transloco';

import { AppShellModule } from './app-shell.module';
import deutsch from './i18n/de.json';
import english from './i18n/en.json';
import spanish from './i18n/es.json';
import french from './i18n/fr.json';
import indoenesianBahasa from './i18n/id.json';
import italian from './i18n/it.json';
import japanese from './i18n/ja.json';
import korean from './i18n/ko.json';
import russian from './i18n/ru.json';
import thai from './i18n/th.json';
import vietnamese from './i18n/vi.json';
import chineseSimplified from './i18n/zh.json';
import chineseTraditional from './i18n/zh_TW.json';

describe('AppShellModule', () => {
  describe('setLanguageFiles', () => {
    test('should set the german language file for "de"', () => {
      const serviceMock = {
        setTranslation: jest.fn(),
      } as unknown as TranslocoService;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      new AppShellModule(serviceMock);

      expect(serviceMock.setTranslation).toHaveBeenCalledTimes(13);
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(deutsch, 'de');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(english, 'en');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(spanish, 'es');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(french, 'fr');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(
        indoenesianBahasa,
        'id'
      );
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(italian, 'it');

      expect(serviceMock.setTranslation).toHaveBeenCalledWith(japanese, 'ja');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(russian, 'ru');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(
        chineseSimplified,
        'zh'
      );
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(
        chineseTraditional,
        'zh_TW'
      );
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(
        indoenesianBahasa,
        'id'
      );
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(korean, 'ko');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(thai, 'th');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(vietnamese, 'vi');
    });
  });
});
