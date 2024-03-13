import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { ResultComponent } from './result.component';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let spectator: Spectator<ResultComponent>;

  const createComponent = createComponentFactory({
    component: ResultComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onRecommendationSelectedChange', () => {
    it('should set isRecommendedSelected', () => {
      component.isRecommendedSelected = true;

      component.onRecommendedSelectedChange(false);

      expect(component.isRecommendedSelected).toEqual(false);
    });
  });
});
