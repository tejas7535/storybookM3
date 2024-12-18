import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { BehaviorSubject, of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { CurrencyFacade } from '@gq/core/store/currency/currency.facade';
import { AutoCompleteFacade, RolesFacade } from '@gq/core/store/facades';
import { CaseFilterItem, SalesOrg } from '@gq/core/store/reducers/models';
import { SectorGpsdFacade } from '@gq/core/store/sector-gpsd/sector-gpsd.facade';
import { ShipToPartyFacade } from '@gq/core/store/ship-to-party/ship-to-party.facade';
import { AutocompleteSelectionComponent } from '@gq/shared/components/autocomplete-selection/autocomplete-selection.component';
import { Customer, PurchaseOrderType } from '@gq/shared/models';
import { getMomentUtcStartOfDayDate } from '@gq/shared/utils/misc.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { MockComponent, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FilterNames } from '../../autocomplete-input/filter-names.enum';
import { EditCaseModalData } from '../../modal/edit-case-modal/edit-case-modal-data.model';
import { OfferTypeSelectComponent } from '../../offer-type-select/offer-type-select.component';
import { PurchaseOrderTypeSelectComponent } from '../../purchase-order-type-select/purchase-order-type-select.component';
import { SectorGpsdSelectComponent } from '../../sector-gpsd-select/sector-gpsd-select.component';
import { SelectSalesOrgComponent } from '../../select-sales-org/select-sales-org.component';
import { EditCaseHeaderInformationComponent } from './edit-case-header-information.component';

describe('EditCaseHeaderInformationComponent', () => {
  let component: EditCaseHeaderInformationComponent;
  let spectator: Spectator<EditCaseHeaderInformationComponent>;
  const shipToPartySalesOrgSubject$$: BehaviorSubject<SalesOrg[]> =
    new BehaviorSubject<SalesOrg[]>([]);
  const userHasAccessToOfferType$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  const createComponent = createComponentFactory({
    component: EditCaseHeaderInformationComponent,
    imports: [
      MockComponent(PurchaseOrderTypeSelectComponent),
      MockComponent(SectorGpsdSelectComponent),
      MockComponent(OfferTypeSelectComponent),
      MockComponent(SelectSalesOrgComponent),
      MockComponent(AutocompleteSelectionComponent),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      MockProvider(ActiveCaseFacade, {
        shipToPartySalesOrgs$: shipToPartySalesOrgSubject$$.asObservable(),
        resetEditCaseSettings: jest.fn(),
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
          shipToCustomerForEditCase$: of({} as CaseFilterItem),
        },
      },
      MockProvider(CurrencyFacade),
      MockProvider(RolesFacade, {
        userHasRegionWorldOrGreaterChinaRole$:
          userHasAccessToOfferType$$.asObservable(),
      }),
      MockProvider(SectorGpsdFacade),
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
          customerInquiryDate: '2022-12-31T00:00:00.000Z',
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
      MockProvider(ShipToPartyFacade, {
        loadShipToPartyByCustomerAndSalesOrg: jest.fn(),
      }),
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
    'provide shipToPartySalesOrgs$',
    marbles((m) => {
      m.expect(component.shipToPartySalesOrgs$).toBeObservable(
        m.cold('a', { a: [] })
      );
    })
  );

  describe('reset', () => {
    it('should call activeCaseFacade.resetEditCaseSettings', () => {
      component['activeCaseFacade'].resetEditCaseSettings = jest.fn();
      component.reset();
      expect(
        component['activeCaseFacade'].resetEditCaseSettings
      ).toHaveBeenCalled();
    });
  });
  describe('ngOnInit', () => {
    beforeEach(() => {
      component.modalData = {
        caseName: 'case-name',
        currency: 'EUR',
        quotationToDate: '2022-12-31T00:00:00.000Z',
        requestedDeliveryDate: '2022-12-31T00:00:00.000Z',
        customerInquiryDate: '2022-12-31T00:00:00.000Z',
        bindingPeriodValidityEndDate: '2022-12-31T00:00:00.000Z',
        purchaseOrderType: { id: '1', name: 'ZOR' } as PurchaseOrderType,
        partnerRoleType: { id: '6000036', name: 'MRO Mining' },
        offerType: { id: 1, name: 'offer type name' },
        caseCustomer: {
          identifier: { customerId: '123456', salesOrg: '0815' },
        } as unknown as Customer,
        enableSapFieldEditing: true,
      };
    });
    test('should create FormGroup and fill in caseName and currency', () => {
      component.ngOnInit();
      expect(component.headerInfoForm.controls.caseName.value).toBe(
        'case-name'
      );
      expect(component.headerInfoForm.controls.currency.value).toBe('EUR');
      expect(
        component.headerInfoForm.controls.quotationToDate.value
      ).toStrictEqual(getMomentUtcStartOfDayDate('2022-12-31T00:00:00.000Z'));
      expect(
        component.headerInfoForm.controls.requestedDeliveryDate.value
      ).toStrictEqual(getMomentUtcStartOfDayDate('2022-12-31T00:00:00.000Z'));
      expect(
        component.headerInfoForm.controls.customerInquiryDate.value
      ).toStrictEqual(getMomentUtcStartOfDayDate('2022-12-31T00:00:00.000Z'));
      expect(
        component.headerInfoForm.controls.bindingPeriodValidityEndDate.value
      ).toStrictEqual(getMomentUtcStartOfDayDate('2022-12-31T00:00:00.000Z'));
    });

    test('should set salesOrg from modalData if subscription is empty', () => {
      component.modalData = {
        shipToPartySalesOrg: '0269',
        caseCustomer: {
          identifier: { customerId: '123456', salesOrg: '0815' },
        },
      } as any;
      component.ngOnInit();

      shipToPartySalesOrgSubject$$.next([]);

      expect(component.shipToPartySalesOrg).toEqual('0269');
    });

    test('should set salesOrg from array', () => {
      component.ngOnInit();
      shipToPartySalesOrgSubject$$.next([
        { id: '0267', selected: false },
        { id: '0268', selected: false },
      ]);
      expect(component.shipToPartySalesOrg).toEqual('0267');
    });

    test('should set isSapCase from modalData', () => {
      component.modalData = {
        salesOrg: '0269',
        isSapCase: true,
        caseCustomer: {
          identifier: { customerId: '123456', salesOrg: '0815' },
        },
      } as any;

      component['activeCaseFacade'].shipToPartySalesOrgs$ = of([]);

      component.ngOnInit();

      expect(component.isSapCase).toEqual(true);
    });

    test('should set purchaseOrderType from Modal data', () => {
      component.ngOnInit();
      expect(component.headerInfoForm.controls.purchaseOrderType.value).toEqual(
        {
          id: '1',
          name: 'ZOR',
        }
      );
    });
    test('should set partnerRoleType from Modal data', () => {
      component.ngOnInit();
      expect(component.headerInfoForm.controls.partnerRoleType.value).toEqual({
        id: '6000036',
        name: 'MRO Mining',
      });
    });
    test('should request sectorGpsd data', () => {
      component['shipToPartyFacade'].loadShipToPartyByCustomerAndSalesOrg =
        jest.fn();
      component.ngOnInit();
      expect(
        component['shipToPartyFacade'].loadShipToPartyByCustomerAndSalesOrg
      ).toHaveBeenCalled();
    });
  });
  describe('closeDialog', () => {
    it('should call dialogRef.close and facade', () => {
      component['dialogRef'] = {
        close: jest.fn(),
      } as unknown as MatDialogRef<any>;
      component.reset = jest.fn();
      component.closeDialog();
      expect(component['dialogRef'].close).toHaveBeenCalled();
      expect(component.reset).toHaveBeenCalled();
    });
  });

  describe('submit dialog', () => {
    const matDialogRefMock = {
      beforeClosed: jest.fn().mockReturnValue(of([])),
    } as unknown as MatDialogRef<any>;

    const dialogData = {
      caseName: 'case-name',
      currency: 'EUR',
      quotationToDate: '2022-12-31T00:00:00.000Z',
      requestedDeliveryDate: '2022-12-31T00:00:00.000Z',
      customerInquiryDate: '2022-12-31T00:00:00.000Z',
      bindingPeriodValidityEndDate: '2022-12-31T00:00:00.000Z',
      purchaseOrderType: { id: 1, name: 'ZOR' },
      partnerRoleType: { id: '6000036', name: 'MRO Mining' },
      offerType: { id: 1, name: 'offer type name' },
      caseCustomer: {
        identifier: { customerId: '123456', salesOrg: '0815' },
      } as Customer,
      enableSapFieldEditing: true,
    } as unknown as EditCaseModalData;
    beforeEach(() => {
      userHasAccessToOfferType$$.next(true);
      component.dialogRef = matDialogRefMock;
      component.modalData = dialogData;
      component.userHasOfferTypeAccess$.subscribe();
    });
    test('sould submit caseName and currency and all SAP Data Values', () => {
      component['dialogRef'].close = jest.fn();
      component.ngOnInit();

      spectator.detectChanges();

      component.headerInfoForm.controls.caseName.setValue('new-case-name');
      component.headerInfoForm.controls.currency.setValue('USD');
      component.headerInfoForm.controls.quotationToDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );
      component.headerInfoForm.controls.customerInquiryDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );
      component.headerInfoForm.controls.requestedDeliveryDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );
      component.headerInfoForm.controls.bindingPeriodValidityEndDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );

      component.submitDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        caseName: 'new-case-name',
        currency: 'USD',
        quotationToDate: '2022-12-31T00:00:00.000Z',
        requestedDelDate: '2022-12-31T00:00:00.000Z',
        customerInquiryDate: '2022-12-31T00:00:00.000Z',
        validTo: '2022-12-31T00:00:00.000Z',
        purchaseOrderTypeId: 1,
        partnerRoleId: '6000036',
        offerTypeId: 1,
      });
    });

    test('should trim case name before submitting', () => {
      component['dialogRef'].close = jest.fn();
      component.ngOnInit();
      spectator.detectChanges();

      component.headerInfoForm.controls.caseName.setValue('   new whitespace ');
      component.headerInfoForm.controls.currency.setValue('USD');
      component.headerInfoForm.controls.quotationToDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );
      component.headerInfoForm.controls.customerInquiryDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );
      component.headerInfoForm.controls.requestedDeliveryDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );
      component.headerInfoForm.controls.bindingPeriodValidityEndDate.setValue(
        moment('2022-12-31T00:00:00.000Z')
      );

      component.submitDialog();

      expect(component['dialogRef'].close).toHaveBeenCalledTimes(1);
      expect(component['dialogRef'].close).toHaveBeenCalledWith({
        caseName: 'new whitespace',
        currency: 'USD',
        quotationToDate: '2022-12-31T00:00:00.000Z',
        requestedDelDate: '2022-12-31T00:00:00.000Z',
        customerInquiryDate: '2022-12-31T00:00:00.000Z',
        validTo: '2022-12-31T00:00:00.000Z',
        purchaseOrderTypeId: 1,
        partnerRoleId: '6000036',
        offerTypeId: 1,
      });
    });

    test('should update case name with missing dates', () => {
      component['dialogRef'].close = jest.fn();
      component.ngOnInit();
      spectator.detectChanges();

      component.headerInfoForm.controls.caseName.setValue('   new whitespace ');
      component.headerInfoForm.controls.currency.setValue('USD');
      component.headerInfoForm.controls.quotationToDate.setValue(
        undefined as any
      );
      component.headerInfoForm.controls.customerInquiryDate.setValue(
        undefined as any
      );
      component.headerInfoForm.controls.requestedDeliveryDate.setValue(
        undefined as any
      );
      component.headerInfoForm.controls.bindingPeriodValidityEndDate.setValue(
        undefined as any
      );

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
      component.ngOnInit();
      spectator.detectChanges();

      component.headerInfoForm.controls.caseName.setValue('   new whitespace ');
      component.headerInfoForm.controls.currency.setValue('USD');
      component.headerInfoForm.controls.quotationToDate.setValue(
        undefined as any
      );
      component.headerInfoForm.controls.customerInquiryDate.setValue(
        undefined as any
      );
      component.headerInfoForm.controls.requestedDeliveryDate.setValue(
        undefined as any
      );
      component.headerInfoForm.controls.bindingPeriodValidityEndDate.setValue(
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
});
