import { ActivatedRouteSnapshot } from '@angular/router';

import { isLanguageAvailable } from '@ea/shared/helper/language-helpers';
import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LanguageGuard } from './language.guard';

jest.mock('@ea/shared/helper/language-helpers');
const mockedIsLanguageAvailable = jest.mocked(isLanguageAvailable, {
  shallow: true,
});

describe('LanguageGuard', () => {
  let spectator: SpectatorService<LanguageGuard>;
  let guard: LanguageGuard;
  let translocoService: TranslocoService;

  const language = 'de';
  const mockRouteWithLanguageParam: ActivatedRouteSnapshot = {
    queryParams: {
      language,
    },
  } as unknown as ActivatedRouteSnapshot;

  const mockRouteWithoutParams: ActivatedRouteSnapshot =
    {} as unknown as ActivatedRouteSnapshot;

  const createService = createServiceFactory({
    service: LanguageGuard,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(LanguageGuard);
    translocoService = spectator.inject(TranslocoService);
  });

  it('should be create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    it('should set active language', () => {
      mockedIsLanguageAvailable.mockImplementation(() => true);
      translocoService.setActiveLang = jest.fn();

      guard.canActivate(mockRouteWithLanguageParam);

      expect(translocoService.setActiveLang).toHaveBeenCalledWith('de');
    });

    it('should not set active language', () => {
      mockedIsLanguageAvailable.mockImplementation(() => false);
      translocoService.setActiveLang = jest.fn();

      guard.canActivate(mockRouteWithoutParams);

      expect(translocoService.setActiveLang).not.toHaveBeenCalled();
    });
  });
});
