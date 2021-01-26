import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../testing/mocks';
import { getOffer } from '../core/store/selectors';
import { SharedModule } from '../shared';
import { CaseHeaderModule } from '../shared/case-header/case-header.module';
import { AddEntryModule } from '../shared/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../shared/case-material/input-table/input-table.module';
import { CustomStatusBarModule } from '../shared/custom-status-bar/custom-status-bar.module';
import { FlatButtonsComponent } from '../shared/custom-status-bar/flat-buttons/flat-buttons.component';
import { LoadingSpinnerModule } from '../shared/loading-spinner/loading-spinner.module';
import { OfferDrawerModule } from '../shared/offer-drawer/offer-drawer.module';
import { AddMaterialDialogComponent } from './add-material-dialog/add-material-dialog.component';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';
import { ProcessCaseViewComponent } from './process-case-view.component';
import { QuotationDetailsTableModule } from './quotation-details-table/quotation-details-table.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ProcessCaseViewComponent', () => {
  let component: ProcessCaseViewComponent;
  let spectator: Spectator<ProcessCaseViewComponent>;

  const createComponent = createComponentFactory({
    component: ProcessCaseViewComponent,
    imports: [
      AddEntryModule,
      InputTableModule,
      AgGridModule.withComponents([FlatButtonsComponent]),
      BrowserAnimationsModule,
      CaseHeaderModule,
      CustomStatusBarModule,
      MatCardModule,
      MatDialogModule,
      MatIconModule,
      MatSidenavModule,
      OfferDrawerModule,
      ProcessCaseViewRoutingModule,
      QuotationDetailsTableModule,
      RouterTestingModule,
      SharedModule,
      provideTranslocoTestingModule({}),
      LoadingSpinnerModule,
      ReactiveComponentModule,
    ],
    declarations: [ProcessCaseViewComponent],
    providers: [
      provideMockStore({
        initialState: {
          processCase: {
            customer: {
              item: CUSTOMER_MOCK,
            },
            quotation: {
              item: QUOTATION_MOCK,
            },
          },
        },
        selectors: [
          {
            selector: getOffer,
            value: QUOTATION_DETAIL_MOCK,
          },
        ],
      }),
    ],
    entryComponents: [AddMaterialDialogComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should get offer', () => {
    component.getOffer();

    expect(component.offer$).toBeDefined();
  });
});
