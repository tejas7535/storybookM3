import { ActivatedRouteSnapshot } from '@angular/router';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { isLanguageAvailable } from '@ga/core/helpers/language-helpers';
import { SettingsFacade } from '@ga/core/store';

import { LanguageGuard } from './language.guard';

jest.mock('@ga/core/helpers/language-helpers');
const mockedIsLanguageAvailable = jest.mocked(isLanguageAvailable, true);

describe('LanguageGuard', () => {
  let spectator: SpectatorService<LanguageGuard>;
  let guard: LanguageGuard;
  let settingsFacade: SettingsFacade;
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
    providers: [provideMockStore({}), mockProvider(SettingsFacade)],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(LanguageGuard);
    settingsFacade = spectator.inject(SettingsFacade);
    translocoService = spectator.inject(TranslocoService);
  });

  it('should be create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    it(
      'should grant access, if app is not embedded',
      marbles((m) => {
        settingsFacade.appIsEmbedded$ = m.cold('a', { a: true });

        guard
          .canActivate(mockRouteWithLanguageParam)
          .subscribe((granted) => expect(granted).toBeTruthy());
      })
    );

    it(
      'should set active language',
      marbles((m) => {
        mockedIsLanguageAvailable.mockImplementation(() => true);
        settingsFacade.appIsEmbedded$ = m.cold('a', { a: true });
        translocoService.setActiveLang = jest.fn();

        guard
          .canActivate(mockRouteWithLanguageParam)
          .subscribe(() =>
            expect(translocoService.setActiveLang).toHaveBeenCalledWith('de')
          );
      })
    );

    it(
      'should not set active language',
      marbles((m) => {
        mockedIsLanguageAvailable.mockImplementation(() => false);
        settingsFacade.appIsEmbedded$ = m.cold('a', { a: true });
        translocoService.setActiveLang = jest.fn();

        guard
          .canActivate(mockRouteWithoutParams)
          .subscribe(() =>
            expect(translocoService.setActiveLang).not.toHaveBeenCalled()
          );
      })
    );
  });
});
