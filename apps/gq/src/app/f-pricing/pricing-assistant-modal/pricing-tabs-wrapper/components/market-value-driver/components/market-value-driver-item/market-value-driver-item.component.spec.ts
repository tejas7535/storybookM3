import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onOptionChange', () => {
    test('should update item options', () => {
      const option = {
        optionId: 1,
        selected: false,
      } as MarketValueDriverOptionItem;
      component.item = {
        questionId: 1,
        options: [option],
      } as MarketValueDriverDisplayItem;

      component.onOptionChange(option);

      expect(component.item.options).toEqual([{ optionId: 1, selected: true }]);
    });
    test('should emit optionChange event', () => {
      const option = {
        optionId: 1,
        selected: false,
      } as MarketValueDriverOptionItem;
      component.item = {
        questionId: 1,
        options: [option],
      } as MarketValueDriverDisplayItem;
      const emitSpy = jest.spyOn(component.optionChange, 'emit');

      component.onOptionChange(option);

      expect(emitSpy).toHaveBeenCalledWith(component.item);
    });
  });
});
