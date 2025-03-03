import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { Customer, Quotation } from '@gq/shared/models';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.model';
import { Rating } from '@gq/shared/models/rating.enum';
import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { PercentagePipe } from '@gq/shared/pipes/percentage/percentage.pipe';
import * as miscUtils from '@gq/shared/utils/misc.utils';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockPipe, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { OverviewTabComponent } from './overview-tab.component';

describe('OverviewTabComponent', () => {
  let component: OverviewTabComponent;
  let spectator: Spectator<OverviewTabComponent>;
  let store: MockStore;

  const mockQuotation = {
    sapCreated: '2023-01-01',
    validTo: '2024-01-01',
    sapQuotationToDate: '2023-06-01',
    currency: 'EUR',
    offerType: 'standard',
  } as any as Quotation;

  const facadeMock = {
    getApprovers: jest.fn(),
    requiredApprovalLevelsForQuotation$: of('approvalLevel'),
    approvalCockpitInformation$: of({
      projectInformation: {},
      comment: '',
      totalNetValue: 1000,
      totalNetValueEur: 1000,
      gpm: 0.17,
      priceDeviation: 0.2,
    } as any),
    allApproversLoading$: of(false),
    approvalCockpitLoading$: of(false),
  } as Partial<ApprovalFacade>;

  const activeCaseFacadeMock = {
    getAllAttachments: jest.fn(),
    attachmentsLoading$: of(false),
    quotationAttributes$: of([]),
    quotationPricingOverview$: of({
      netValue: { value: 1000 },
      avgGqRating: { value: 2 },
      gpi: { value: 0.3 },
      gpm: { value: 0.17 },
      deviation: { value: 0.1 },
    }),
  } as Partial<ActiveCaseFacade>;

  const quotationDetailsSummaryKpiMock: QuotationDetailsSummaryKpi = {
    amountOfQuotationDetails: 2,
    totalNetValue: 1000,
    totalWeightedAverageGpi: 0.2474,
    totalWeightedAverageGpm: 0.99,
    totalWeightedAveragePriceDiff: 0.2,
    avgGqRating: 0,
  };

  const customerMock = {
    name: 'Sample Customer',
  } as Customer;

  const createComponent = createComponentFactory({
    component: OverviewTabComponent,
    imports: [PushPipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      MockProvider(ApprovalFacade, facadeMock),
      MockProvider(ActiveCaseFacade, activeCaseFacadeMock),
      MockProvider(RolesFacade),
      provideMockStore({
        initialState: {
          activeCase: { customer: customerMock },
          'azure-auth': {},
        },
      }),
      MockProvider(TranslocoLocaleService),
    ],
    declarations: [MockPipe(NumberCurrencyPipe), MockPipe(PercentagePipe)],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    store = spectator.inject(MockStore);
    component = spectator.component;

    store.overrideSelector(activeCaseFeature.selectQuotation, mockQuotation);
    store.overrideSelector(activeCaseFeature.selectCustomer, customerMock);
    store.overrideSelector(
      activeCaseFeature.getQuotationDetailsSummaryKpi,
      quotationDetailsSummaryKpiMock
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should call methods', () => {
      component['initializeObservables'] = jest.fn();
      const getApproversSpy = jest.spyOn(
        component['approvalFacade'],
        'getApprovers'
      );
      const getAllAttachmentsSpy = jest.spyOn(
        component['activeCaseFacade'],
        'getAllAttachments'
      );

      component.ngOnInit();

      expect(getApproversSpy).toHaveBeenCalled();
      expect(getAllAttachmentsSpy).toHaveBeenCalled();
      expect(component['initializeObservables']).toHaveBeenCalled();
    });

    test(
      'should init Observables',
      marbles((m) => {
        const calculateDurationSpy = jest
          .spyOn(miscUtils, 'calculateDuration')
          .mockReturnValue({ years: 0, months: 6, days: 12 });

        component.ngOnInit();

        m.expect(component.generalInformation$).toBeObservable(
          m.cold('a', {
            a: {
              approvalLevel: 'approvalLevel',
              validityFrom: mockQuotation.sapCreated,
              validityTo: mockQuotation.validTo,
              duration: { years: 0, months: 6, days: 12 },
              projectInformation: {},
              customer: customerMock,
              requestedQuotationDate: mockQuotation.sapQuotationToDate,
              comment: '',
              offerType: mockQuotation.offerType,
            } as any,
          })
        );

        m.flush();
        expect(calculateDurationSpy).toHaveBeenCalledWith(
          mockQuotation.sapCreated,
          mockQuotation.validTo,
          undefined
        );
      })
    );
  });

  describe('ngOnDestroy', () => {
    test('should call methods', () => {
      const nextSpy = jest.spyOn(component['shutDown$$'], 'next');
      const completeSpy = jest.spyOn(component['shutDown$$'], 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('getRating', () => {
    it('should return LOW for value < 0.25', () => {
      const result = component.getRating(0.24);
      expect(result).toBe(Rating.LOW);
    });

    it('should return MEDIUM for value between 0.25 and 0.4', () => {
      const result = component.getRating(0.34);
      expect(result).toBe(Rating.MEDIUM);
    });

    it('should return GOOD for value >= 0.4', () => {
      const result = component.getRating(0.41);
      expect(result).toBe(Rating.GOOD);
    });

    it('should return undefined for undefined value', () => {
      const result = component.getRating(null);
      expect(result).toBeUndefined();
    });
  });
});
