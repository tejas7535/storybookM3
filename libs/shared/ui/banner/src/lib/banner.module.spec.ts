import { TestBed } from '@angular/core/testing';

import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { configureTestSuite } from 'ng-bullet';

import { BannerModule } from './banner.module';

// tslint:disable: no-default-import */
import deJson from './i18n/de.json';
import enJson from './i18n/en.json';
/* tslint:enable: no-default-import */

describe('BannerModule', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TranslocoModule],
    });
  });

  test('should create', () => {
    expect(BannerModule).toBeDefined();
  });

  describe('setLanguageFiles', () => {
    test('should set the german language file for "de"', () => {
      const service = TestBed.inject(TranslocoService);
      service.setTranslation = jest.fn();

      // tslint:disable-next-line: no-unused-expression
      new BannerModule(service);

      expect(service.setTranslation).toHaveBeenCalledTimes(2);
      expect(service.setTranslation).toHaveBeenCalledWith(deJson, 'de');
      expect(service.setTranslation).toHaveBeenCalledWith(enJson, 'en');
    });
  });
});
