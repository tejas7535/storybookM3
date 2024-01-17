import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import * as fPricingUtils from '@gq/shared/utils/f-pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { PricingAssistantActionCellComponent } from './pricing-assistant-action-cell.component';
describe('pricing Assistant Action Cell Component', () => {
  let component: PricingAssistantActionCellComponent;
  let spectator: Spectator<PricingAssistantActionCellComponent>;

  const createComponent = createComponentFactory({
    component: PricingAssistantActionCellComponent,
    declarations: [PricingAssistantActionCellComponent],
    imports: [MatIconModule],
    providers: [{ provide: MatDialog, useValue: {} }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    beforeEach(() => {
      jest.spyOn(fPricingUtils, 'isFNumber').mockReturnValue(true);
    });
    test('should set params', () => {
      const params: any = {
        test: '123',
        data: [],
      };
      component.agInit(params);

      expect(component.params).toEqual(params);
      expect(component).toBeTruthy();
      expect(component.isFNumber).toBe(true);
    });
  });
});
