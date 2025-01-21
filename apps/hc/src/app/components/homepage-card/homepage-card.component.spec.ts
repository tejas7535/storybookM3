import { HomepageCard } from '@hc/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { HomepageCardComponent } from './homepage-card.component';

const HOMEPAGE_CARD_MOCK: HomepageCard = {
  mainTitle: 'mock_main_title',
  subTitle: 'mock_sub_title',
  templateId: 'imageCard',
  imagePath: 'mock_image_path',
  cardAction: jest.fn(),
};

describe('HomepageCardComponent', () => {
  let component: HomepageCardComponent;
  let spectator: Spectator<HomepageCardComponent>;

  const createComponent = createComponentFactory({
    component: HomepageCardComponent,
    imports: [],
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

  describe('onCardClick', () => {
    it('should perform card action', () => {
      component.onCardClick();

      expect(component.homepageCard.cardAction).toHaveBeenCalledWith();
    });
  });
});
