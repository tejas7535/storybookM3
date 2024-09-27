import { waitForAsync } from '@angular/core/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  getAppIsEmbedded,
  getIsMediasAuthenticated,
} from '@ga/core/store/selectors/settings/settings.selector';

import { GreaseRecommendationMarketingService } from './grease-recommendation-marketing.service';

describe('GreaseRecommendationMarketingService', () => {
  let spectator: SpectatorService<GreaseRecommendationMarketingService>;
  let service: GreaseRecommendationMarketingService;
  let store: MockStore;

  let mockAuthSelector: any;
  let mockEmbedSelector: any;

  const createService = createServiceFactory({
    service: GreaseRecommendationMarketingService,
    imports: [provideTranslocoTestingModule({})],
    providers: [
      provideMockStore({
        initialState: {},
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    store = spectator.inject(MockStore);

    mockAuthSelector = store.overrideSelector(getIsMediasAuthenticated, false);
    mockEmbedSelector = store.overrideSelector(getAppIsEmbedded, true);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('For logged in users', () => {
    beforeEach(() => {
      mockAuthSelector.setResult(true);
      store.refreshState();
    });

    it('embedded should not show any advertising callouts', waitForAsync(() => {
      service.shouldShowMarketing$.subscribe((should) =>
        expect(should).toBe(false)
      );
    }));

    it('embedded should show the recommendation', waitForAsync(() => {
      service.shouldShowRecommendation$.subscribe((showRecommendation) =>
        expect(showRecommendation).toBe(true)
      );
    }));
  });

  describe('For anonymous users', () => {
    it('should show nothing in standalone', waitForAsync(() => {
      mockEmbedSelector.setResult(false);
      store.refreshState();

      service.shouldShowRecommendation$.subscribe((showRecommendation) =>
        expect(showRecommendation).toBe(false)
      );
      service.shouldShowMarketing$.subscribe((showMarketing) =>
        expect(showMarketing).toBe(false)
      );
    }));

    it('show marketing in embedded', waitForAsync(() => {
      service.shouldShowMarketing$.subscribe((showMarketing) =>
        expect(showMarketing).toBe(true)
      );
    }));

    it('not show any recommendation', waitForAsync(() => {
      service.shouldShowRecommendation$.subscribe((showRecommendation) =>
        expect(showRecommendation).toBe(false)
      );
    }));
  });
});
