import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AVAILABLE_LANGUAGE_DE, AVAILABLE_LANGUAGE_EN } from '../../constants';
import { AG_GRID_LOCALE_DE } from '../constants/locale-de';
import { AG_GRID_LOCALE_EN } from '../constants/locale-en';
import { LocalizationService } from './localization.service';

describe('LocalizationService', () => {
  let service: LocalizationService;
  let spectator: SpectatorService<LocalizationService>;

  const createService = createServiceFactory({
    service: LocalizationService,
    imports: [provideTranslocoTestingModule({})],
  });
  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });
  describe('locale$', () => {
    test(
      'should set locale to german',
      marbles((m) => {
        service['translocoService'].setActiveLang(AVAILABLE_LANGUAGE_DE.id);

        m.expect(service.locale$).toBeObservable(
          m.cold('a', { a: AG_GRID_LOCALE_DE })
        );
      })
    );
    test(
      'should set locale to english',
      marbles((m) => {
        service['translocoService'].setActiveLang(AVAILABLE_LANGUAGE_EN.id);

        m.expect(service.locale$).toBeObservable(
          m.cold('a', { a: AG_GRID_LOCALE_EN })
        );
      })
    );
  });
});
