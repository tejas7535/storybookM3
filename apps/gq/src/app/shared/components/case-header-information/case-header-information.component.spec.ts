import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { BehaviorSubject, Observable, of } from 'rxjs';

import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades/autocomplete.facade';
import { RolesFacade } from '@gq/core/store/facades/roles.facade';
import { CaseFilterItem, SalesOrg } from '@gq/core/store/reducers/models';
import { SectorGpsdFacade } from '@gq/core/store/sector-gpsd/sector-gpsd.facade';
import { IdValue } from '@gq/shared/models/search/id-value.model';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import moment from 'moment';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../testing/mocks';
import { FilterNames } from '../autocomplete-input/filter-names.enum';
import { CaseHeaderInformationComponent } from './case-header-information.component';

@Component({
  selector: 'gq-test-case-header-information',
})
class TestCaseHeaderInformationComponent
  extends CaseHeaderInformationComponent
  implements OnInit
{
  shipToPartySalesOrgs$: Observable<SalesOrg[]> = of([]);
  shipToParty$: Observable<CaseFilterItem>;
  submitDialog(): void {
    throw new Error('Method not implemented.');
  }
  closeDialog(): void {
    throw new Error('Method not implemented.');
  }
  reset(): void {}
  isEditMode = false;

  ngOnInit(): void {
    this.headerInfoForm = new FormGroup({
      customer: new FormControl({ value: undefined, disabled: false }),
      salesOrg: new FormControl({ value: undefined, disabled: false }),
      caseName: new FormControl({ value: undefined, disabled: false }, [
        Validators.pattern('\\s*\\S.*'),
        Validators.maxLength(this.NAME_MAX_LENGTH),
      ]),
      comment: new FormControl({ value: undefined, disabled: false }, [
        Validators.pattern('\\s*\\S.*'),
        Validators.maxLength(this.COMMENT_INPUT_MAX_LENGTH),
      ]),
      currency: new FormControl(
        {
          value: undefined,
          disabled: false,
        },
        [Validators.required]
      ),
      shipToParty: new FormControl(
        {
          value: undefined,
          disabled: false,
        },
        []
      ),
      quotationToDate: new FormControl({
        value: undefined,
        disabled: false,
      }),
      requestedDeliveryDate: new FormControl({
        value: undefined,
        disabled: false,
      }),
      customerPurchaseOrderDate: new FormControl({
        value: undefined,
        disabled: false,
      }),
      bindingPeriodValidityEndDate: new FormControl({
        value: undefined,
        disabled: false,
      }),
      purchaseOrderType: new FormControl({
        value: undefined,
        disabled: false,
      }),
      partnerRoleType: new FormControl({
        value: undefined,
        disabled: false,
      }),
      offerType: new FormControl({
        value: undefined,
        disabled: false,
      }),
    });

    super.ngOnInit();
  }
}

