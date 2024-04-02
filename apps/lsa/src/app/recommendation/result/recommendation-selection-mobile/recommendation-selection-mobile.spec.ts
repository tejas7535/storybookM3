import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { RecommendationSelectionMobileComponent } from './recommendation-selection-mobile';

describe('RecommendationSelectionMobileComponent', () => {
  let component: RecommendationSelectionMobileComponent;
  let spectator: Spectator<RecommendationSelectionMobileComponent>;

  const createComponent = createComponentFactory({
    component: RecommendationSelectionMobileComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSelectionChange', () => {
    it('should emit recommended checked', () => {
      component.headerSelected.emit = jest.fn();

      component.onSelectionChange({
        value: component.recommended,
        source: undefined,
      });

      expect(component.headerSelected.emit).toHaveBeenCalledWith({
        isRecommended: true,
      });
    });

    it('should emit recommended false', () => {
      component.headerSelected.emit = jest.fn();

      component.onSelectionChange({
        value: component.minimum,
        source: undefined,
      });

      expect(component.headerSelected.emit).toHaveBeenCalledWith({
        isRecommended: false,
      });
    });
  });
});
