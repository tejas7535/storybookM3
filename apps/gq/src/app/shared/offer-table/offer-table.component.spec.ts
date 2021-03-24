import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../testing/mocks';
import { Quotation } from '../../core/store/models';
import { CustomStatusBarModule } from '../custom-status-bar/custom-status-bar.module';
import { ExportToExcelButtonComponent } from '../custom-status-bar/export-to-excel-button/export-to-excel-button.component';
import { QuotationDetailsStatusComponent } from '../custom-status-bar/quotation-details-status/quotation-details-status.component';
import { UploadToSapButtonComponent } from '../custom-status-bar/upload-to-sap-button/upload-to-sap-button.component';
import { OfferTableComponent } from './offer-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('OfferTableComponent', () => {
  let component: OfferTableComponent;
  let spectator: Spectator<OfferTableComponent>;

  const createComponent = createComponentFactory({
    component: OfferTableComponent,
    declarations: [OfferTableComponent],
    imports: [
      AgGridModule.withComponents([
        UploadToSapButtonComponent,
        ExportToExcelButtonComponent,
        QuotationDetailsStatusComponent,
      ]),
      provideTranslocoTestingModule({}),
      CustomStatusBarModule,
      RouterTestingModule,
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
          'azure-auth': {
            accountInfo: {
              name: 'Jefferson',
            },
            profileImage: {
              url: 'img',
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

  describe('setQuotation', () => {
    test('should set quotation', () => {
      component.tableContext = {
        currency: undefined,
        gqId: undefined,
      };
      const quotation: Quotation = QUOTATION_MOCK;

      component.quotation = quotation;
      expect(component.rowData).toBeDefined();
      expect(component.tableContext.currency).toBeDefined();
      expect(component.tableContext.gqId).toBeDefined();
    });
    test('should not set quotation when undefined', () => {
      component.tableContext = {
        currency: undefined,
        gqId: undefined,
      };
      const quotation: Quotation = undefined;

      component.quotation = quotation;
      expect(component.rowData).toBeUndefined();
      expect(component.tableContext.currency).toBeUndefined();
      expect(component.tableContext.gqId).toBeUndefined();
    });
  });
  describe('ngOnInit', () => {
    test('should add subscriptions', () => {
      component.subscription.add = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.subscription.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestory', () => {
    test('should unsubscribe subscriptions', () => {
      component.subscription.unsubscribe = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
