import { TranslocoService } from '@ngneat/transloco';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import { ReportModule } from './report.module';

describe('ReportModule', () => {
  describe('setLanguageFiles', () => {
    test('should set the language file locale', () => {
      const serviceMock = {
        setTranslation: jest.fn(),
      } as unknown as TranslocoService;

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      new ReportModule(serviceMock);

      expect(serviceMock.setTranslation).toHaveBeenCalledTimes(2);
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(enJson, 'en');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(deJson, 'de');
    });
  });
});
