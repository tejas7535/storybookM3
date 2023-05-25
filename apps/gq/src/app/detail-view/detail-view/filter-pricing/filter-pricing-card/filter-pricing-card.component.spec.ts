import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FilterPricingCardComponent } from './filter-pricing-card.component';

describe('FilterPricingCardComponent', () => {
  let component: FilterPricingCardComponent;
  let spectator: Spectator<FilterPricingCardComponent>;

  const createComponent = createComponentFactory({
    component: FilterPricingCardComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should emit selectManualPrice', () => {
    test('should selectPrice', () => {
      component.selectManualPrice.emit = jest.fn();

      component.selectPrice();

      expect(component.selectManualPrice.emit).toHaveBeenCalledTimes(1);
    });
  });
});
