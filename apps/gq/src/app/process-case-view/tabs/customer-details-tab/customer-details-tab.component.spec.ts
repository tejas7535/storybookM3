import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';

import { getCustomer } from '@gq/core/store/selectors';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  CUSTOMER_MOCK,
  PROCESS_CASE_STATE_MOCK,
} from '../../../../testing/mocks';
import { CustomStatusBarModule } from '../../../shared/ag-grid/custom-status-bar/custom-status-bar.module';
import { InputTableModule } from '../../../shared/components/case-material/input-table/input-table.module';
import { HorizontalDividerModule } from '../../../shared/components/horizontal-divider/horizontal-divider.module';
import { KpiStatusCardComponent } from '../../../shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '../../../shared/components/label-text/label-text.module';
import { NumberCurrencyPipe } from '../../../shared/pipes/number-currency/number-currency.pipe';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { HelperService } from '../../../shared/services/helper-service/helper-service.service';
import { QuotationDetailsTableModule } from '../../quotation-details-table/quotation-details-table.module';
import { BasicCustomerComponent } from './basic-customer/basic-customer.component';
import { CustomerDetailsTabComponent } from './customer-details-tab.component';
import { KeyaccountComponent } from './keyaccount/keyaccount.component';
import { SalesforceComponent } from './salesforce/salesforce.component';

describe('CustomerDetailsTabComponent', () => {
  let component: CustomerDetailsTabComponent;
  let spectator: Spectator<CustomerDetailsTabComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: CustomerDetailsTabComponent,
    imports: [
      MockModule(InputTableModule),
      MockModule(CustomStatusBarModule),
      MockModule(QuotationDetailsTableModule),
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
      LoadingSpinnerModule,
      PushModule,
      MatCardModule,
      LabelTextModule,
      HorizontalDividerModule,
      SharedPipesModule,
      KpiStatusCardComponent,
    ],
    declarations: [
      SalesforceComponent,
      BasicCustomerComponent,
      KeyaccountComponent,
      NumberCurrencyPipe,
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          'azure-auth': {},
        },
      }),
      {
        provide: HelperService,
        useValue: {
          getCurrentYear: jest.fn(),
          getLastYear: jest.fn(),
          transformMarginDetails: jest.fn(),
          transformPercentage: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should set customer$',
      marbles((m) => {
        store.overrideSelector(getCustomer, CUSTOMER_MOCK);

        component.ngOnInit();

        m.expect(component.customer$).toBeObservable(
          m.cold('a', { a: CUSTOMER_MOCK })
        );
      })
    );
  });
});
