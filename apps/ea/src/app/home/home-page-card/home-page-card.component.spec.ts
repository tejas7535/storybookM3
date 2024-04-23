import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { HomePageCardComponent } from './home-page-card.component';

describe('HomePageCardComponent', () => {
  let component: HomePageCardComponent;
  let spectator: Spectator<HomePageCardComponent>;

  const createComponent = createComponentFactory({
    component: HomePageCardComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput({
      card: {
        mainTitle: 'mock_main_title',
        subTitle: 'mock_sub_title',
        imagePath: 'mock_image_path',
        action: jest.fn(),
      },
    });
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
      const actionSpy = jest.spyOn(component.card, 'action');
      component.onCardClick();

      expect(actionSpy).toHaveBeenCalled();
    });
  });
});
