import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MarketValueDriverSelection } from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver.selection';
import {
  MarketValueDriverDisplayItem,
  MarketValueDriverOptionItem,
} from '@gq/f-pricing/pricing-assistant-modal/models/market-value-driver-display-item.interface';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { MarketValueDriverItemComponent } from './market-value-driver-item.component';

describe('MarketValueDriverItemComponent', () => {
  let component: MarketValueDriverItemComponent;
  let spectator: Spectator<MarketValueDriverItemComponent>;

  const createComponent = createComponentFactory({
    component: MarketValueDriverItemComponent,

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set selectedOptionId', () => {
      component.item = {
        questionId: 1,
        options: [
          { optionId: 1, selected: false },
          { optionId: 2, selected: true },
          { optionId: 3, selected: false },
          { optionId: 4, selected: false },
        ],
      } as MarketValueDriverDisplayItem;

      component.ngOnInit();

      expect(component.selectedOptionId).toEqual(2);
    });
  });

  describe('onOptionChange', () => {
    test('should emit optionChange event', () => {
      const option = {
        optionId: 1,
        selected: true,
        surcharge: 0.05,
      } as MarketValueDriverOptionItem;
      component.item = {
        questionId: 1,
        options: [option],
      } as MarketValueDriverDisplayItem;

      const selection: MarketValueDriverSelection = {
        questionId: 1,
        selectedOptionId: 1,
        surcharge: 0.05,
      };

      const emitSpy = jest.spyOn(component.optionChange, 'emit');

      component.onOptionChange(option);

      expect(emitSpy).toHaveBeenCalledWith(selection);
    });

    test('should update the selectedOptionId when the option is changed', () => {
      const option = {
        optionId: 1,
        selected: true,
      } as MarketValueDriverOptionItem;
      component.item = {
        questionId: 1,
        options: [
          { ...option, selected: false },
          { optionId: 2, selected: true },
        ],
      } as MarketValueDriverDisplayItem;

      component.ngOnInit();

      component.onOptionChange(option);

      expect(component.selectedOptionId).toEqual(1);
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