describe('CaseHeaderInformationComponent', () => {
  let spectator: Spectator<TestCaseHeaderInformationComponent>;
  let component: TestCaseHeaderInformationComponent;

  const userHasAccessToOfferType$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  const createComponent = createComponentFactory({
    component: TestCaseHeaderInformationComponent,
    imports: [LetDirective],
    providers: [
      provideMockStore({
        initialState: {
          currency: {
            availableCurrencies: ['EUR', 'USD'],
          },
          case: CREATE_CASE_STORE_STATE_MOCK,
        },
      }),
      MockProvider(TranslocoLocaleService),
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
      },
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
          offerType: { id: 1, name: 'offer type name' },
          caseCustomer: {
            identifier: { customerId: '123456', salesOrg: '0815' },
          },
          enableSapFieldEditing: true,
        },
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
        provide: RolesFacade,
        useValue: {
          userHasRegionWorldOrGreaterChinaRole$:
            userHasAccessToOfferType$$.asObservable(),
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
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should set userHasOfferTypeAccess$', () => {
    test(
      'should set userHasOfferTypeAccess$ to true',
      marbles((m) => {
        component.ngOnInit();
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
    test('should call methods', () => {
      component.subscribeToChanges = jest.fn();
      component.ngOnInit();
      expect(component.subscribeToChanges).toHaveBeenCalled();
    });
  });

  describe('subscribeToChanges', () => {
    test('should set hasCaseModalForm to true for caseName', () => {
      expect(component.hasHeaderInfoFormChange).toBeFalsy();
      component.headerInfoForm.get('caseName').setValue('testCase');
      expect(component.hasHeaderInfoFormChange).toBeTruthy();
    });

    test('Should set hasCaseModalForm to true for customerPurchaseOrderDate', () => {
      expect(component.hasHeaderInfoFormChange).toBeFalsy();
      component['validatePurchaseOrderDateDependentDates'] = jest.fn();
      component.headerInfoForm
        .get('customerPurchaseOrderDate')
        .setValue(moment('2019-01-01T00:00:00.000Z'));
      expect(component.hasHeaderInfoFormChange).toBeTruthy();
      expect(
        component['validatePurchaseOrderDateDependentDates']
      ).toHaveBeenCalled();
    });
    test('should handle autocomplete resetAutocompleteMaterials', () => {
      Object.defineProperty(component, 'autocomplete', {
        value: {
          autocomplete: jest.fn(),
          resetAutocompleteMaterials: jest.fn(),
        },
      });

      component.headerInfoForm.get('shipToParty').setValue('s');
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

      component.headerInfoForm.get('shipToParty').setValue('');
      expect(
        component.autocomplete.resetAutocompleteMaterials
      ).toHaveBeenCalled();
    });
  });

  describe('onPaste', () => {
    it('should set isInvalidInput to true if pasted text length is greater than COMMENT_INPUT_MAX_LENGTH', () => {
      const event = {
        clipboardData: {
          getData: jest
            .fn()
            .mockReturnValue(
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            ),
        },
      } as unknown as ClipboardEvent;

      component.onPaste(event);

      expect(component.isInvalidInput).toBe(true);
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
      component.headerInfoForm.controls.customerPurchaseOrderDate.setValue(
        moment('2019-01-01T00:00:00.000Z')
      );

      component.headerInfoForm.controls.quotationToDate.setValue(
        moment('2019-01-02T00:00:00.000Z')
      );
      component.headerInfoForm.controls.quotationToDate.updateValueAndValidity =
        jest.fn();
      component.headerInfoForm.controls.quotationToDate.markAsTouched =
        jest.fn();

      component.headerInfoForm.controls.bindingPeriodValidityEndDate.setValue(
        moment('2019-01-02T00:00:00.000Z')
      );
      component.headerInfoForm.controls.bindingPeriodValidityEndDate.updateValueAndValidity =
        jest.fn();
      component.headerInfoForm.controls.bindingPeriodValidityEndDate.markAsTouched =
        jest.fn();

      component['validatePurchaseOrderDateDependentDates']();

      expect(
        component.headerInfoForm.controls.quotationToDate.updateValueAndValidity
      ).toHaveBeenCalled();
      expect(
        component.headerInfoForm.controls.quotationToDate.markAsTouched
      ).toHaveBeenCalled();
      expect(
        component.headerInfoForm.controls.bindingPeriodValidityEndDate
          .updateValueAndValidity
      ).toHaveBeenCalled();
      expect(
        component.headerInfoForm.controls.bindingPeriodValidityEndDate
          .markAsTouched
      ).toHaveBeenCalled();
    });
  });

  describe('validateDateGreaterOrEqualThanPurchaseOrderDate', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.headerInfoForm
        .get('customerPurchaseOrderDate')
        .setValue(moment('2019-01-01T00:00:00.000Z'));
    });

    it('Should return undefined as Error', () => {
      const control: FormControl = new FormControl(
        moment('2019-01-02T00:00:00.000Z')
      );
      const result: ValidationErrors | null =
        component['validateDateGreaterOrEqualThanPurchaseOrderDate'](control);
      expect(result).toBeUndefined();
    });

    it('Should return an error as Error', () => {
      const control: FormControl = new FormControl(
        moment('2018-01-01T00:00:00.000Z')
      );
      const expectedError: ValidationErrors = { smallerThanPoDate: true };

      const result: ValidationErrors | null =
        component['validateDateGreaterOrEqualThanPurchaseOrderDate'](control);
      expect(result).toEqual(expectedError);
    });
    it('Should not return an error when values equal', () => {
      const control: FormControl = new FormControl(
        moment('2019-01-01T00:00:00.000Z')
      );

      const result: ValidationErrors | null =
        component['validateDateGreaterOrEqualThanPurchaseOrderDate'](control);
      expect(result).toBeUndefined();
    });
    it('should return undefined if control has no value', () => {
      const control: FormControl = new FormControl(undefined);
      const result: ValidationErrors | null =
        component['validateDateGreaterOrEqualThanPurchaseOrderDate'](control);
      expect(result).toBeUndefined();
    });
  });

  describe('isTheSameDay', () => {
    test('should return true if dates are the same day', () => {
      const date1 = moment('2019-01-01T00:00:00');
      const date2 = '2019-01-01T00:00:00';
      expect(component['isTheSameDay'](date1, date2)).toEqual(true);
    });

    test('should return false if dates are not the same day', () => {
      const date1 = moment('2019-01-01T00:00:00');
      const date2 = '2019-01-02T00:00:00';
      expect(component['isTheSameDay'](date1, date2)).toEqual(false);
    });

    test('should return false if second date is undefined', () => {
      const date1 = moment('2019-01-01T00:00:00');

      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(component['isTheSameDay'](date1, undefined)).toEqual(false);
    });

    test('should return true if both dates are undefined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(component['isTheSameDay'](undefined, undefined)).toEqual(true);
    });
  });

  describe('formatAutocompleteResult', () => {
    it('should format the autocomplete result correctly', () => {
      const value: IdValue = {
        id: '123',
        value: 'Test Value',
        value2: 'Test Value 2',
        selected: false,
      };

      const formattedResult = component['formatAutocompleteResult'](value);

      expect(formattedResult).toBe('123 | Test Value | Test Value 2');
    });

    it('should return an empty string if the value is undefined', () => {
      const value: IdValue = undefined;

      const formattedResult = component['formatAutocompleteResult'](value);

      expect(formattedResult).toBe('');
    });

    it('should return an empty string if the value id or value is missing', () => {
      const value: IdValue = {
        id: undefined,
        value: 'Test Value',
        value2: 'Test Value 2',
        selected: false,
      };

      const formattedResult = component['formatAutocompleteResult'](value);

      expect(formattedResult).toBe('');
    });
  });
});
