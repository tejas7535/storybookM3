import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { BehaviorSubject, of } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades/autocomplete.facade';
import { RolesFacade } from '@gq/core/store/facades/roles.facade';
import { QuotationToDate } from '@gq/core/store/quotation-to-date/quotation-to-date.model';
import { CaseFilterItem, SalesOrg } from '@gq/core/store/reducers/models';
import { SectorGpsdFacade } from '@gq/core/store/sector-gpsd/sector-gpsd.facade';
import { ShipToPartyFacade } from '@gq/core/store/ship-to-party/ship-to-party.facade';
import { AutocompleteSelectionComponent } from '@gq/shared/components/autocomplete-selection/autocomplete-selection.component';
import { CustomerId } from '@gq/shared/models';
import { MaterialTableItem } from '@gq/shared/models/table';
import { getMomentUtcStartOfDayDate } from '@gq/shared/utils/misc.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { MockComponent, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AutocompleteRequestDialog } from '../../autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '../../autocomplete-input/filter-names.enum';
import { OfferTypeSelectComponent } from '../../offer-type-select/offer-type-select.component';
import { PurchaseOrderTypeSelectComponent } from '../../purchase-order-type-select/purchase-order-type-select.component';
import { SectorGpsdSelectComponent } from '../../sector-gpsd-select/sector-gpsd-select.component';
import { SelectSalesOrgComponent } from '../../select-sales-org/select-sales-org.component';
import { HeaderInformationData } from '../models/header-information-data.interface';
import { CreateCaseHeaderInformationComponent } from './create-case-header-information.component';

