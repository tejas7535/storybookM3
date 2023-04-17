import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

import { updateQuotationDetails } from '@gq/core/store/actions';
import { UpdateQuotationDetail } from '@gq/core/store/reducers/models';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { LetModule, PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { ColumnFields } from '../../../ag-grid/constants/column-fields.enum';
import { LOCALE_DE, LOCALE_EN } from '../../../constants';
import * as regex from '../../../constants/regex';
import { PriceSource } from '../../../models/quotation-detail';
import { HelperService } from '../../../services/helper/helper.service';
import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';
import { EditingModalComponent } from './editing-modal.component';

describe('EditingModalComponent', () => {
  let component: EditingModalComponent;
  let spectator: Spectator<EditingModalComponent>;
  let store: MockStore;
  let helperService: HelperService;
  let translocoService: TranslocoLocaleService;

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
      mockProvider(TranslocoLocaleService),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
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
      {
        provide: HelperService,
        useValue: {
          transformNumber: jest.fn().mockImplementation((value, showDigits) =>
            Intl.NumberFormat('de-DE', {
              minimumFractionDigits: showDigits ? 2 : undefined,
              maximumFractionDigits: showDigits ? 2 : 0,
            }).format(value)
          ),
        },
      },
    ],
  });

  const updateFormValue = (value: string) => {
    component.editingFormGroup.get('valueInput').setValue(value);
  };

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    helperService = spectator.inject(HelperService);
    translocoService = spectator.inject(TranslocoLocaleService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    test(
      'should initalize observables',
      marbles((m) => {
        component.addSubscriptions = jest.fn();
        component.ngOnInit();

        m.expect(component.quotationCurrency$).toBeObservable('a', {
          a: QUOTATION_MOCK.currency,
        });
        m.expect(component.updateLoading$).toBeObservable('a', {
          a: PROCESS_CASE_STATE_MOCK.quotation.updateLoading,
        });
        expect(component.addSubscriptions).toHaveBeenCalledTimes(1);
      })
    );

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
      expect(
        component.editingFormGroup.get('isRelativePriceChangeRadioGroup').value
      ).toEqual(false);
    });

    test('should enable relative price editing if there is a price', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: {
          ...QUOTATION_DETAIL_MOCK,
          price: 100,
        },
      };

      component.ngOnInit();

      expect(component.isRelativePriceChangeDisabled).toBeUndefined();
      expect(
        component.editingFormGroup.get('isRelativePriceChangeRadioGroup').value
      ).toEqual(true);
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
      expect(component.localeValue).toEqual('90,00');
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

    test('should validate input directly', () => {
      component.validateInput = jest.fn();
      component.modalData.field = ColumnFields.ORDER_QUANTITY;
      component.modalData.quotationDetail.orderQuantity = 10;

      component.ngAfterViewInit();

      expect(component.validateInput).toHaveBeenCalledWith('10');
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
      component.setAffectedKpis = jest.fn();
      component.addSubscriptions();
    });

    test('should disable editing because of missing value', () => {
      updateFormValue(undefined as any);

      expect(component.editingFormGroup.get('valueInput').value).toBeFalsy();
      expect(component.setAffectedKpis).toHaveBeenCalledTimes(2);
    });

    test('should disable editing for gpi because of too large number', () => {
      component.modalData = { field: ColumnFields.GPI } as any;
      updateFormValue('120');

      expect(component.editingFormGroup.get('valueInput').valid).toEqual(false);
      expect(component.setAffectedKpis).toHaveBeenCalledTimes(2);
    });

    test('should disable editing for gpm because of too large number', () => {
      component.modalData = {
        field: ColumnFields.GPM,
        quotationDetail: {},
      } as any;
      updateFormValue('120');

      expect(component.editingFormGroup.get('valueInput').valid).toEqual(false);
      expect(component.setAffectedKpis).toHaveBeenCalledTimes(2);
    });

    test('should enable editing for order quantity', () => {
      component.modalData = {
        field: ColumnFields.ORDER_QUANTITY,
        quotationDetail: {},
      } as any;
      updateFormValue('120');

      expect(component.editingFormGroup.get('valueInput').valid).toEqual(true);
      expect(component.setAffectedKpis).toHaveBeenCalledTimes(2);
    });
    test('should enable editing for gpi', () => {
      component.modalData = { field: ColumnFields.GPI } as any;
      updateFormValue('99');

      expect(component.editingFormGroup.get('valueInput').valid).toEqual(true);
      expect(component.setAffectedKpis).toHaveBeenCalledTimes(2);
    });
    test('should enable editing for absolute prices > 100', () => {
      component.modalData = { field: ColumnFields.PRICE } as any;
      component.editingFormGroup
        .get('isRelativePriceChangeRadioGroup')
        .setValue(false);
      updateFormValue('120');

      expect(component.editingFormGroup.get('valueInput').valid).toEqual(true);
      expect(component.setAffectedKpis).toHaveBeenCalledTimes(2);
    });
    test('should still simulate with german locale', () => {
      component['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_DE.id);
      component.modalData = { field: ColumnFields.PRICE } as any;
      component.editingFormGroup
        .get('isRelativePriceChangeRadioGroup')
        .setValue(false);
      updateFormValue('93,18');

      expect(component.editingFormGroup.get('valueInput').valid).toEqual(true);
      expect(component.setAffectedKpis).toHaveBeenCalledTimes(2);
      expect(component.setAffectedKpis).toHaveBeenCalledWith(93.18);
    });
  });

  describe('setAffectedKpis', () => {
    test('should set affected kpis', () => {
      jest
        .spyOn(pricingUtils, 'calculateAffectedKPIs')
        .mockImplementation(() => []);
      component.setAffectedKpis(1);

      expect(component.affectedKpis).toEqual([]);
      expect(component.mspWarningEnabled).toBeFalsy();
    });
    test('should pass isRelativePrice as false correctly', () => {
      jest
        .spyOn(pricingUtils, 'calculateAffectedKPIs')
        .mockImplementation(() => [{ key: ColumnFields.PRICE, value: 1 }]);
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.editingFormGroup
        .get('isRelativePriceChangeRadioGroup')
        .setValue(false);
      component.setAffectedKpis(1);

      expect(pricingUtils.calculateAffectedKPIs).toHaveBeenCalledWith(
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
      jest
        .spyOn(pricingUtils, 'calculateAffectedKPIs')
        .mockImplementation(() => []);
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.editingFormGroup
        .get('isRelativePriceChangeRadioGroup')
        .setValue(true);
      component.setAffectedKpis(1);

      expect(pricingUtils.calculateAffectedKPIs).toHaveBeenCalledWith(
        1,
        ColumnFields.PRICE,
        QUOTATION_DETAIL_MOCK,
        true
      );
      expect(component.affectedKpis).toEqual([]);
      expect(component.mspWarningEnabled).toBeFalsy();
    });
    test('should set mspWarningEnabled to true', () => {
      jest
        .spyOn(pricingUtils, 'calculateAffectedKPIs')
        .mockImplementation(() => [{ key: ColumnFields.PRICE, value: 0.1 }]);
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.editingFormGroup
        .get('isRelativePriceChangeRadioGroup')
        .setValue(true);
      component.setAffectedKpis(1);

      expect(pricingUtils.calculateAffectedKPIs).toHaveBeenCalledWith(
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
      component.editingFormGroup.get('valueInput').setValue('10');
    });
    afterAll(() => {
      jest.clearAllMocks();
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
      component.editingFormGroup.get('valueInput').setValue('50');
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
      component.editingFormGroup.get('valueInput').setValue('50');
      component.editingFormGroup
        .get('isRelativePriceChangeRadioGroup')
        .setValue(false);

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
    test('should edit absolute prices with parsing for LocaleEN', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      } as any;
      component.editingFormGroup.get('valueInput').setValue('50,000.22');
      component.editingFormGroup
        .get('isRelativePriceChangeRadioGroup')
        .setValue(false);
      component['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_EN.id);

      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          price: 50_000.22,
          priceSource: PriceSource.MANUAL,
        },
      ];

      component.confirmEditing();

      expect(store.dispatch).toHaveBeenCalledWith(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    });
    test('should edit absolute prices with parsing for LocaleDE', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      } as any;
      component.editingFormGroup.get('valueInput').setValue('50.000,22');
      component.editingFormGroup
        .get('isRelativePriceChangeRadioGroup')
        .setValue(false);
      component['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_DE.id);
      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          price: 50_000.22,
          priceSource: PriceSource.MANUAL,
        },
      ];

      component.confirmEditing();

      expect(store.dispatch).toHaveBeenCalledWith(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    });
    test('should edit relative prices with parsing for LocaleDE', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      } as any;
      component.editingFormGroup.get('valueInput').setValue('63,18');
      component.editingFormGroup
        .get('isRelativePriceChangeRadioGroup')
        .setValue(true);
      component['translocoLocaleService'].getLocale = jest
        .fn()
        .mockReturnValue(LOCALE_DE.id);
      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          price: 326.36,
          priceSource: PriceSource.MANUAL,
        },
      ];

      component.confirmEditing();

      expect(store.dispatch).toHaveBeenCalledWith(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    });
  });

  describe('increment', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should increment price', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      updateFormValue('1');
      component.increment();

      expect(component.editingFormGroup.get('valueInput').value).toEqual('2');
      expect(helperService.transformNumber).toHaveBeenCalledWith(2, false);
      expect(helperService.transformNumber).toHaveBeenCalledTimes(2);
    });

    test('should increment price on placeholder value', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = 10;
      updateFormValue(undefined as any);

      component.increment();

      expect(component.editingFormGroup.get('valueInput').value).toEqual('11');
      expect(helperService.transformNumber).toHaveBeenCalledWith(11, false);
      expect(helperService.transformNumber).toHaveBeenCalledTimes(2);
    });
    test('should not increment gpi', () => {
      component.modalData = {
        field: ColumnFields.GPI,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      updateFormValue('99');
      component.increment();

      expect(component.editingFormGroup.get('valueInput').value).toEqual('99');
      expect(helperService.transformNumber).toHaveBeenCalledTimes(1);
    });

    test('should use 0 if the value is not parseable', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = '' as unknown as number;
      updateFormValue(undefined as any);

      component.increment();

      expect(component.editingFormGroup.get('valueInput').value).toEqual('1');
      expect(helperService.transformNumber).toHaveBeenCalledWith(1, false);
      expect(helperService.transformNumber).toHaveBeenCalledTimes(2);
    });

    test('should increment float value', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      updateFormValue('10.25' as any);

      component.increment();

      expect(component.editingFormGroup.get('valueInput').value).toEqual(
        '11,25'
      );
      expect(helperService.transformNumber).toHaveBeenCalledWith(11.25, true);
      expect(helperService.transformNumber).toHaveBeenCalledTimes(2);
    });
  });

  describe('decrement', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should decrement quantity', () => {
      component.modalData = {
        field: ColumnFields.ORDER_QUANTITY,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = 100;
      updateFormValue('100');

      component.decrement();

      expect(component.editingFormGroup.get('valueInput').value).toEqual('99');
      expect(helperService.transformNumber).toHaveBeenCalledWith(99, false);
      expect(helperService.transformNumber).toHaveBeenCalledTimes(2);
    });
    test('should not decrement quantity', () => {
      component.modalData = {
        field: ColumnFields.ORDER_QUANTITY,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = 1;
      updateFormValue('1');

      component.decrement();

      expect(component.editingFormGroup.get('valueInput').value).toEqual('1');
      expect(helperService.transformNumber).toHaveBeenCalledTimes(1);
    });
    test('should decrement gpi', () => {
      component.modalData = {
        field: ColumnFields.GPI,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = -90;
      updateFormValue('-90');

      component.decrement();

      expect(component.editingFormGroup.get('valueInput').value).toEqual('-91');
      expect(helperService.transformNumber).toHaveBeenCalledWith(-91, false);
      expect(helperService.transformNumber).toHaveBeenCalledTimes(2);
    });
    test('should not decrement gpi', () => {
      component.modalData = {
        field: ColumnFields.ORDER_QUANTITY,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = -99;
      updateFormValue('-90');

      component.decrement();

      expect(component.editingFormGroup.get('valueInput').value).toEqual('-90');
      expect(helperService.transformNumber).toHaveBeenCalledTimes(1);
    });
    test('should not decrement absolute price', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = 1;
      updateFormValue('1');
      component.editingFormGroup
        .get('isRelativePriceChangeRadioGroup')
        .setValue(false);

      component.decrement();

      expect(component.editingFormGroup.get('valueInput').value).toEqual('1');
      expect(helperService.transformNumber).toHaveBeenCalledTimes(1);
    });
    test('should decrement absolute price', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = 20;
      updateFormValue('20');
      component.editingFormGroup
        .get('isRelativePriceChangeRadioGroup')
        .setValue(false);

      component.decrement();

      expect(component.editingFormGroup.get('valueInput').value).toEqual('19');
      expect(helperService.transformNumber).toHaveBeenCalledWith(19, false);
      expect(helperService.transformNumber).toHaveBeenCalledTimes(2);
    });
    test('should decrement for placeholder', () => {
      component.modalData = {
        field: ColumnFields.GPI,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = 96;

      component.decrement();

      expect(component.editingFormGroup.get('valueInput').value).toEqual('95');
      expect(helperService.transformNumber).toHaveBeenCalledWith(95, false);
      expect(helperService.transformNumber).toHaveBeenCalledTimes(2);
    });
    test('should use 0 if the value is not parseable', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      component.value = '' as unknown as number;
      updateFormValue(undefined as any);

      component.decrement();

      expect(component.editingFormGroup.get('valueInput').value).toEqual('-1');
      expect(helperService.transformNumber).toHaveBeenCalledWith(-1, false);
      expect(helperService.transformNumber).toHaveBeenCalledTimes(2);
    });

    test('should decrement float value', () => {
      component.modalData = {
        field: ColumnFields.PRICE,
        quotationDetail: QUOTATION_DETAIL_MOCK,
      };
      updateFormValue('10.25' as any);

      component.decrement();

      expect(component.editingFormGroup.get('valueInput').value).toEqual(
        '9,25'
      );
      expect(helperService.transformNumber).toHaveBeenCalledWith(9.25, true);
      expect(helperService.transformNumber).toHaveBeenCalledTimes(2);
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
      updateFormValue('45');
      component.onRadioButtonChange(true);

      expect(component.editingFormGroup.get('valueInput').value).toEqual('');
    });

    test('should reset kpis for relative prices', () => {
      updateFormValue('45');
      component.setAffectedKpis = jest.fn();
      component.onRadioButtonChange(true);

      expect(component.setAffectedKpis).toHaveBeenCalledWith(20);
    });

    test('should reset kpis for absolute prices', () => {
      updateFormValue('45');
      component.setAffectedKpis = jest.fn();
      component.onRadioButtonChange(false);

      expect(component.setAffectedKpis).toHaveBeenCalledWith(0);
    });
  });

  describe('validateInput', () => {
    let dummyRegExpOb: RegExp;
    let locale: string;

    beforeEach(() => {
      dummyRegExpOb = {
        test: jest.fn(() => true),
      } as any as RegExp;
      locale = 'de';
      translocoService.getLocale = jest.fn(() => locale);
    });

    test('should validate ORDER_QUANTITY with invalid value', () => {
      component.modalData.field = ColumnFields.ORDER_QUANTITY;
      jest.spyOn(regex, 'getQuantityRegex').mockReturnValue(dummyRegExpOb);

      const result = component.validateInput(undefined as any);

      expect(translocoService.getLocale).toHaveBeenCalledTimes(1);
      expect(regex.getQuantityRegex).toHaveBeenCalledWith(locale);
      expect(dummyRegExpOb.test).toHaveBeenCalledWith(undefined);
      expect(result).toBeTruthy();
      expect(component.orderQuantityWarning).toBeTruthy();
    });

    test('should validate ORDER_QUANTITY with valid value', () => {
      component.modalData.field = ColumnFields.ORDER_QUANTITY;
      jest.spyOn(regex, 'getQuantityRegex').mockReturnValue(dummyRegExpOb);

      const result = component.validateInput('44');

      expect(translocoService.getLocale).toHaveBeenCalledTimes(1);
      expect(regex.getQuantityRegex).toHaveBeenCalledWith(locale);
      expect(dummyRegExpOb.test).toHaveBeenCalledWith('44');
      expect(result).toBeTruthy();
      expect(component.orderQuantityWarning).toBeFalsy();
    });

    test('should validate ORDER_QUANTITY with valid value but too low quantity', () => {
      component.modalData.field = ColumnFields.ORDER_QUANTITY;
      jest.spyOn(regex, 'getQuantityRegex').mockReturnValue(dummyRegExpOb);
      component.modalData.quotationDetail.deliveryUnit = 10;

      const result = component.validateInput('5');

      expect(translocoService.getLocale).toHaveBeenCalledTimes(1);
      expect(regex.getQuantityRegex).toHaveBeenCalledWith(locale);
      expect(dummyRegExpOb.test).toHaveBeenCalledWith('5');
      expect(result).toBeTruthy();
      expect(component.orderQuantityWarning).toBeTruthy();
    });

    test('should validate ORDER_QUANTITY with valid value but no deliveryUnit set', () => {
      component.modalData.field = ColumnFields.ORDER_QUANTITY;
      jest.spyOn(regex, 'getQuantityRegex').mockReturnValue(dummyRegExpOb);
      component.modalData.quotationDetail.deliveryUnit = undefined;

      const result = component.validateInput('5');

      expect(translocoService.getLocale).toHaveBeenCalledTimes(1);
      expect(regex.getQuantityRegex).toHaveBeenCalledWith(locale);
      expect(dummyRegExpOb.test).toHaveBeenCalledWith('5');
      expect(result).toBeTruthy();
      expect(component.orderQuantityWarning).toBeFalsy();
    });

    test('should use currency regex if field is price and relative price change is set to false', () => {
      component.editingFormGroup = new FormGroup({
        isRelativePriceChangeRadioGroup: new FormControl(
          false,
          Validators.required
        ),
        valueInput: new FormControl(undefined),
      });
      component.modalData.field = ColumnFields.PRICE;
      jest.spyOn(regex, 'getCurrencyRegex').mockReturnValue(dummyRegExpOb);

      const result = component.validateInput('5');

      expect(translocoService.getLocale).toHaveBeenCalledTimes(1);
      expect(regex.getCurrencyRegex).toHaveBeenCalledWith(locale);
      expect(dummyRegExpOb.test).toHaveBeenCalledWith('5');
      expect(result).toBeTruthy();
    });

    test('should use perecentage regex if field is price and relative price change is set to true', () => {
      component.editingFormGroup = new FormGroup({
        isRelativePriceChangeRadioGroup: new FormControl(
          true,
          Validators.required
        ),
        valueInput: new FormControl(undefined),
      });
      component.modalData.field = ColumnFields.PRICE;
      jest.spyOn(regex, 'getPercentageRegex').mockReturnValue(dummyRegExpOb);

      const result = component.validateInput('5');

      expect(translocoService.getLocale).toHaveBeenCalledTimes(1);
      expect(regex.getPercentageRegex).toHaveBeenCalledWith(locale);
      expect(dummyRegExpOb.test).toHaveBeenCalledWith('5');
      expect(result).toBeTruthy();
    });

    test('should use perecentage regex if field is other than price', () => {
      component.editingFormGroup = new FormGroup({
        isRelativePriceChangeRadioGroup: new FormControl(
          false,
          Validators.required
        ),
        valueInput: new FormControl(undefined),
      });
      component.modalData.field = ColumnFields.DISCOUNT;
      jest.spyOn(regex, 'getPercentageRegex').mockReturnValue(dummyRegExpOb);

      const result = component.validateInput('5');

      expect(translocoService.getLocale).toHaveBeenCalledTimes(1);
      expect(regex.getPercentageRegex).toHaveBeenCalledWith(locale);
      expect(dummyRegExpOb.test).toHaveBeenCalledWith('5');
      expect(result).toBeTruthy();
    });
  });
});
