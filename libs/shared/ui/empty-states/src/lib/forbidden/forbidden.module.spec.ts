// tslint:disable: no-default-import
import { TestBed } from '@angular/core/testing';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { configureTestSuite } from 'ng-bullet';

import { ForbiddenModule } from './forbidden.module';
import deJson from './i18n/de.json';
import enJson from './i18n/en.json';

describe('ForbiddenModule', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TranslocoModule],
    });
  });

  describe('setLanguageFiles', () => {
    test('should set the german language file for "de"', () => {
      const service = TestBed.inject(TranslocoService);
      service.setTranslation = jest.fn();

      // tslint:disable-next-line: no-unused-expression
      new ForbiddenModule(service);

      expect(service.setTranslation).toHaveBeenCalledTimes(2);
      expect(service.setTranslation).toHaveBeenCalledWith(deJson, 'de');
      expect(service.setTranslation).toHaveBeenCalledWith(enJson, 'en');
    });
  });
});
