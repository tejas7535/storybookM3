import { ActivatedRouteSnapshot } from '@angular/router';

import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { LanguageGuard } from './language.guard';

const mockRouteWithLanguageQueryParam = {
  queryParams: {
    language: 'de',
  },
  paramMap: new Map(),
} as unknown as ActivatedRouteSnapshot;

const mockRouteWithLanguagePathParam = {
  params: {
    language: 'es',
  },
  paramMap: new Map([['language', 'es']]),
} as unknown as ActivatedRouteSnapshot;

describe('LanguageGuard', () => {
  let spectator: SpectatorService<LanguageGuard>;
  let guard: LanguageGuard;

  const createService = createServiceFactory({
    service: LanguageGuard,
    mocks: [TranslocoService],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(LanguageGuard);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('Path language param', () => {
    it('Valid set should set the language', () => {
      const transloco = spectator.inject(TranslocoService);
      transloco.isLang.mockReturnValue(true);

      guard.canActivate(mockRouteWithLanguagePathParam);
      expect(transloco.setActiveLang).toHaveBeenCalledWith('es');
      expect(transloco.isLang).toHaveBeenCalledWith('es');
    });

    it('invalid set should not set the language', () => {
      const transloco = spectator.inject(TranslocoService);
      transloco.isLang.mockReturnValue(false);

      guard.canActivate(mockRouteWithLanguagePathParam);
      expect(transloco.setActiveLang).not.toHaveBeenCalled();
      expect(transloco.isLang).toHaveBeenCalledWith('es');
    });

    it('and query param present should use the path param', () => {
      const transloco = spectator.inject(TranslocoService);
      transloco.isLang.mockReturnValue(true);

      guard.canActivate({
        ...mockRouteWithLanguageQueryParam,
        ...mockRouteWithLanguagePathParam,
      } as ActivatedRouteSnapshot);
      expect(transloco.setActiveLang).toHaveBeenCalledWith('es');
      expect(transloco.isLang).toHaveBeenCalledWith('es');
    });
  });

  describe('Query language param', () => {
    it('valid, should set the language', () => {
      const transloco = spectator.inject(TranslocoService);
      transloco.isLang.mockReturnValue(true);

      guard.canActivate(mockRouteWithLanguageQueryParam);
      expect(transloco.setActiveLang).toHaveBeenCalledWith('de');
      expect(transloco.isLang).toHaveBeenCalledWith('de');
    });

    it('invalid, should not set the language', () => {
      const transloco = spectator.inject(TranslocoService);
      transloco.isLang.mockReturnValue(false);

      guard.canActivate(mockRouteWithLanguageQueryParam);
      expect(transloco.setActiveLang).not.toHaveBeenCalled();
      expect(transloco.isLang).toHaveBeenCalledWith('de');
    });
  });
});
