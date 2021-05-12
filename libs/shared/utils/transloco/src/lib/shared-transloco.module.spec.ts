import { of } from 'rxjs';

import * as transloco from '@ngneat/transloco';

import {
  preloadLanguage,
  SharedTranslocoModule,
} from './shared-transloco.module';

describe('SharedTranslocoModule for Root', () => {
  test('should create', () => {
    const module = new SharedTranslocoModule();
    expect(module).toBeDefined();
  });

  test('should create with forRoot', () => {
    const module = SharedTranslocoModule.forRoot(
      true,
      ['es'],
      'es',
      'es',
      false
    );
    expect(module).toBeDefined();
  });

  describe('preloadLanguage', () => {
    test('should load language', () => {
      const service = {
        load: jest.fn().mockImplementation(() => of(true)),
        setActiveLang: jest.fn(),
      } as unknown as transloco.TranslocoService;

      preloadLanguage(service, 'en', 'es')();

      expect(service.load).toHaveBeenCalledWith('en');
      expect(service.setActiveLang).toHaveBeenCalledWith('en');
    });

    test('should load language from Browser Language', () => {
      Object.defineProperty(transloco, 'getBrowserLang', {
        value: jest.fn().mockImplementation(() => 'es'),
      });
      const service = {
        load: jest.fn().mockImplementation(() => of(true)),
        setActiveLang: jest.fn(),
      } as unknown as transloco.TranslocoService;

      preloadLanguage(service, undefined, 'it')();

      expect(service.load).toHaveBeenCalledWith('es');
      expect(service.setActiveLang).toHaveBeenCalledWith('es');
    });

    test('should load language from fallback language in the edge case', () => {
      Object.defineProperty(transloco, 'getBrowserLang', {
        value: jest.fn().mockImplementation(() => undefined),
      });
      const service = {
        load: jest.fn().mockImplementation(() => of(true)),
        setActiveLang: jest.fn(),
      } as unknown as transloco.TranslocoService;

      preloadLanguage(service, undefined, 'nl')();

      expect(service.load).toHaveBeenCalledWith('nl');
      expect(service.setActiveLang).toHaveBeenCalledWith('nl');
    });
  });
});

describe('SharedTranslocoModule for Child', () => {
  test('should create', () => {
    const forChildModule = SharedTranslocoModule.forChild('scope', {});
    expect(forChildModule).toBeDefined();
  });
});
