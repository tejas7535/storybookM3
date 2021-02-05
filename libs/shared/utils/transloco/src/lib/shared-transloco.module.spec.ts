import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import * as transloco from '@ngneat/transloco';
import { configureTestSuite } from 'ng-bullet';

import {
  preloadLanguage,
  SharedTranslocoModule,
} from './shared-transloco.module';

describe('SharedTranslocoModule for Root', () => {
  let module: SharedTranslocoModule;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SharedTranslocoModule.forRoot(true, ['en'], 'en', 'es'),
      ],
    });
  });

  beforeEach(() => {
    module = TestBed.inject(SharedTranslocoModule);
  });

  test('should create', () => {
    expect(module).toBeDefined();
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
