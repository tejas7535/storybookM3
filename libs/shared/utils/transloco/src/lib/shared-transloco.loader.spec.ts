import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Translation } from '@ngneat/transloco';

import { I18N_CACHE_CHECKSUM, LOADER_PATH } from './injection-tokens';
import { SharedHttpLoader } from './shared-transloco.loader';

describe('Transloco Loader', () => {
  let loader: SharedHttpLoader;
  let http: HttpTestingController;

  let spectator: SpectatorService<SharedHttpLoader>;
  const createService = createServiceFactory({
    service: SharedHttpLoader,
    imports: [HttpClientTestingModule],
    providers: [
      SharedHttpLoader,
      { provide: I18N_CACHE_CHECKSUM, useValue: undefined },
      { provide: LOADER_PATH, useValue: '/assets/i18n/' },
    ],
  });

  describe('getTranslation', () => {
    it('should load json file', () => {
      spectator = createService();
      loader = spectator.inject(SharedHttpLoader);
      http = spectator.inject(HttpTestingController);
      const lang = 'en';
      const mock = { test: 'Test in English' };

      loader.getTranslation(lang).subscribe((translation: Translation) => {
        expect(translation).toEqual(mock);
      });

      http.expectOne('/assets/i18n/en.json').flush(mock);
    });

    it('should attach the checksum', () => {
      spectator = createService({
        providers: [
          { provide: I18N_CACHE_CHECKSUM, useValue: { en: 'hello' } },
        ],
      });
      loader = spectator.inject(SharedHttpLoader);
      http = spectator.inject(HttpTestingController);

      const lang = 'en';
      const mock = { test: 'Test in English' };

      loader.getTranslation(lang).subscribe((translation: Translation) => {
        expect(translation).toEqual(mock);
      });

      http.expectOne('/assets/i18n/en.json?v=hello').flush(mock);
    });

    it('should not attach the checksum if the key is not defined', () => {
      spectator = createService({
        providers: [{ provide: I18N_CACHE_CHECKSUM, useValue: { foo: 'bar' } }],
      });
      loader = spectator.inject(SharedHttpLoader);
      http = spectator.inject(HttpTestingController);

      const lang = 'en';
      const mock = { test: 'Test in English' };

      loader.getTranslation(lang).subscribe((translation: Translation) => {
        expect(translation).toEqual(mock);
      });

      http.expectOne('/assets/i18n/en.json').flush(mock);
    });

    it('should request translations from the specified path', () => {
      spectator = createService({
        providers: [
          { provide: LOADER_PATH, useValue: 'custom-translation-path/' },
        ],
      });
      loader = spectator.inject(SharedHttpLoader);
      http = spectator.inject(HttpTestingController);

      const lang = 'en';
      const mock = { test: 'Test in English' };

      loader.getTranslation(lang).subscribe((translation: Translation) => {
        expect(translation).toEqual(mock);
      });

      http.expectOne('custom-translation-path/en.json').flush(mock);
    });
  });
});
