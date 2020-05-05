import { of } from 'rxjs';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import * as transloco from '@ngneat/transloco';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '../lib/shared-transloco-testing.module';
import {
  preloadLanguage,
  SharedTranslocoModule,
} from './shared-transloco.module';

describe('SharedTranslocoModule for Root', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        provideTranslocoTestingModule({}),
        SharedTranslocoModule.forRoot(true, ['en'], 'en', 'es'),
      ],
    });
  });

  test('should create', () => {
    expect(SharedTranslocoModule).toBeDefined();
  });

  describe('preloadLanguage', () => {
    test('should load language', () => {
      const service = TestBed.inject(transloco.TranslocoService);
      service.load = jest.fn().mockImplementation(() => of(true));

      preloadLanguage(service, 'en', 'es')();

      expect(service.load).toHaveBeenCalledWith('en');
    });

    test('should load language from Browser Language', () => {
      Object.defineProperty(transloco, 'getBrowserLang', {
        value: jest.fn().mockImplementation(() => 'es'),
      });
      const service = TestBed.inject(transloco.TranslocoService);
      service.load = jest.fn().mockImplementation(() => of(true));

      preloadLanguage(service, undefined, 'it')();

      expect(service.load).toHaveBeenCalledWith('es');
    });

    test('should load language from fallback language in the edge case', () => {
      Object.defineProperty(transloco, 'getBrowserLang', {
        value: jest.fn().mockImplementation(() => undefined),
      });
      const service = TestBed.inject(transloco.TranslocoService);
      service.load = jest.fn().mockImplementation(() => of(true));

      preloadLanguage(service, undefined, 'nl')();

      expect(service.load).toHaveBeenCalledWith('nl');
    });
  });
});

describe('SharedTranslocoModule for Child', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [SharedTranslocoModule.forChild('scope', {})],
    });
  });

  test('should create', () => {
    expect(SharedTranslocoModule).toBeDefined();
  });
});
