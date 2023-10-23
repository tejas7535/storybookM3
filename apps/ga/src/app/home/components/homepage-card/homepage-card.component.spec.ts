import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculatorLogoModule } from '@ga/shared/components/calculator-logo';
import { HOMEPAGE_CARD_MOCK } from '@ga/testing/mocks/models/homepage-card.mock';

import { HomepageCardComponent } from './homepage-card.component';

Object.defineProperty(window, 'open', {
  value: jest.fn(),
});

describe('HomepageCardComponent', () => {
  let component: HomepageCardComponent;
  let spectator: Spectator<HomepageCardComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: HomepageCardComponent,
    imports: [
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      CalculatorLogoModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput({ homepageCard: HOMEPAGE_CARD_MOCK });
    component = spectator.component;
    router = spectator.inject(Router);
    router.navigate = jest.fn();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('getCardImageUrl', () => {
    it('should return an url', () => {
      const url = component.getCardImageUrl();

      expect(url).toBe('assets/images/homepage/cards/mock_image_path');
    });
  });

  describe('onCardClick', () => {
    it('should navigate to an external page', () => {
      component.onCardClick();

      expect(window.open).toHaveBeenCalledWith(
        'homepage.cards.mock_link',
        '_blank'
      );
    });

    it('should add tracking params in production mode', () => {
      component['isProduction'] = true;
      component.onCardClick();

      expect(window.open).toHaveBeenCalledWith(
        'homepage.cards.mock_link?mock&parameters',
        '_blank'
      );
    });

    it('should navigate to an app route', () => {
      component.homepageCard.externalLink = undefined;
      component.onCardClick();

      expect(router.navigate).toHaveBeenCalledWith(['mock_router_path']);
    });

    it('should log the click event', () => {
      const logEventSpy = jest.spyOn(
        component['applicationInsightsService'],
        'logEvent'
      );

      component.onCardClick();

      expect(logEventSpy).toHaveBeenCalledWith('[Home Card]', {
        card: 'mock_id',
      });
    });
  });
});
