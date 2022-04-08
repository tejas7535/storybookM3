import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  PROCESS_CASE_STATE_MOCK,
  SAP_PRICE_DETAILS_STATE_MOCK,
} from '../../../testing/mocks/state';
import { CustomerHeaderModule } from '../../shared/components/header/customer-header/customer-header.module';
import { MaterialPriceHeaderContentModule } from '../../shared/components/header/material-price-header-content/material-price-header-content.module';
import { SapPriceDetailsTableModule } from './sap-price-details-table/sap-price-details-table.module';
import { SapViewComponent } from './sap-view.component';

describe('SapViewComponent', () => {
  let component: SapViewComponent;
  let spectator: Spectator<SapViewComponent>;

  const createComponent = createComponentFactory({
    component: SapViewComponent,
    imports: [
      provideTranslocoTestingModule({}),
      SubheaderModule,
      MatCardModule,
      CustomerHeaderModule,
      ReactiveComponentModule,
      ShareButtonModule,
      LoadingSpinnerModule,
      MaterialPriceHeaderContentModule,
      SapPriceDetailsTableModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          sapPriceDetails: SAP_PRICE_DETAILS_STATE_MOCK,
        },
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