describe('CreateCaseHeaderInformationComponent', () => {
  let component: CreateCaseHeaderInformationComponent;
  let spectator: Spectator<CreateCaseHeaderInformationComponent>;
  const customerSalesOrgSubject$$: BehaviorSubject<SalesOrg[]> =
    new BehaviorSubject<SalesOrg[]>([]);
  const selectedSalesOrgSubject$$: BehaviorSubject<SalesOrg> =
    new BehaviorSubject<SalesOrg>({} as SalesOrg);
  const selectedCustomerSubject$$: BehaviorSubject<CustomerId> =
    new BehaviorSubject<CustomerId>({} as CustomerId);
  const quotationToDateSubject$$: BehaviorSubject<QuotationToDate> =
    new BehaviorSubject<QuotationToDate>(null);
  const newCaseRowDataSubject$$: BehaviorSubject<MaterialTableItem[]> =
    new BehaviorSubject<MaterialTableItem[]>([]);

  const createComponent = createComponentFactory({
    component: CreateCaseHeaderInformationComponent,
    imports: [
      MockComponent(PurchaseOrderTypeSelectComponent),
      MockComponent(SectorGpsdSelectComponent),
      MockComponent(OfferTypeSelectComponent),
      MockComponent(SelectSalesOrgComponent),
      MockComponent(AutocompleteSelectionComponent),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      MockProvider(CreateCaseFacade, {
        shipToPartySalesOrgs$: of([]),
        customerSalesOrgs$: customerSalesOrgSubject$$.asObservable(),
        selectedCustomerSalesOrg$: selectedSalesOrgSubject$$.asObservable(),
        customerIdentifier$: selectedCustomerSubject$$.asObservable(),
        resetCaseCreationInformation: jest.fn(),
        updateCurrencyOfPositionItems: jest.fn(),
        getQuotationToDate: jest.fn().mockReturnValue(
          of({
            extendedDate: '2014-01-01',
            extendedDateForManyItems: '2014-01-01',
            manyItemsDateThreshold: 20,
          })
        ),
        quotationToDate$: quotationToDateSubject$$.asObservable(),
        newCaseRowData$: newCaseRowDataSubject$$.asObservable(),
      }),
      MockProvider(TranslocoLocaleService),
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
          shipToCustomerForCaseCreation$: of({} as CaseFilterItem),
        },
      },
      MockProvider(CurrencyFacade),
      MockProvider(RolesFacade, {
        userHasRegionWorldOrGreaterChinaRole$: of(),
      }),
      MockProvider(SectorGpsdFacade),
      MockProvider(ShipToPartyFacade),
      MockProvider(Store, {
        select: jest.fn().mockReturnValue(of({})),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test(
    'should provide shipToPartySalesOrgs$',
    marbles((m) => {
      m.expect(component.shipToPartySalesOrgs$).toBeObservable(
        m.cold('(a|)', { a: [] })
      );
    })
  );

  test(
    'should provide selectedCustomerSalesOrg$',
    marbles((m) => {
      const salesOrg: SalesOrg = {
        id: '0615',
        selected: true,
        currency: 'EUR',
      };
      selectedSalesOrgSubject$$.next(salesOrg);
      m.expect(component.selectedCustomerSalesOrg$).toBeObservable(
        m.cold('a', { a: salesOrg })
      );
    })
  );

  test(
    'should provide selectedCustomerIdentifier$',
    marbles((m) => {
      const customerId: CustomerId = {
        customerId: '12345',
        salesOrg: '0615',
      };
      selectedCustomerSubject$$.next(customerId);
      m.expect(component.selectedCustomerIdentifier$).toBeObservable(
        m.cold('a', { a: customerId })
      );
    })
  );

  describe('reset', () => {
    test('should call resetCaseCreationInformation', () => {
      component['createCaseFacade'].resetCaseCreationInformation = jest.fn();
      component.reset();
      expect(
        component['createCaseFacade'].resetCaseCreationInformation
      ).toHaveBeenCalled();
    });
  });
  describe('ngOnInit', () => {
    test('should init all form controls with value undefined', () => {
      selectedSalesOrgSubject$$.next(null);
      selectedCustomerSubject$$.next(null);
      component['modifyInputs'] = jest.fn();
      component.ngOnInit();
      expect(component.headerInfoForm.get('customer')?.value).toBeUndefined();
      expect(component.headerInfoForm.get('salesOrg')?.value).toBeUndefined();
      expect(component.headerInfoForm.get('caseName')?.value).toBeUndefined();
      expect(component.headerInfoForm.get('currency')?.value).toBeUndefined();
      expect(
        component.headerInfoForm.get('shipToParty')?.value
      ).toBeUndefined();
      expect(
        component.headerInfoForm.get('quotationToDate')?.value
      ).toBeFalsy();
      expect(
        component.headerInfoForm.get('requestedDeliveryDate')?.value
      ).toBeUndefined();
      expect(component.headerInfoForm.get('customerInquiryDate')?.value).toBe(
        component.today
      );
      expect(
        component.headerInfoForm.get('bindingPeriodValidityEndDate')?.value
      ).toBeUndefined();
    });
    test('should init autocompleteFacade', () => {
      component['autocomplete'].initFacade = jest.fn();
      component['autocomplete'].resetView = jest.fn();
      component.ngOnInit();
      expect(component['autocomplete'].initFacade).toHaveBeenCalledWith(
        AutocompleteRequestDialog.CREATE_CASE
      );
      expect(component['autocomplete'].resetView).toHaveBeenCalled();
    });

    test('should reset partnerRole when customerSalesOgs emits values', () => {
      component.headerInfoForm.get('partnerRoleType')?.setValue('test');
      spectator.detectChanges();
      customerSalesOrgSubject$$.next([{ id: '0615' } as SalesOrg]);
      expect(
        component.headerInfoForm.get('partnerRoleType')?.value
      ).toBeUndefined();
    });
    test('should init currency with selectedSalesOrg Currency', () => {
      component.headerInfoForm.get('currency')?.setValue('EUR');
      spectator.detectChanges();
      selectedSalesOrgSubject$$.next({
        id: '0615',
        currency: 'USD',
      } as SalesOrg);
      expect(component.headerInfoForm.get('currency').value).toBe('USD');
    });

    test('should call update currency of position items', () => {
      spectator.detectChanges();
      selectedSalesOrgSubject$$.next({
        id: '0615',
        currency: 'USD',
      } as SalesOrg);

      expect(
        component['createCaseFacade'].updateCurrencyOfPositionItems
      ).toHaveBeenCalled();
    });
    test('should emit the values of the form', () => {
      component.hasChanges.emit = jest.fn();
      component.isValid.emit = jest.fn();
      component.data.emit = jest.fn();

      const formChangedSubject$$: BehaviorSubject<HeaderInformationData> =
        new BehaviorSubject<HeaderInformationData>({} as HeaderInformationData);
      component.headerInfoFormChanged$ = formChangedSubject$$.asObservable();
      component.ngOnInit();
      formChangedSubject$$.next({} as HeaderInformationData);

      expect(component.hasChanges.emit).toHaveBeenCalled();
      expect(component.isValid.emit).toHaveBeenCalled();
      expect(component.data.emit).toHaveBeenCalled();
    });
    test('should modify inputs and disable initially', () => {
      component['modifyInputs'] = jest.fn();
      component.ngOnInit();
      expect(component['modifyInputs']).toHaveBeenCalledWith(
        'disable',
        expect.anything()
      );
    });
    test('should modifyInputs and enable inputs when customer has been selected', () => {
      component['modifyInputs'] = jest.fn();
      selectedCustomerSubject$$.next({ customerId: '12345', salesOrg: '0615' });
      expect(component['modifyInputs']).toHaveBeenCalled();
      expect(component['modifyInputs']).toHaveBeenCalledWith(
        'enable',
        expect.anything()
      );
    });
    test('should modifyInputs and disable inputs when customer has been deselected', () => {
      component['modifyInputs'] = jest.fn();
      selectedCustomerSubject$$.next(null);
      expect(component['modifyInputs']).toHaveBeenCalled();
      expect(component['modifyInputs']).toHaveBeenCalledWith(
        'disable',
        expect.anything()
      );
      expect(component['modifyInputs']).toHaveBeenCalledWith(
        'reset',
        expect.anything()
      );
    });
  });

  describe('ngOnDestroy', () => {
    test('should call reset method', () => {
      component.reset = jest.fn();
      component.ngOnDestroy();
      expect(component.reset).toHaveBeenCalled();
    });
  });

  describe('modifyInputs', () => {
    test('should enable FormControl', () => {
      component['modifyInputs']('enable', ['caseName']);
      expect(component.headerInfoForm.get('caseName')?.enabled).toBeTruthy();
    });
    test('should disable FormControl', () => {
      component['modifyInputs']('disable', ['caseName']);
      expect(component.headerInfoForm.get('caseName')?.disabled).toBeTruthy();
    });

    test('should reset FormControl', () => {
      component.headerInfoForm.get('caseName').reset = jest.fn();
      component['modifyInputs']('reset', ['caseName']);
      expect(component.headerInfoForm.get('caseName').reset).toHaveBeenCalled();
    });
  });

  describe('quotationToDate form field', () => {
    test('should set quotationToDate when quotationToDate$ emits', () => {
      quotationToDateSubject$$.next({
        extendedDate: '2014-01-01',
        extendedDateForManyItems: '2014-01-01',
        manyItemsDateThreshold: 20,
      });
      component.ngOnInit();
      expect(component.headerInfoForm.get('quotationToDate')?.value).toEqual(
        getMomentUtcStartOfDayDate('2014-01-01')
      );
    });
    test('should set quotationToDate when number of rows has changed', () => {
      quotationToDateSubject$$.next({
        extendedDate: '2014-01-01',
        extendedDateForManyItems: '2014-01-02',
        manyItemsDateThreshold: 2,
      });
      newCaseRowDataSubject$$.next([
        {} as MaterialTableItem,
        {} as MaterialTableItem,
      ]);
      component.ngOnInit();
      expect(component.headerInfoForm.get('quotationToDate')?.value).toEqual(
        getMomentUtcStartOfDayDate('2014-01-02')
      );
    });
    test('should set expectedDate when manyItemsDateThreshold is not defined', () => {
      quotationToDateSubject$$.next({
        extendedDate: '2014-01-01',
        extendedDateForManyItems: '2014-01-02',
        manyItemsDateThreshold: undefined,
      });
      newCaseRowDataSubject$$.next([
        {} as MaterialTableItem,
        {} as MaterialTableItem,
      ]);
      component.ngOnInit();
      expect(component.headerInfoForm.get('quotationToDate')?.value).toEqual(
        getMomentUtcStartOfDayDate('2014-01-01')
      );
    });
    test('should not set quotationToDate when quotationToChangedByUser is true', () => {
      quotationToDateSubject$$.next({
        extendedDate: '2014-01-01',
        extendedDateForManyItems: '2014-01-02',
        manyItemsDateThreshold: 2,
      });
      newCaseRowDataSubject$$.next([
        {} as MaterialTableItem,
        {} as MaterialTableItem,
      ]);
      component.quotationToChangedByUser = true;
      const control = component.headerInfoForm.get('quotationToDate');
      const spy = jest.spyOn(control, 'setValue');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
