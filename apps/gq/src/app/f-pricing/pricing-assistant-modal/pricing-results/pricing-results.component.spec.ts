import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { PricingResultsComponent } from './pricing-results.component';

describe('PricingResultsComponent', () => {
  let component: PricingResultsComponent;
  let spectator: Spectator<PricingResultsComponent>;

  const createComponent = createComponentFactory({
    component: PricingResultsComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
