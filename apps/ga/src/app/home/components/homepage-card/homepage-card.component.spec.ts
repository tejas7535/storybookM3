import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { CalculatorLogoModule } from '@ga/shared/components/calculator-logo';
import { HOMEPAGE_CARD_MOCK } from '@ga/testing/mocks/models/homepage-card.mock';

import { HomepageCardComponent } from './homepage-card.component';

describe('HomepageCardComponent', () => {
  let component: HomepageCardComponent;
  let spectator: Spectator<HomepageCardComponent>;

  const createComponent = createComponentFactory({
    component: HomepageCardComponent,
    imports: [CalculatorLogoModule],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput({ homepageCard: HOMEPAGE_CARD_MOCK });
    component = spectator.component;
    spectator.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('getCardImageUrl', () => {
    it('should return an url', () => {
      const url = component.getCardImageUrl();

      expect(url).toBe('mock_image_path');
    });
  });

  describe('onCardClick', () => {
    it('should perform card action', () => {
      component.onCardClick();

      expect(component.homepageCard.cardAction).toHaveBeenCalledWith();
    });
  });
});
