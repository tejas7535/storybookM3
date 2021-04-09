// tslint:disable: no-default-import
import { TranslocoService } from '@ngneat/transloco';

import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
import { UnderConstructionModule } from './under-construction.module';

describe('PageUnderConstructionModule', () => {
  describe('setLanguageFiles', () => {
    test('should set the german language file for "de"', () => {
      const serviceMock = ({
        setTranslation: jest.fn(),
      } as unknown) as TranslocoService;

      // tslint:disable-next-line: no-unused-expression
      new UnderConstructionModule(serviceMock);

      expect(serviceMock.setTranslation).toHaveBeenCalledTimes(2);
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(deJson, 'de');
      expect(serviceMock.setTranslation).toHaveBeenCalledWith(enJson, 'en');
    });
  });
});
