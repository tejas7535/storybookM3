import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { BehaviorSubject, of } from 'rxjs';

import { CreateCaseFacade } from '@gq/core/store/create-case/create-case.facade';
import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { AutoCompleteFacade } from '@gq/core/store/facades/autocomplete.facade';
import { RolesFacade } from '@gq/core/store/facades/roles.facade';
import { CaseFilterItem, SalesOrg } from '@gq/core/store/reducers/models';
import { SectorGpsdFacade } from '@gq/core/store/sector-gpsd/sector-gpsd.facade';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
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

  const createComponent = createComponentFactory({
    component: CreateCaseHeaderInformationComponent,
    imports: [
      MockComponent(PurchaseOrderTypeSelectComponent),
      MockComponent(SectorGpsdSelectComponent),
      MockComponent(OfferTypeSelectComponent),
      MockComponent(SelectSalesOrgComponent),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      MockProvider(CreateCaseFacade, {
        shipToPartySalesOrgs$: of([]),
        customerSalesOrgs$: customerSalesOrgSubject$$.asObservable(),
        resetCaseCreationInformation: jest.fn(),
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
    'should provide shipToParty$',
    marbles((m) => {
      m.expect(component.shipToParty$).toBeObservable(
        m.cold('(a|)', { a: {} as CaseFilterItem })
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
      ).toBeUndefined();
      expect(
        component.headerInfoForm.get('requestedDeliveryDate')?.value
      ).toBeUndefined();
      expect(
        component.headerInfoForm.get('customerPurchaseOrderDate')?.value
      ).toBeUndefined();
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
  });

  describe('ngOnDestroy', () => {
    test('should call reset method', () => {
      component.reset = jest.fn();
      component.ngOnDestroy();
      expect(component.reset).toHaveBeenCalled();
    });
  });
});
