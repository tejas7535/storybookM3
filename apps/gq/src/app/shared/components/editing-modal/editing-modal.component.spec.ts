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
import { ColumnFields } from '../../../shared/ag-grid/constants/column-fields.enum';
import { DialogHeaderModule } from '../../../shared/header/dialog-header/dialog-header.module';
import { PriceSource } from '../../models/quotation-detail';
import { HelperService } from '../../services/helper-service/helper-service.service';
import { PriceService } from '../../services/price-service/price.service';
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
  describe('ngAfterViewInit', () => {
    test('should initalize component variables', () => {
      component.modalData = {
        field: ColumnFields.GPI,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.editInputField = {
        nativeElement: {
          focus: jest.fn(),
        },
      };
      component.setAffectedKpis = jest.fn();

      component.ngAfterViewInit();
      expect(component.value).toEqual(QUOTATION_DETAIL_MOCK.gpi);
      expect(component.setAffectedKpis).toHaveBeenCalledWith(
        QUOTATION_DETAIL_MOCK.gpi
      );
      expect(
        component.editInputField.nativeElement.focus
      ).toHaveBeenCalledTimes(1);
    });
    test('should set value to 0 for price', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };

      component.ngAfterViewInit();

      expect(component.value).toEqual(0);
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
      component.setAffectedKpis = jest.fn();
      component.addSubscriptions();
    });
    test('should disable editing because of missing value', () => {
      component.editFormControl.setValue(undefined as any);

      expect(component.confirmDisabled).toBeTruthy();
      expect(component.setAffectedKpis).toHaveBeenCalledTimes(2);
    });
    test('should disable editing for gpi because of too large number', () => {
      component.modalData = { field: ColumnFields.GPI } as any;

      component.editFormControl.setValue('120');

      expect(component.confirmDisabled).toBeTruthy();
      expect(component.setAffectedKpis).toHaveBeenCalledTimes(2);
    });
    test('should disable editing for gpm because of too large number', () => {
      component.modalData = { field: ColumnFields.GPM } as any;

      component.editFormControl.setValue('120');

      expect(component.confirmDisabled).toBeTruthy();
      expect(component.setAffectedKpis).toHaveBeenCalledTimes(2);
    });
    test('should enable editing for order quantity', () => {
      component.modalData = { field: ColumnFields.ORDER_QUANTITY } as any;

      component.editFormControl.setValue('120');

      expect(component.confirmDisabled).toBeFalsy();
      expect(component.setAffectedKpis).toHaveBeenCalledTimes(2);
    });
    test('should enable editing for gpi', () => {
      component.modalData = { field: ColumnFields.GPI } as any;

      component.editFormControl.setValue('99');

      expect(component.confirmDisabled).toBeFalsy();
      expect(component.setAffectedKpis).toHaveBeenCalledTimes(2);
    });
  });
  describe('setAffectedKpis', () => {
    test('should set affected kpis', () => {
      PriceService.calculateAffectedKPIs = jest.fn(() => []);
      component.setAffectedKpis(1);

      expect(component.affectedKpis).toEqual([]);
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
      component.editFormControl = { value: 50 } as any;
      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          price: 300,
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
  describe('increment', () => {
    test('should increment price', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.editFormControl = { value: 1, setValue: jest.fn() } as any;
      component.increment();

      expect(component.editFormControl.setValue).toHaveBeenCalledTimes(1);
      expect(component.editFormControl.setValue).toHaveBeenCalledWith(2);
    });
    test('should increment price on placeholder value', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = 10;
      component.editFormControl = {
        value: undefined,
        setValue: jest.fn(),
      } as any;
      component.increment();

      expect(component.editFormControl.setValue).toHaveBeenCalledTimes(1);
      expect(component.editFormControl.setValue).toHaveBeenCalledWith(11);
    });
    test('should not increment gpi', () => {
      component.modalData = {
        field: ColumnFields.GPI,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.editFormControl = { value: 99, setValue: jest.fn() } as any;
      component.increment();

      expect(component.editFormControl.setValue).toHaveBeenCalledTimes(0);
    });
  });

  describe('decrement', () => {
    test('should decrement quantity', () => {
      component.modalData = {
        field: ColumnFields.ORDER_QUANTITY,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = 100;
      component.editFormControl = { value: 100, setValue: jest.fn() } as any;

      component.decrement();

      expect(component.editFormControl.setValue).toHaveBeenCalledWith(99);
    });
    test('should not decrement quantity', () => {
      component.modalData = {
        field: ColumnFields.ORDER_QUANTITY,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = 1;
      component.editFormControl = { value: 1, setValue: jest.fn() } as any;

      component.decrement();

      expect(component.editFormControl.setValue).toHaveBeenCalledTimes(0);
    });
    test('should decrement gpi', () => {
      component.modalData = {
        field: ColumnFields.GPI,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = -90;
      component.editFormControl = { value: -90, setValue: jest.fn() } as any;

      component.decrement();

      expect(component.editFormControl.setValue).toHaveBeenCalledWith(-91);
    });
    test('should not decrement gpi', () => {
      component.modalData = {
        field: ColumnFields.ORDER_QUANTITY,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = -99;
      component.editFormControl = { value: -99, setValue: jest.fn() } as any;

      component.decrement();

      expect(component.editFormControl.setValue).toHaveBeenCalledTimes(0);
    });
    test('should decrement for placeholder', () => {
      component.modalData = {
        field: ColumnFields.GPI,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = 96;
      component.editFormControl = {
        value: undefined,
        setValue: jest.fn(),
      } as any;

      component.decrement();

      expect(component.editFormControl.setValue).toHaveBeenCalledWith(95);
    });
    test('should decrement for placeholder for quantity', () => {
      component.modalData = {
        field: ColumnFields.ORDER_QUANTITY,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = 96;
      component.editFormControl = {
        value: undefined,
        setValue: jest.fn(),
      } as any;

      component.decrement();

      expect(component.editFormControl.setValue).toHaveBeenCalledWith(95);
    });
  });
});
