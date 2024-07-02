import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

import { of } from 'rxjs';

import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { SectorGpsdFacade } from '@gq/core/store/sector-gpsd/sector-gpsd.facade';
import { getSalesOrgs } from '@gq/core/store/selectors';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import moment from 'moment';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../../testing/mocks';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';
import { DialogHeaderComponent } from '../../header/dialog-header/dialog-header.component';
import { PurchaseOrderTypeSelectComponent } from '../../purchase-order-type-select/purchase-order-type-select.component';
import { SectorGpsdSelectComponent } from '../../sector-gpsd-select/sector-gpsd-select.component';
import { EditCaseModalComponent } from './edit-case-modal.component';
describe('EditCaseModalComponent', () => {
  let component: EditCaseModalComponent;
  let spectator: Spectator<EditCaseModalComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: EditCaseModalComponent,
    imports: [
      MockComponent(PurchaseOrderTypeSelectComponent),
      MockComponent(SectorGpsdSelectComponent),
      MatFormFieldModule,
      MatDatepickerModule,
      MatMomentDateModule,
      MatSelectModule,
      MatInputModule,
      FormsModule,
      ReactiveFormsModule,
      PushPipe,
      MatAutocompleteModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [MockComponent(DialogHeaderComponent)],
    providers: [
      { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
      {
        provide: MatDialogRef,
        useValue: {
          beforeClosed: jest.fn().mockReturnValue(of([])),
        },
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          caseName: 'case-name',
          currency: 'EUR',
          quotationToDate: '2022-12-31T00:00:00.000Z',
          requestedDeliveryDate: '2022-12-31T00:00:00.000Z',
          customerPurchaseOrderDate: '2022-12-31T00:00:00.000Z',
          bindingPeriodValidityEndDate: '2022-12-31T00:00:00.000Z',
          purchaseOrderType: { id: 1, name: 'ZOR' },
          partnerRoleType: { id: '6000036', name: 'MRO Mining' },
          caseCustomer: {
            identifier: { customerId: '123456', salesOrg: '0815' },
          },
          enableSapFieldEditing: true,
        },
      },
      provideMockStore({
        initialState: {
          currency: {
            availableCurrencies: ['EUR', 'USD'],
          },
          case: CREATE_CASE_STORE_STATE_MOCK,
        },
      }),
      mockProvider(TranslocoLocaleService),
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
      },
      {
        provide: AutoCompleteFacade,
        useValue: {
          resetView: jest.fn(),
          initFacade: jest.fn(),
          autocomplete: jest.fn(),
          resetAutocompleteMaterials: jest.fn(),
          materialNumberOrDescForGlobalSearch$: of({
            filter: FilterNames.CUSTOMER_AND_SHIP_TO_PARTY,
            items: [],
          }),
        },
      },
      {
        provide: CurrencyFacade,
        useValue: {
          availableCurrencies$: of([]),
        },
      },
      {
        provide: SectorGpsdFacade,
        useValue: {
          loadSectorGpsdByCustomerAndSalesOrg: jest.fn(),
          resetAllSectorGpsds: jest.fn(),
        },
      },
    ],
    detectChanges: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should create FormGroup and fill in caseName and currency', () => {
      expect(component.caseModalForm.controls.caseName.value).toBe('case-name');
      expect(component.caseModalForm.controls.currency.value).toBe('EUR');
      expect(
        component.caseModalForm.controls.quotationToDate.value
      ).toStrictEqual(moment('2022-12-31T00:00:00.000Z'));
      expect(
        component.caseModalForm.controls.requestedDeliveryDate.value
      ).toStrictEqual(moment('2022-12-31T00:00:00.000Z'));
      expect(
        component.caseModalForm.controls.customerPurchaseOrderDate.value
      ).toStrictEqual(moment('2022-12-31T00:00:00.000Z'));
      expect(
        component.caseModalForm.controls.bindingPeriodValidityEndDate.value
      ).toStrictEqual(moment('2022-12-31T00:00:00.000Z'));
    });

    test('should set salesOrg from array', () => {
      store.overrideSelector(getSalesOrgs, [
        { id: '0267', selected: false },
        { id: '0268', selected: false },
      ]);

      component.ngOnInit();

      expect(component.salesOrg).toEqual('0267');
    });

    test('should set salesOrg from modalData if subscription is empty', () => {
      component.modalData = {
        salesOrg: '0269',
        caseCustomer: {
          identifier: { customerId: '123456', salesOrg: '0815' },
        },
      } as any;

      store.overrideSelector(getSalesOrgs, []);

      component.ngOnInit();

      expect(component.salesOrg).toEqual('0269');
    });

    test('should set purchaseOrderType from Modal data', () => {
      expect(component.caseModalForm.controls.purchaseOrderType.value).toEqual({
        id: 1,
        name: 'ZOR',
      });
    });
    test('should set partnerRoleType from Modal data', () => {
      expect(component.caseModalForm.controls.partnerRoleType.value).toEqual({
        id: '6000036',
        name: 'MRO Mining',
      });
    });

    test('should request sectorGpsd data', () => {
      component.ngOnInit();
      expect(
        component['sectorGpsdFacade'].loadSectorGpsdByCustomerAndSalesOrg
      ).toHaveBeenCalled();
    });
  });

  describe('subscribeToChanges', () => {
    test('should set hasCaseModalForm to true for caseName', () => {
      expect(component.hasCaseModalFormChange).toBeFalsy();
      component.caseModalForm.get('caseName').setValue('testCase');
      expect(component.hasCaseModalFormChange).toBeTruthy();
    });

    test('Should set hasCaseModalForm to true for customerPurchaseOrderDate', () => {
      expect(component.hasCaseModalFormChange).toBeFalsy();
      component.validatePurchaseOrderDateDependentDates = jest.fn();
      component.caseModalForm
        .get('customerPurchaseOrderDate')
        .setValue(moment('01.01.2019'));
      expect(component.hasCaseModalFormChange).toBeTruthy();
      expect(
        component.validatePurchaseOrderDateDependentDates
      ).toHaveBeenCalled();
    });
    test('should handle autocomplete resetAutocompleteMaterials', () => {
      Object.defineProperty(component, 'autocomplete', {
        value: {
          autocomplete: jest.fn(),
          resetAutocompleteMaterials: jest.fn(),
        },
      });

      component.caseModalForm.get('shipToParty').setValue('s');
      expect(
        component.autocomplete.resetAutocompleteMaterials
      ).toHaveBeenCalled();
    });

    test('should handle autocomplete empty string', () => {
      Object.defineProperty(component, 'autocomplete', {
        value: {
          autocomplete: jest.fn(),
          resetAutocompleteMaterials: jest.fn(),
        },
      });

      component.caseModalForm.get('shipToParty').setValue('');
      expect(
        component.autocomplete.resetAutocompleteMaterials
      ).toHaveBeenCalled();
    });
  });

  describe('close dialog', () => {
    test('should close dialog and reset sectorGpsd', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(
        component['sectorGpsdFacade'].resetAllSectorGpsds
      ).toHaveBeenCalled();
    });
  });

  describe('submit dialog', () => {
    test('sould submit caseName and currency and all SAP Data Values', () => {
      component['dialogRef'].close = jest.fn();

      spectator.detectChanges();

      component.caseModalForm.controls.caseName.setValue('new-case-name');
      component.caseModalForm.controls.currency.setValue('USD');
      component.caseModalForm.controls.quotationToDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );
      component.caseModalForm.controls.customerPurchaseOrderDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );
      component.caseModalForm.controls.requestedDeliveryDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );
      component.caseModalForm.controls.bindingPeriodValidityEndDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );

      component.submitDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        caseName: 'new-case-name',
        currency: 'USD',
        quotationToDate: '2022-12-31T00:00:00.000Z',
        requestedDelDate: '2022-12-31T00:00:00.000Z',
        customerPurchaseOrderDate: '2022-12-31T00:00:00.000Z',
        validTo: '2022-12-31T00:00:00.000Z',
        purchaseOrderTypeId: 1,
        partnerRoleId: '6000036',
      });
    });

    test('should trim case name before submitting', () => {
      component['dialogRef'].close = jest.fn();

      spectator.detectChanges();

      component.caseModalForm.controls.caseName.setValue('   new whitespace ');
      component.caseModalForm.controls.currency.setValue('USD');
      component.caseModalForm.controls.quotationToDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );
      component.caseModalForm.controls.customerPurchaseOrderDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );
      component.caseModalForm.controls.requestedDeliveryDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );
      component.caseModalForm.controls.bindingPeriodValidityEndDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );

      component.submitDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        caseName: 'new whitespace',
        currency: 'USD',
        quotationToDate: '2022-12-31T00:00:00.000Z',
        requestedDelDate: '2022-12-31T00:00:00.000Z',
        customerPurchaseOrderDate: '2022-12-31T00:00:00.000Z',
        validTo: '2022-12-31T00:00:00.000Z',
        purchaseOrderTypeId: 1,
        partnerRoleId: '6000036',
      });
    });

    test('should update case name with missing dates', () => {
      component['dialogRef'].close = jest.fn();

      spectator.detectChanges();

      component.caseModalForm.controls.caseName.setValue('   new whitespace ');
      component.caseModalForm.controls.currency.setValue('USD');
      component.caseModalForm.controls.quotationToDate.setValue(
        undefined as any
      );
      component.caseModalForm.controls.customerPurchaseOrderDate.setValue(
        undefined as any
      );
      component.caseModalForm.controls.requestedDeliveryDate.setValue(
        undefined as any
      );
      component.caseModalForm.controls.bindingPeriodValidityEndDate.setValue(
        undefined as any
      );

      component.submitDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        caseName: 'new whitespace',
        currency: 'USD',
        purchaseOrderTypeId: 1,
        partnerRoleId: '6000036',
      });
    });
  });

  describe('show hint', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should show correct hint for empty name', () => {
      spectator.detectChanges();
      component.caseModalForm.controls.caseName.setValue('');

      spectator.detectChanges();

      const hint = spectator.query('mat-hint');
      expect(hint.textContent).toEqual('0 / 20');
    });

    test('should show correct hint for non-empty name', () => {
      spectator.detectChanges();
      component.caseModalForm.controls.caseName.setValue('Test Case');

      spectator.detectChanges();

      const hint = spectator.query('mat-hint');
      expect(hint.textContent).toEqual('9 / 20');
    });
  });

  describe('set maxLength', () => {
    test('should set maxLength attribute on the input', () => {
      component.NAME_MAX_LENGTH = 10;
      spectator.detectChanges();

      const input = spectator.query('input') as HTMLInputElement;

      expect(input.maxLength).toEqual(10);
    });
  });

  describe('validateDateGreaterOrEqualToday', () => {
    beforeEach(() => {
      Object.defineProperty(component, 'today', {
        value: new Date('01.01.2019'),
      });
    });

    it('should return undefined as Error', () => {
      const control: FormControl = new FormControl(
        moment({ year: 2019, month: 1, day: 2 })
      );
      const result = component['validateDateGreaterOrEqualToday'](control);
      expect(result).toBeUndefined();
    });

    it('should return an error as Error', () => {
      const control: FormControl = new FormControl(
        moment({ year: 2018, month: 1, day: 1 })
      );
      const result = component['validateDateGreaterOrEqualToday'](control);
      expect(result).toEqual({ smallerThanToday: true });
    });
    it('should return undefined if control has no value', () => {
      const control: FormControl = new FormControl(undefined);
      const result = component['validateDateGreaterOrEqualToday'](control);
      expect(result).toBeUndefined();
    });
  });

  describe('validatePurchaseOrderDateDependentDates', () => {
    test('should update validity of dependent dates when customPurchaseOrder Date has changed', () => {
      component.ngOnInit();
      component.caseModalForm.controls.customerPurchaseOrderDate.setValue(
        moment('01.01.2019')
      );

      component.caseModalForm.controls.quotationToDate.setValue(
        moment('02.01.2019')
      );
      component.caseModalForm.controls.quotationToDate.updateValueAndValidity =
        jest.fn();
      component.caseModalForm.controls.quotationToDate.markAsTouched =
        jest.fn();

      component.caseModalForm.controls.bindingPeriodValidityEndDate.setValue(
        moment('02.01.2019')
      );
      component.caseModalForm.controls.bindingPeriodValidityEndDate.updateValueAndValidity =
        jest.fn();
      component.caseModalForm.controls.bindingPeriodValidityEndDate.markAsTouched =
        jest.fn();

      component.validatePurchaseOrderDateDependentDates();

      expect(
        component.caseModalForm.controls.quotationToDate.updateValueAndValidity
      ).toHaveBeenCalled();
      expect(
        component.caseModalForm.controls.quotationToDate.markAsTouched
      ).toHaveBeenCalled();
      expect(
        component.caseModalForm.controls.bindingPeriodValidityEndDate
          .updateValueAndValidity
      ).toHaveBeenCalled();
      expect(
        component.caseModalForm.controls.bindingPeriodValidityEndDate
          .markAsTouched
      ).toHaveBeenCalled();
    });
  });

  describe('validateDateGreaterOrEqualThanPurchaseOrderDate', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.caseModalForm
        .get('customerPurchaseOrderDate')
        .setValue(moment('01.01.2019'));
    });

    it('Should return undefined as Error', () => {
      const control: FormControl = new FormControl(moment('02.01.2019'));
      const result: ValidationErrors | null =
        component.validateDateGreaterOrEqualThanPurchaseOrderDate(control);
      expect(result).toBeUndefined();
    });

    it('Should return an error as Error', () => {
      const control: FormControl = new FormControl(moment('01.01.2018'));
      const expectedError: ValidationErrors = { smallerThanPoDate: true };

      const result: ValidationErrors | null =
        component.validateDateGreaterOrEqualThanPurchaseOrderDate(control);
      expect(result).toEqual(expectedError);
    });
    it('Should not return an error when values equal', () => {
      const control: FormControl = new FormControl(moment('01.01.2019'));

      const result: ValidationErrors | null =
        component.validateDateGreaterOrEqualThanPurchaseOrderDate(control);
      expect(result).toBeUndefined();
    });
    it('should return undefined if control has no value', () => {
      const control: FormControl = new FormControl(undefined);
      const result: ValidationErrors | null =
        component.validateDateGreaterOrEqualThanPurchaseOrderDate(control);
      expect(result).toBeUndefined();
    });
  });

  describe('isTheSameDay', () => {
    test('should return true if dates are the same day', () => {
      const date1 = moment('01.01.2019');
      const date2 = '01.01.2019';
      expect(component['isTheSameDay'](date1, date2)).toEqual(true);
    });

    test('should return false if dates are not the same day', () => {
      const date1 = moment('01.01.2019');
      const date2 = '02.01.2019';
      expect(component['isTheSameDay'](date1, date2)).toEqual(false);
    });

    test('should return false if second date is undefined', () => {
      const date1 = moment('01.01.2019');

      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(component['isTheSameDay'](date1, undefined)).toEqual(false);
    });

    test('should return true if both dates are undefined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(component['isTheSameDay'](undefined, undefined)).toEqual(true);
    });
  });
});
