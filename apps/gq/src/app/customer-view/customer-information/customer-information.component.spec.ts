import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK } from '../../../testing/mocks';
import { HorizontalDividerModule } from '../../shared/components/horizontal-divider/horizontal-divider.module';
import { LabelTextModule } from '../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { BasicCustomerComponent } from './basic-customer/basic-customer.component';
import { CustomerInformationComponent } from './customer-information.component';
import { KeyaccountComponent } from './keyaccount/keyaccount.component';
import { SalesforceComponent } from './salesforce/salesforce.component';

describe('CustomerDetailsComponent', () => {
  let component: CustomerInformationComponent;
  let spectator: Spectator<CustomerInformationComponent>;

  const createComponent = createComponentFactory({
    component: CustomerInformationComponent,
    detectChanges: false,
    imports: [
      MatCardModule,
      SharedPipesModule,
      HorizontalDividerModule,
      LabelTextModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [
      SalesforceComponent,
      KeyaccountComponent,
      BasicCustomerComponent,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.customer = CUSTOMER_MOCK;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set current and last year', () => {
      component.ngOnInit();

      expect(component.currentYear).toBeDefined();
      expect(component.lastYear).toBeDefined();
    });
  });
});
