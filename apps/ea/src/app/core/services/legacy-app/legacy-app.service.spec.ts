import { BehaviorSubject, of } from 'rxjs';

import { ProductSelectionFacade } from '@ea/core/store/facades';
import { environment } from '@ea/environments/environment';
import { TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { LegacyAppService } from './legacy-app.service';

describe('LegacyAppService', () => {
  let legacyAppService: LegacyAppService;
  let spectator: SpectatorService<LegacyAppService>;

  const localalizationIdChangesIdChanges$ = new BehaviorSubject<string>(
    'en-US'
  );
  const localeChanges$ = localalizationIdChangesIdChanges$.asObservable();

  const createService = createServiceFactory({
    service: LegacyAppService,
    providers: [
      {
        provide: ProductSelectionFacade,
        useValue: {
          bearingId$: of('123'),
        },
      },
      {
        provide: TranslocoService,
        useValue: {
          langChanges$: of('en'),
        },
      },
      {
        provide: TranslocoLocaleService,
        useValue: {
          localeChanges$,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    legacyAppService = spectator.inject(LegacyAppService);
  });

  it('should render the component', () => {
    expect(legacyAppService).toBeDefined();
  });

  it('should return legacy app url', (done) => {
    legacyAppService.legacyAppUrl$.subscribe((url) => {
      expect(url).toBe(`${environment.oldUIFallbackUrl}123/en/dot/metric/true`);
      done();
    });
  });

  describe('when locale changes to German', () => {
    beforeEach(() => {
      localalizationIdChangesIdChanges$.next('de-DE');
    });

    it('should return legacy app url with comma as decimal sign', (done) => {
      legacyAppService.legacyAppUrl$.subscribe((url) => {
        expect(url).toBe(
          `${environment.oldUIFallbackUrl}123/en/comma/metric/true`
        );
        done();
      });
    });
  });
});
