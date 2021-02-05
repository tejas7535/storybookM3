import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Translation } from '@ngneat/transloco';

import { I18N_CACHE_CHECKSUM } from './injection-tokens';
import { SharedHttpLoader } from './shared-transloco.loader';

describe('Transloco Loader', () => {
  let loader: SharedHttpLoader;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SharedHttpLoader,
        { provide: I18N_CACHE_CHECKSUM, useValue: undefined },
      ],
    });
  });

  describe('getTranslation', () => {
    it('should load json file', () => {
      loader = TestBed.inject(SharedHttpLoader);
      http = TestBed.inject(HttpTestingController);

      const lang = 'en';
      const mock = { test: 'Test in English' };

      loader.getTranslation(lang).subscribe((translation: Translation) => {
        expect(translation).toEqual(mock);
      });

      http.expectOne('/assets/i18n/en.json').flush(mock);
    });

    it('should attach the checksum', () => {
      TestBed.overrideProvider(I18N_CACHE_CHECKSUM, {
        useValue: { en: 'hello' },
      });

      loader = TestBed.inject(SharedHttpLoader);
      http = TestBed.inject(HttpTestingController);

      const lang = 'en';
      const mock = { test: 'Test in English' };

      loader.getTranslation(lang).subscribe((translation: Translation) => {
        expect(translation).toEqual(mock);
      });

      http.expectOne('/assets/i18n/en.json?v=hello').flush(mock);
    });

    it('should not attach the checksum if the key is not defined', () => {
      TestBed.overrideProvider(I18N_CACHE_CHECKSUM, {
        useValue: { foo: 'bar' },
      });

      loader = TestBed.inject(SharedHttpLoader);
      http = TestBed.inject(HttpTestingController);

      const lang = 'en';
      const mock = { test: 'Test in English' };

      loader.getTranslation(lang).subscribe((translation: Translation) => {
        expect(translation).toEqual(mock);
      });

      http.expectOne('/assets/i18n/en.json').flush(mock);
    });
  });
});
