import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Translation } from '@ngneat/transloco';

import { SharedHttpLoader } from './shared-transloco.loader';

describe('Transloco Loader', () => {
  let loader: SharedHttpLoader;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SharedHttpLoader]
    });
    loader = TestBed.get(SharedHttpLoader);
    http = TestBed.get(HttpTestingController);
  });

  describe('getTranslation', () => {
    it('should load json file', () => {
      const lang = 'en';
      const mock = { test: 'Test in English' };

      loader.getTranslation(lang).subscribe((translation: Translation) => {
        expect(translation).toEqual(mock);
      });

      http.expectOne('/assets/i18n/en.json').flush(mock);
    });
  });
});
