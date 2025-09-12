import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockBuilder } from 'ng-mocks';

import { LastOfferPriceInformationDetailsComponent } from './last-offer-price-information-details.component';

describe('LastOfferPriceInformationDetailsComponent', () => {
  let component: LastOfferPriceInformationDetailsComponent;
  let spectator: Spectator<LastOfferPriceInformationDetailsComponent>;

  const dependencies = MockBuilder(
    LastOfferPriceInformationDetailsComponent
  ).build();

  const createComponent = createComponentFactory({
    component: LastOfferPriceInformationDetailsComponent,
    ...dependencies,
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
