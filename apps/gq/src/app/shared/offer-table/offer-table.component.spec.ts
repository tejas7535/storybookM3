import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { AgGridModule } from '@ag-grid-community/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../testing/mocks';
import { CustomStatusBarModule } from '../custom-status-bar/custom-status-bar.module';
import { ExportToExcelButtonComponent } from '../custom-status-bar/export-to-excel-button/export-to-excel-button.component';
import { UploadToSapButtonComponent } from '../custom-status-bar/upload-to-sap-button/upload-to-sap-button.component';
import { OfferTableComponent } from './offer-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('OfferTableComponent', () => {
  let component: OfferTableComponent;
  let params: IStatusPanelParams;
  let spectator: Spectator<OfferTableComponent>;

  const createComponent = createComponentFactory({
    component: OfferTableComponent,
    declarations: [OfferTableComponent],
    imports: [
      AgGridModule.withComponents([
        UploadToSapButtonComponent,
        ExportToExcelButtonComponent,
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
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    params = ({
      api: {
        sizeColumnsToFit: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFirstDataRendered', () => {
    it('should call autoSizeAllColumns', () => {
      component.onFirstDataRendered(params);

      expect(params.api.sizeColumnsToFit).toHaveBeenCalled();
    });
  });

  describe('onGridReady', () => {
    test('should set selections', () => {
      component.onGridReady(params);

      expect(params.api.sizeColumnsToFit).toHaveBeenCalled();
    });
  });
});
