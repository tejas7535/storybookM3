import { waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { SettingsFacade } from '@ga/core/store/facades';
import { ENV, getEnv } from '@ga/environments/environments.provider';
import { TRACKING_NAME_HOMECARD } from '@ga/shared/constants';
import { PartnerAfiliateCode, PartnerVersion } from '@ga/shared/models';

import { HomepageCard } from '../models';
import { HomeCardsService } from './home-cards.service';
import { HomeCardsTrackingIds } from './home-cards-tracking-ids.enum';

describe('HomeCardsService', () => {
  let spectator: SpectatorService<HomeCardsService>;
  let service: HomeCardsService;
  let applicationInsightsService: ApplicationInsightsService;
  let router: Router;

  const partnerSubject = new BehaviorSubject<PartnerVersion>(undefined);
  const createServiceWithProductionConfig = createServiceFactory({
    service: HomeCardsService,
    imports: [RouterTestingModule, provideTranslocoTestingModule({ en: {} })],
    providers: [
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
      {
        provide: Router,
        useValue: {
          navigate: jest.fn(),
        },
      },
      {
        provide: SettingsFacade,
        useValue: {
          partnerVersion$: partnerSubject.asObservable(),
        },
      },
      {
        provide: ENV,
        useValue: { ...getEnv(), production: true },
      },
    ],
  });

  describe('when in production settings', () => {
    beforeEach(() => {
      spectator = createServiceWithProductionConfig();
      service = spectator.inject(HomeCardsService);
      applicationInsightsService = spectator.inject(ApplicationInsightsService);
      router = spectator.inject(Router);
      Object.defineProperty(window, 'open', {
        value: jest.fn(),
      });
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('when getting home cards', () => {
      let result: HomepageCard[];

      beforeAll(async () => {
        result = await firstValueFrom(service.getHomeCards());
      });

      it('should get home cards for production', waitForAsync(() => {
        expect(result).toMatchSnapshot();
      }));

      describe('when performing any get external link action', () => {
        it('should log and open url with parameters', waitForAsync(() => {
          result[1].cardAction();

          expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
            TRACKING_NAME_HOMECARD,
            {
              card: HomeCardsTrackingIds.Sources,
            }
          );

          expect(window.open).toHaveBeenCalledWith(
            'homepage.cards.greases.externalLink?utm_source=grease-app&utm_medium=app',
            '_blank'
          );
        }));
      });

      describe('when performing external link action without paramaters', () => {
        it('should log and open url without parameters', waitForAsync(() => {
          result[6].cardAction();

          expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
            TRACKING_NAME_HOMECARD,
            {
              card: HomeCardsTrackingIds.ContactLink,
            }
          );

          expect(window.open).toHaveBeenCalledWith(
            'homepage.cards.contact.externalLink',
            '_blank'
          );
        }));
      });

      describe('when performing navigation action', () => {
        it('should log and navigate to given link', waitForAsync(() => {
          result[0].cardAction();

          expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
            TRACKING_NAME_HOMECARD,
            {
              card: HomeCardsTrackingIds.GreaseCalculation,
            }
          );

          expect(router.navigate).toHaveBeenCalledWith([
            AppRoutePath.GreaseCalculationPath,
          ]);
        }));
      });
    });
  });
  describe('when in Schmeckthal partner version setting', () => {
    beforeEach(() => {
      partnerSubject.next(PartnerVersion.Schmeckthal);
      spectator = createServiceWithProductionConfig();
      service = spectator.inject(HomeCardsService);
      applicationInsightsService = spectator.inject(ApplicationInsightsService);
      router = spectator.inject(Router);
      Object.defineProperty(window, 'open', {
        value: jest.fn(),
      });
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('when getting home cards', () => {
      let result: HomepageCard[];

      beforeAll(async () => {
        result = await firstValueFrom(service.getHomeCards());
      });

      it('should get home cards for production', waitForAsync(() => {
        expect(result).toMatchSnapshot();
      }));

      describe('when performing opening partner email template', () => {
        it('should log and open email template', waitForAsync(() => {
          result[6].cardAction();

          expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
            TRACKING_NAME_HOMECARD,
            {
              card: HomeCardsTrackingIds.ContactLink,
            }
          );

          expect(window.open).toHaveBeenCalledWith(
            'mailto:technik@schmeckthal-gruppe.de?subject=Schmeckthal Grease App Anfrage',
            '_blank'
          );
        }));
      });

      describe('when performing any action with an external link', () => {
        it('should open a link with affiliate code', waitForAsync(() => {
          const affiliateCode = PartnerAfiliateCode[PartnerVersion.Schmeckthal];
          result[1].cardAction();

          expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
            TRACKING_NAME_HOMECARD,
            {
              card: HomeCardsTrackingIds.Sources,
            }
          );

          expect(window.open).toHaveBeenCalledWith(
            `homepage.cards.greases.externalLink?utm_source=grease-app&utm_medium=app&${affiliateCode}`,
            '_blank'
          );
        }));
      });
    });
  });
});
