import { ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { LetModule, PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import { updateQuotationDetails } from '../../../../core/store';
import { UpdateQuotationDetail } from '../../../../core/store/reducers/process-case/models';
import { ColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import { PriceSource } from '../../../models/quotation-detail';
import { HelperService } from '../../../services/helper-service/helper-service.service';
import { PriceService } from '../../../services/price-service/price.service';
import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
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
      MockModule(LetModule),
      MockModule(PushModule),
      ReactiveFormsModule,
      MatTooltipModule,
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

    test('should disable relative price editing if there is no price', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: {
          ...QUOTATION_DETAIL_MOCK,
          price: undefined,
        },
      };

      component.ngOnInit();

      expect(component.isRelativePriceChangeDisabled).toEqual(true);
      expect(component.isRelativePriceChange).toEqual(false);
    });

    test('should enabel relative price editing if there is a price', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: {
          ...QUOTATION_DETAIL_MOCK,
          price: 100,
        },
      };

      component.ngOnInit();

      expect(component.isRelativePriceChangeDisabled).toEqual(false);
      expect(component.isRelativePriceChange).toEqual(true);
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
    test('should enable editing for absolute prices > 100', () => {
      component.modalData = { field: ColumnFields.PRICE } as any;
      component.isRelativePriceChange = false;

      component.editFormControl.setValue('111');

      expect(component.confirmDisabled).toBeFalsy();
      expect(component.setAffectedKpis).toHaveBeenCalledTimes(2);
    });
  });
  describe('setAffectedKpis', () => {
    test('should set affected kpis', () => {
      PriceService.calculateAffectedKPIs = jest.fn(() => []);
      component.setAffectedKpis(1);

      expect(component.affectedKpis).toEqual([]);
      expect(component.mspWarningEnabled).toBeFalsy();
    });
    test('should pass isRelativePrice as false correctly', () => {
      PriceService.calculateAffectedKPIs = jest.fn(() => [
        { key: ColumnFields.PRICE, value: 1 },
      ]);
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.isRelativePriceChange = false;
      component.setAffectedKpis(1);

      expect(PriceService.calculateAffectedKPIs).toHaveBeenCalledWith(
        1,
        ColumnFields.PRICE,
        QUOTATION_DETAIL_MOCK,
        false
      );
      expect(component.affectedKpis).toEqual([
        { key: ColumnFields.PRICE, value: 1 },
      ]);
      expect(component.mspWarningEnabled).toBeFalsy();
    });
    test('should pass isRelativePrice as true correctly', () => {
      PriceService.calculateAffectedKPIs = jest.fn(() => []);
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.isRelativePriceChange = true;
      component.setAffectedKpis(1);

      expect(PriceService.calculateAffectedKPIs).toHaveBeenCalledWith(
        1,
        ColumnFields.PRICE,
        QUOTATION_DETAIL_MOCK,
        true
      );
      expect(component.affectedKpis).toEqual([]);
      expect(component.mspWarningEnabled).toBeFalsy();
    });
    test('should set mspWarningEnabled to true', () => {
      PriceService.calculateAffectedKPIs = jest.fn(() => [
        { key: ColumnFields.PRICE, value: 0.1 },
      ]);
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.isRelativePriceChange = true;
      component.setAffectedKpis(1);

      expect(PriceService.calculateAffectedKPIs).toHaveBeenCalledWith(
        1,
        ColumnFields.PRICE,
        QUOTATION_DETAIL_MOCK,
        true
      );
      expect(component.affectedKpis).toEqual([
        { key: ColumnFields.PRICE, value: 0.1 },
      ]);
      expect(component.mspWarningEnabled).toBeTruthy();
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
    test('should edit absolute prices', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      } as any;
      component.editFormControl = { value: 50 } as any;
      component.isRelativePriceChange = false;

      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          price: 50,
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
    test('should call HelperService method for absolute prices', () => {
      component.modalData = { field: ColumnFields.PRICE } as any;
      component.isRelativePriceChange = false;
      HelperService.validateAbsolutePriceInputKeyPress = jest.fn();

      component.onKeyPress({} as any, {} as any);
      expect(
        HelperService.validateAbsolutePriceInputKeyPress
      ).toHaveBeenCalledTimes(1);
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
      component.editFormControl = {} as any;
      HelperService.validateNumberInputPaste = jest.fn();

      component.onPaste({} as any);
      expect(HelperService.validateNumberInputPaste).toHaveBeenCalledTimes(1);
      expect(HelperService.validateNumberInputPaste).toHaveBeenCalledWith(
        {},
        {},
        true
      );
    });
    test('should call HelperService method for absolute prices', () => {
      component.modalData = { field: ColumnFields.PRICE } as any;
      component.editFormControl = {} as any;
      component.isRelativePriceChange = false;
      HelperService.validateNumberInputPaste = jest.fn();

      component.onPaste({} as any);
      expect(HelperService.validateNumberInputPaste).toHaveBeenCalledTimes(1);
      expect(HelperService.validateNumberInputPaste).toHaveBeenCalledWith(
        {},
        {},
        false
      );
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
    test('should use 0 if the value is not parseable', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = '' as unknown as number;
      component.editFormControl = {
        value: undefined,
        setValue: jest.fn(),
      } as any;

      component.increment();

      expect(component.editFormControl.setValue).toHaveBeenCalledWith(1);
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
    test('should not decrement absolute price', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = 1;
      component.editFormControl = { value: 1, setValue: jest.fn() } as any;
      component.isRelativePriceChange = false;

      component.decrement();

      expect(component.editFormControl.setValue).toHaveBeenCalledTimes(0);
    });
    test('should decrement absolute price', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = 20;
      component.editFormControl = { value: 20, setValue: jest.fn() } as any;
      component.isRelativePriceChange = false;

      component.decrement();

      expect(component.editFormControl.setValue).toHaveBeenCalledTimes(1);
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
    test('should use 0 if the value is not parseable', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = '' as unknown as number;
      component.editFormControl = {
        value: undefined,
        setValue: jest.fn(),
      } as any;

      component.decrement();

      expect(component.editFormControl.setValue).toHaveBeenCalledWith(-1);
    });
  });

  describe('radio button change', () => {
    beforeEach(() => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: { ...QUOTATION_DETAIL_MOCK, price: 20 },
      };
    });

    test('should reset form value on radio button change', () => {
      component.editFormControl.setValue(45);
      component.onRadioButtonChange(true);

      expect(component.editFormControl.value).toEqual('');
    });

    test('should reset kpis for relative prices', () => {
      component.editFormControl.setValue(45);
      component.setAffectedKpis = jest.fn();
      component.onRadioButtonChange(true);

      expect(component.setAffectedKpis).toHaveBeenCalledWith(20);
    });

    test('should reset kpis for absolute prices', () => {
      component.editFormControl.setValue(45);
      component.setAffectedKpis = jest.fn();
      component.onRadioButtonChange(false);

      expect(component.setAffectedKpis).toHaveBeenCalledWith(0);
    });
  });
});
