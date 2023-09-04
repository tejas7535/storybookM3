import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { LastCustomerPriceInformationDetailsComponent } from './last-customer-price-information-details.component';

describe('LastCustomerPriceInformationDetailsComponent', () => {
  let component: LastCustomerPriceInformationDetailsComponent;
  let spectator: Spectator<LastCustomerPriceInformationDetailsComponent>;

  const createComponent = createComponentFactory({
    component: LastCustomerPriceInformationDetailsComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), SharedPipesModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
