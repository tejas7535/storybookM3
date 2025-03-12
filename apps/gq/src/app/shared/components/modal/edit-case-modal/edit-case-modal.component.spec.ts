import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { RouterModule } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

import {
  clearCreateCaseRowData,
  clearCustomer,
  clearShipToParty,
  resetAllAutocompleteOptions,
} from '@gq/core/store/actions';
import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { AutoCompleteFacade, RolesFacade } from '@gq/core/store/facades';
import { SectorGpsdFacade } from '@gq/core/store/sector-gpsd/sector-gpsd.facade';
import { getSalesOrgsOfShipToParty } from '@gq/core/store/selectors';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import moment from 'moment';
import { MockComponent, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../../testing/mocks';
import { OfferTypeSelectComponent } from '../../offer-type-select/offer-type-select.component';
import { PurchaseOrderTypeSelectComponent } from '../../purchase-order-type-select/purchase-order-type-select.component';
import { SectorGpsdSelectComponent } from '../../sector-gpsd-select/sector-gpsd-select.component';
import { SelectSalesOrgComponent } from '../../select-sales-org/select-sales-org.component';
import { EditCaseModalComponent } from './edit-case-modal.component';
describe('EditCaseModalComponent', () => {
  let component: EditCaseModalComponent;
  let spectator: Spectator<EditCaseModalComponent>;
  let store: MockStore;

  const userHasAccessToOfferType$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  const createComponent = createComponentFactory({
    component: EditCaseModalComponent,
    imports: [
      RouterModule.forRoot([]),
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      MockComponent(PurchaseOrderTypeSelectComponent),
      MockComponent(SectorGpsdSelectComponent),
      MockComponent(OfferTypeSelectComponent),
      MockComponent(SelectSalesOrgComponent),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
      {
        provide: MatDialogRef,
        useValue: {} as unknown as MatDialogRef<EditCaseModalComponent>,
      },
      MockProvider(MatDialogRef, {
        beforeClosed: jest.fn().mockReturnValue(of([])),
        close: jest.fn(),
      } as unknown as MatDialogRef<EditCaseModalComponent>),

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
          offerType: { id: 1, name: 'offer type name' },
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

      MockProvider(AutoCompleteFacade, {
        resetView: jest.fn(),
        initFacade: jest.fn(),
        autocomplete: jest.fn(),
        resetAutocompleteMaterials: jest.fn(),
      }),
      MockProvider(CurrencyFacade, {
        availableCurrencies$: of([]),
      }),

      MockProvider(SectorGpsdFacade, {
        loadSectorGpsdByCustomerAndSalesOrg: jest.fn(),
        resetAllSectorGpsds: jest.fn(),
      }),

      {
        provide: RolesFacade,
        useValue: {
          userHasRegionWorldOrGreaterChinaRole$:
            userHasAccessToOfferType$$.asObservable(),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should set userHasOfferTypeAccess$', () => {
    test(
      'should set userHasOfferTypeAccess$ to true',
      marbles((m) => {
        userHasAccessToOfferType$$.next(true);
        m.expect(component.userHasOfferTypeAccess$).toBeObservable('t', {
          t: true,
        });
      })
    );

    test(
      'should set userHasOfferTypeAccess$ to false',
      marbles((m) => {
        userHasAccessToOfferType$$.next(false);
        m.expect(component.userHasOfferTypeAccess$).toBeObservable('t', {
          t: false,
        });
      })
    );
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
      store.overrideSelector(getSalesOrgsOfShipToParty, [
        { id: '0267', selected: false },
        { id: '0268', selected: false },
      ]);

      component.ngOnInit();

      expect(component.shipToPartySalesOrg).toEqual('0267');
    });

    test('should set salesOrg from modalData if subscription is empty', () => {
      component.modalData = {
        shipToPartySalesOrg: '0269',
        caseCustomer: {
          identifier: { customerId: '123456', salesOrg: '0815' },
        },
      } as any;

      store.overrideSelector(getSalesOrgsOfShipToParty, []);

      component.ngOnInit();

      expect(component.shipToPartySalesOrg).toEqual('0269');
    });

    test('should set isSapCase from modalData', () => {
      component.modalData = {
        shipToPartySalesOrg: '0269',
        isSapCase: true,
        caseCustomer: {
          identifier: { customerId: '123456', salesOrg: '0815' },
        },
      } as any;

      store.overrideSelector(getSalesOrgsOfShipToParty, []);

      component.ngOnInit();

      expect(component.isSapCase).toEqual(true);
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
      component['sectorGpsdFacade'].loadSectorGpsdByCustomerAndSalesOrg =
        jest.fn();
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
        .setValue(moment('2019-01-01T00:00:00.000Z'));
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
      component['sectorGpsdFacade'].resetAllSectorGpsds = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(
        component['sectorGpsdFacade'].resetAllSectorGpsds
      ).toHaveBeenCalled();
    });
  });

  describe('submit dialog', () => {
    beforeEach(() => {
      userHasAccessToOfferType$$.next(true);
    });

    test('should submit caseName and currency and all SAP Data Values', () => {
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
      component.userHasOfferTypeAccess$.subscribe();
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
        offerTypeId: 1,
        shipToParty: undefined,
      });
    });

    test('should trim case name before submitting', () => {
      component['dialogRef'].close = jest.fn();

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
      component.userHasOfferTypeAccess$.subscribe();
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
        offerTypeId: 1,
      });
    });

    test('should update case name with missing dates', () => {
      component['dialogRef'].close = jest.fn();

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
      component.userHasOfferTypeAccess$.subscribe();
      component.submitDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        caseName: 'new whitespace',
        currency: 'USD',
        purchaseOrderTypeId: 1,
        partnerRoleId: '6000036',
        offerTypeId: 1,
      });
    });
    test('should not provide offerType if user has no access', () => {
      component['dialogRef'].close = jest.fn();
      component.userHasOfferTypeAccess$.subscribe();

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

      userHasAccessToOfferType$$.next(false);

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

  describe('validateDateGreaterOrEqualToday', () => {
    beforeEach(() => {
      Object.defineProperty(component, 'today', {
        value: new Date('2019-01-01T00:00:00.000Z'),
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
        moment('2019-01-01T00:00:00.000Z')
      );

      component.caseModalForm.controls.quotationToDate.setValue(
        moment('2019-01-02T00:00:00.000Z')
      );
      component.caseModalForm.controls.quotationToDate.updateValueAndValidity =
        jest.fn();
      component.caseModalForm.controls.quotationToDate.markAsTouched =
        jest.fn();

      component.caseModalForm.controls.bindingPeriodValidityEndDate.setValue(
        moment('2019-01-02T00:00:00.000Z')
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
        .setValue(moment('2019-01-01T00:00:00.000Z'));
    });

    it('Should return undefined as Error', () => {
      const control: FormControl = new FormControl(
        moment('2019-01-02T00:00:00.000Z')
      );
      const result: ValidationErrors | null =
        component.validateDateGreaterOrEqualThanPurchaseOrderDate(control);
      expect(result).toBeUndefined();
    });

    it('Should return an error as Error', () => {
      const control: FormControl = new FormControl(
        moment('2018-01-01T00:00:00.000Z')
      );
      const expectedError: ValidationErrors = { smallerThanPoDate: true };

      const result: ValidationErrors | null =
        component.validateDateGreaterOrEqualThanPurchaseOrderDate(control);
      expect(result).toEqual(expectedError);
    });
    it('Should not return an error when values equal', () => {
      const control: FormControl = new FormControl(
        moment('2019-01-01T00:00:00.000Z')
      );

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
      const date1 = moment('01.01.2019', 'DD.MM.YYYY');
      const date2 = '01.01.2019';
      expect(component['isTheSameDay'](date1, date2)).toEqual(true);
    });

    test('should return false if dates are not the same day', () => {
      const date1 = moment('01.01.2019', 'DD.MM.YYYY');
      const date2 = '02.01.2019';
      expect(component['isTheSameDay'](date1, date2)).toEqual(false);
    });

    test('should return false if second date is undefined', () => {
      const date1 = moment('01.01.2019', 'DD.MM.YYYY');

      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(component['isTheSameDay'](date1, undefined)).toEqual(false);
    });

    test('should return true if both dates are undefined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(component['isTheSameDay'](undefined, undefined)).toEqual(true);
    });
  });
  describe('should dispatch reset actions', () => {
    test('should dispatch reset actions', () => {
      store.dispatch = jest.fn();
      component['sectorGpsdFacade'].resetAllSectorGpsds = jest.fn();

      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(
        resetAllAutocompleteOptions()
      );
      expect(store.dispatch).toHaveBeenCalledWith(clearCustomer());
      expect(store.dispatch).toHaveBeenCalledWith(clearShipToParty());
      expect(store.dispatch).toHaveBeenCalledWith(clearCreateCaseRowData());
      expect(
        component['sectorGpsdFacade'].resetAllSectorGpsds
      ).toHaveBeenCalled();
    });
  });
});
