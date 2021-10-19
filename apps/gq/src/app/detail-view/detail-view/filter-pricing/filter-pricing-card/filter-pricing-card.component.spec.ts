import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FilterPricingCardComponent } from './filter-pricing-card.component';

describe('FilterPricingCardComponent', () => {
  let component: FilterPricingCardComponent;
  let spectator: Spectator<FilterPricingCardComponent>;

  const createComponent = createComponentFactory({
    component: FilterPricingCardComponent,
    imports: [
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      LoadingSpinnerModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [FilterPricingCardComponent],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
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
