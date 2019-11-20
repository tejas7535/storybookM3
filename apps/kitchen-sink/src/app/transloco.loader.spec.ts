import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Translation } from '@ngneat/transloco';

import * as mock from '../assets/i18n/en.json';
import { HttpLoader } from './transloco.loader';

describe('Transloco Loader', () => {
  let loader: HttpLoader;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpLoader]
    });
    loader = TestBed.get(HttpLoader);
    http = TestBed.get(HttpTestingController);
  });

  describe('getTranslation', () => {
    it('should load json file', () => {
      const lang = 'en';

      loader.getTranslation(lang).subscribe((translation: Translation) => {
        expect(translation).toEqual(mock);
      });

      http.expectOne('/assets/i18n/en.json').flush(mock);
    });
  });
});
