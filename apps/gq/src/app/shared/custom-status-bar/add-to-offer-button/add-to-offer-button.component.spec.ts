import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { updateQuotationDetails } from '../../../core/store/actions';
import { AddToOfferButtonComponent } from './add-to-offer-button.component';

describe('AddToOfferButtonComponent', () => {
  let component: AddToOfferButtonComponent;
  let spectator: Spectator<AddToOfferButtonComponent>;
  let params: IStatusPanelParams;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AddToOfferButtonComponent,
    declarations: [AddToOfferButtonComponent],
    imports: [
      MatButtonModule,
      MatIconModule,
      provideTranslocoTestingModule({ en: {} }),
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
    params = {
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn(),
      },
    } as unknown as IStatusPanelParams;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params and add listeners', () => {
      component.agInit(params as unknown as IStatusPanelParams);

      expect(component['params']).toEqual(params);

      expect(params.api.addEventListener).toHaveBeenCalledTimes(2);
    });
  });

  describe('onGridReady', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onGridReady();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
    });
  });

  describe('addToOffer', () => {
    test('should addToOffer', () => {
      store.dispatch = jest.fn();

      component.selections = [QUOTATION_DETAIL_MOCK];
      component.addToOffer();

      expect(store.dispatch).toHaveBeenCalledWith(
        updateQuotationDetails({
          updateQuotationDetailList: [
            { gqPositionId: '5694232', addedToOffer: true },
          ],
        })
      );
    });
  });
});
