import { RecommendationLubricatorHeaderData } from '@lsa/shared/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { LubricatorHeaderComponent } from './lubricator-header.component';

describe('LubricatorHeaderComponent', () => {
  let component: LubricatorHeaderComponent;
  let spectator: Spectator<LubricatorHeaderComponent>;

  const createComponent = createComponentFactory({
    component: LubricatorHeaderComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onHeaderSelected', () => {
    it('should emit the event if checked', () => {
      component.headerSelected.emit = jest.fn();

      component.headerData = {
        isRecommended: true,
      } as RecommendationLubricatorHeaderData;

      component.onHeaderSelected(true);

      expect(component.headerSelected.emit).toHaveBeenCalledWith({
        isRecommended: true,
      });
    });

    it('should do nothing if not checked', () => {
      component.headerSelected.emit = jest.fn();

      component.onHeaderSelected(false);

      expect(component.headerSelected.emit).not.toHaveBeenCalled();
    });
  });
});
