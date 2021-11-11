import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks';
import { updateQuotationDetails } from '../../../core/store';
import { UpdateQuotationDetail } from '../../../core/store/reducers/process-case/models';
import { DialogHeaderModule } from '../../../shared/header/dialog-header/dialog-header.module';
import { ColumnFields } from '../../../shared/services/column-utility-service/column-fields.enum';
import { PriceSource } from '../../models/quotation-detail';
import { HelperService } from '../../services/helper-service/helper-service.service';
import { EditingModalComponent } from './editing-modal.component';

describe('EditingModalComponent', () => {
  let component: EditingModalComponent;
  let spectator: Spectator<EditingModalComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: EditingModalComponent,
    imports: [
      LoadingSpinnerModule,
      MatFormFieldModule,
      DialogHeaderModule,
      ReactiveComponentModule,
      ReactiveFormsModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          processCase: {
            quotation: {},
          },
        },
      }),
      {
        provide: MatDialogRef,
        useValue: {},
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          quotationDetail: QUOTATION_DETAIL_MOCK,
          field: ColumnFields.DISCOUNT,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    test('should add subscriptions', () => {
      component.addSubscriptions = jest.fn();

      component.ngOnInit();

      expect(component.editFormControl).toBeDefined();
      expect(component.updateLoading$).toBeDefined();
      expect(component.addSubscriptions).toHaveBeenCalledTimes(1);
    });
  });
  describe('ngOnDestroy', () => {
    test('should add subscriptions', () => {
      component['subscription'].unsubscribe = jest.fn();
      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
  describe('addSubscriptions', () => {
    test('should add subscriptions', () => {
      component['subscription'].add = jest.fn();
      component.addSubscriptions();
      expect(component['subscription'].add).toHaveBeenCalledTimes(2);
    });
  });

  describe('confirmDisabled', () => {
    beforeEach(() => {
      component.confirmDisabled = false;
    });
    test('should disable editing because of empty string', () => {
      component.addSubscriptions();

      component.editFormControl.setValue('');

      expect(component.confirmDisabled).toBeTruthy();
    });
    test('should disable editing because of too large number', () => {
      component.addSubscriptions();
      component.modalData = { field: ColumnFields.GPI } as any;

      component.editFormControl.setValue('120');

      expect(component.confirmDisabled).toBeTruthy();
    });
  });
  describe('closeDialog', () => {
    test('should close dialogRef', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirmEditing', () => {
    beforeEach(() => {
      store.dispatch = jest.fn();
      component.editFormControl = { value: '10' } as any;
    });
    test('should edit quantity', () => {
      component.modalData = {
        field: ColumnFields.ORDER_QUANTITY,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      } as any;
      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          orderQuantity: 10,
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
        },
      ];

      component.confirmEditing();

      expect(store.dispatch).toHaveBeenCalledWith(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    });
    test('should edit margin', () => {
      component.modalData = {
        field: ColumnFields.GPI,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      } as any;
      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          price: 22.22,
          priceSource: PriceSource.MANUAL,
        },
      ];

      component.confirmEditing();

      expect(store.dispatch).toHaveBeenCalledWith(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    });
    test('should edit discount', () => {
      component.modalData = {
        field: ColumnFields.DISCOUNT,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      } as any;
      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          price: 90,
          priceSource: PriceSource.MANUAL,
        },
      ];

      component.confirmEditing();

      expect(store.dispatch).toHaveBeenCalledWith(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    });
    test('should edit price', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      } as any;
      component.editFormControl = { value: QUOTATION_DETAIL_MOCK.price } as any;
      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          price: QUOTATION_DETAIL_MOCK.price,
          priceSource: PriceSource.MANUAL,
        },
      ];

      component.confirmEditing();

      expect(store.dispatch).toHaveBeenCalledWith(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    });
  });

  describe('onKeyPress', () => {
    test('should call HelperService method for quantity', () => {
      component.modalData = { field: ColumnFields.ORDER_QUANTITY } as any;
      HelperService.validateQuantityInputKeyPress = jest.fn();

      component.onKeyPress({} as any, {} as any);
      expect(HelperService.validateQuantityInputKeyPress).toHaveBeenCalledTimes(
        1
      );
    });
    test('should call HelperService method for two digit numbers', () => {
      component.modalData = { field: ColumnFields.GPI } as any;
      HelperService.validateNumberInputKeyPress = jest.fn();

      component.onKeyPress({} as any, {} as any);
      expect(HelperService.validateNumberInputKeyPress).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('onPaste', () => {
    test('should call HelperService method for quantity', () => {
      component.modalData = { field: ColumnFields.ORDER_QUANTITY } as any;
      HelperService.validateQuantityInputPaste = jest.fn();

      component.onPaste({} as any);
      expect(HelperService.validateQuantityInputPaste).toHaveBeenCalledTimes(1);
    });
    test('should call HelperService method for two digit numbers', () => {
      component.modalData = { field: ColumnFields.GPI } as any;
      HelperService.validateNumberInputPaste = jest.fn();

      component.onPaste({} as any);
      expect(HelperService.validateNumberInputPaste).toHaveBeenCalledTimes(1);
    });
  });
});
