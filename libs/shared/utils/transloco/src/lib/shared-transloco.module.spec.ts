import { of } from 'rxjs';

import * as transloco from '@jsverse/transloco';

import {
  getDefaultLang,
  preloadLanguage,
  SharedTranslocoModule,
} from './shared-transloco.module';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  getBrowserLang: jest.fn(() =>
    jest.requireActual('@jsverse/transloco').getBrowserLang()
  ),
}));

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
      undefined,
      false,
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

      // eslint-disable-next-line unicorn/no-useless-undefined
      Storage.prototype.getItem = jest.fn().mockReturnValue(undefined);
      preloadLanguage(service, 'en', 'es', '')();

      expect(service.load).toHaveBeenCalledWith('en');
      expect(service.setActiveLang).toHaveBeenCalledWith('en');
    });

    test('should load language from local storage', () => {
      const service = {
        load: jest.fn().mockImplementation(() => of(true)),
        setActiveLang: jest.fn(),
      } as unknown as transloco.TranslocoService;

      Storage.prototype.getItem = jest.fn().mockReturnValue('de');
      preloadLanguage(service, 'en', 'es', 'language')();

      expect(localStorage.getItem).toHaveBeenCalledWith('language');
      expect(service.load).toHaveBeenCalledWith('de');
      expect(service.setActiveLang).toHaveBeenCalledWith('de');
    });

    test('should load language from Browser Language', () => {
      (transloco.getBrowserLang as jest.Mock).mockImplementation(() => 'es');
      const service = {
        load: jest.fn().mockImplementation(() => of(true)),
        setActiveLang: jest.fn(),
      } as unknown as transloco.TranslocoService;

      // eslint-disable-next-line unicorn/no-useless-undefined
      Storage.prototype.getItem = jest.fn().mockReturnValue(undefined);
      preloadLanguage(service, undefined, 'it', '')();

      expect(service.load).toHaveBeenCalledWith('es');
      expect(service.setActiveLang).toHaveBeenCalledWith('es');
    });

    test('should load language from fallback language in the edge case', () => {
      (transloco.getBrowserLang as jest.Mock).mockImplementation(() => {});
      const service = {
        load: jest.fn().mockImplementation(() => of(true)),
        setActiveLang: jest.fn(),
      } as unknown as transloco.TranslocoService;

      preloadLanguage(service, undefined, 'nl', '')();

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

describe('getDefaultLang', () => {
  beforeEach(() => {
    (transloco.getBrowserLang as jest.Mock).mockReset();
  });
  test('should return the default lang if provided', () => {
    const defaultLang = getDefaultLang('de');

    expect(transloco.getBrowserLang).not.toHaveBeenCalled();
    expect(defaultLang).toEqual('de');
  });
  test('should return the browser lang if not provided', () => {
    (transloco.getBrowserLang as jest.Mock).mockImplementation(() => 'de');
    // eslint-disable-next-line unicorn/no-useless-undefined
    const defaultLang = getDefaultLang(undefined);

    expect(transloco.getBrowserLang).toHaveBeenCalledTimes(1);
    expect(defaultLang).toEqual('de');
  });
});
