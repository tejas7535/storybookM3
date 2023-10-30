import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { of } from 'rxjs';

import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades';
import { getSalesOrgs } from '@gq/core/store/selectors';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../../testing/mocks';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';
import { DialogHeaderComponent } from '../../header/dialog-header/dialog-header.component';
import { EditCaseModalComponent } from './edit-case-modal.component';
describe('EditCaseModalComponent', () => {
  let component: EditCaseModalComponent;
  let spectator: Spectator<EditCaseModalComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: EditCaseModalComponent,
    imports: [
      MatFormFieldModule,
      MatSelectModule,
      MatInputModule,
      FormsModule,
      ReactiveFormsModule,
      PushModule,
      MatAutocompleteModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [
      EditCaseModalComponent,
      MockComponent(DialogHeaderComponent),
    ],
    providers: [
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
    ],
    detectChanges: false,
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should create FormGroup and fill in caseName and currency', () => {
      expect(component.caseModalForm).toBeFalsy();

      spectator.detectChanges();

      expect(component.caseModalForm.controls.caseName.value).toBe('case-name');
      expect(component.caseModalForm.controls.currency.value).toBe('EUR');
      expect(
        component.caseModalForm.controls.quotationToDate.value
      ).toStrictEqual(new Date('2022-12-31T00:00:00.000Z'));
      expect(
        component.caseModalForm.controls.requestedDeliveryDate.value
      ).toStrictEqual(new Date('2022-12-31T00:00:00.000Z'));
      expect(
        component.caseModalForm.controls.customerPurchaseOrderDate.value
      ).toStrictEqual(new Date('2022-12-31T00:00:00.000Z'));
      expect(
        component.caseModalForm.controls.bindingPeriodValidityEndDate.value
      ).toStrictEqual(new Date('2022-12-31T00:00:00.000Z'));
    });

    test('should set salesOrg from array', () => {
      expect(component.salesOrg).toBeUndefined();

      store.overrideSelector(getSalesOrgs, [
        { id: '0267', selected: false },
        { id: '0268', selected: false },
      ]);
      spectator.detectChanges();

      expect(component.salesOrg).toEqual('0267');
    });

    test('should set salesOrg from modalData if subscription is empty', () => {
      component.modalData = {
        salesOrg: '0269',
      } as any;

      store.overrideSelector(getSalesOrgs, []);
      spectator.detectChanges();

      expect(component.salesOrg).toEqual('0269');
    });
  });

  describe('close dialog', () => {
    test('should close dialog', () => {
      component['dialogRef'].close = jest.fn();

      component.closeDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
    });
  });

  describe('submit dialog', () => {
    test('sould submit caseName and currency and all SAP Data Values', () => {
      component['dialogRef'].close = jest.fn();

      spectator.detectChanges();

      component.caseModalForm.controls.caseName.setValue('new-case-name');
      component.caseModalForm.controls.currency.setValue('USD');
      component.caseModalForm.controls.quotationToDate.setValue(
        '2022-12-31T00:00:00.000Z'
      );
      component.caseModalForm.controls.customerPurchaseOrderDate.setValue(
        '2022-12-31T00:00:00.000Z'
      );
      component.caseModalForm.controls.requestedDeliveryDate.setValue(
        '2022-12-31T00:00:00.000Z'
      );
      component.caseModalForm.controls.bindingPeriodValidityEndDate.setValue(
        '2022-12-31T00:00:00.000Z'
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
      });
    });

    test('should trim case name before submitting', () => {
      component['dialogRef'].close = jest.fn();

      spectator.detectChanges();

      component.caseModalForm.controls.caseName.setValue('   new whitespace ');
      component.caseModalForm.controls.currency.setValue('USD');
      component.caseModalForm.controls.quotationToDate.setValue(
        '2022-12-31T00:00:00.000Z'
      );
      component.caseModalForm.controls.customerPurchaseOrderDate.setValue(
        '2022-12-31T00:00:00.000Z'
      );
      component.caseModalForm.controls.requestedDeliveryDate.setValue(
        '2022-12-31T00:00:00.000Z'
      );
      component.caseModalForm.controls.bindingPeriodValidityEndDate.setValue(
        '2022-12-31T00:00:00.000Z'
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

  describe('checkValueGreaterOrEqualToday', () => {
    beforeEach(() => {
      component['today'] = new Date('01.01.2019');
    });

    it('Should return undefined as Error', () => {
      const result = component.checkValueGreaterOrEqualToday(
        new Date('02.01.2019')
      );
      expect(result).toBeUndefined();
    });

    it('Should return an error as Error', () => {
      const result = component.checkValueGreaterOrEqualToday(
        new Date('01.01.2018')
      );
      expect(result).toEqual(true);
    });
    it('should return undefined if control has no value', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = component.checkValueGreaterOrEqualToday(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('validateDateGreaterOrEqualThanPurchaseOrderDate', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.caseModalForm
        .get('customerPurchaseOrderDate')
        .setValue(new Date('01.01.2019'));
    });

    it('Should return undefined as Error', () => {
      const control: FormControl = new FormControl(new Date('02.01.2019'));
      const result: ValidationErrors | null =
        component.validateDateGreaterOrEqualThanPurchaseOrderDate(control);
      expect(result).toBeUndefined();
    });

    it('Should return an error as Error', () => {
      const control: FormControl = new FormControl(new Date('01.01.2018'));
      const expectedError: ValidationErrors = { smallerThanPoDate: true };

      const result: ValidationErrors | null =
        component.validateDateGreaterOrEqualThanPurchaseOrderDate(control);
      expect(result).toEqual(expectedError);
    });
    it('Should return an error as Error when values equal', () => {
      const control: FormControl = new FormControl(new Date('01.01.2019'));
      const expectedError: ValidationErrors = { smallerThanPoDate: true };

      const result: ValidationErrors | null =
        component.validateDateGreaterOrEqualThanPurchaseOrderDate(control);
      expect(result).toEqual(expectedError);
    });
    it('should return undefined if control has no value', () => {
      const control: FormControl = new FormControl(undefined);
      const result: ValidationErrors | null =
        component.validateDateGreaterOrEqualThanPurchaseOrderDate(control);
      expect(result).toBeUndefined();
    });
  });
});
