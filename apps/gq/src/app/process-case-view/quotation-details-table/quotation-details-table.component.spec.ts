import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../testing/mocks';
import { AddToOfferButtonComponent } from '../../shared/custom-status-bar/add-to-offer-button/add-to-offer-button.component';
import { CustomStatusBarModule } from '../../shared/custom-status-bar/custom-status-bar.module';
import { DetailViewButtonComponent } from '../../shared/custom-status-bar/detail-view-button/detail-view-button.component';
import { FlatButtonsComponent } from '../../shared/custom-status-bar/flat-buttons/flat-buttons.component';
import { QuotationDetailsStatusComponent } from '../../shared/custom-status-bar/quotation-details-status/quotation-details-status.component';
import { QuotationDetailsTableComponent } from './quotation-details-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('QuotationDetailsTableComponent', () => {
  let component: QuotationDetailsTableComponent;
  let spectator: Spectator<QuotationDetailsTableComponent>;

  const createComponent = createComponentFactory({
    component: QuotationDetailsTableComponent,
    declarations: [QuotationDetailsTableComponent],
    detectChanges: false,
    imports: [
      AgGridModule.withComponents([
        AddToOfferButtonComponent,
        DetailViewButtonComponent,
        QuotationDetailsStatusComponent,
        FlatButtonsComponent,
      ]),
      CustomStatusBarModule,
      MatDialogModule,
      ReactiveComponentModule,
      RouterTestingModule,
      provideTranslocoTestingModule({}),
    ],
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
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set columnDefs', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.columnDefs$).toBeDefined();
    });
  });
  describe('set quotation', () => {
    test('should set rowData and tableContext.currency', () => {
      component.quotation = QUOTATION_MOCK;

      expect(component.rowData).toEqual(QUOTATION_MOCK.quotationDetails);
      expect(component.tableContext.currency).toEqual(QUOTATION_MOCK.currency);
    });
  });
  describe('onFirstDataRenderer', () => {
    test('should call autoSizeAllColumns', () => {
      const params = {
        columnApi: {
          autoSizeAllColumns: jest.fn(),
        },
      } as any;

      component.onFirstDataRendered(params);

      expect(params.columnApi.autoSizeAllColumns).toHaveBeenCalledTimes(1);
    });
  });
});
