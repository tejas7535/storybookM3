import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs/internal/observable/of';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { getQuotationDetails } from '@gq/core/store/active-case/active-case.selectors';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { ApprovalWorkflowInformation, Duration } from '@gq/shared/models';
import { QuotationPricingOverview } from '@gq/shared/models/quotation';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.interface';
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

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { APPROVAL_STATE_MOCK, CUSTOMER_MOCK } from '../../../../testing/mocks';
import { QUOTATION_MOCK } from '../../../../testing/mocks/models/quotation';
import { QUOTATION_DETAILS_MOCK } from '../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { ACTIVE_CASE_STATE_MOCK } from '../../../../testing/mocks/state/active-case-state.mock';
import { OverviewTabComponent } from './overview-tab.component';

describe('OverviewTabComponent', () => {
  let component: OverviewTabComponent;
  let spectator: Spectator<OverviewTabComponent>;
  let store: MockStore;
  const facadeMock = {
    getApprovers: jest.fn(),
    requiredApprovalLevelsForQuotation$: of('approvalLevel'),
    approvalCockpitInformation$: of(
      APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
    ),
  } as unknown as ApprovalFacade;

  const createComponent = createComponentFactory({
    component: OverviewTabComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    declarations: [MockPipe(NumberCurrencyPipe), MockPipe(PercentagePipe)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      MockProvider(ApprovalFacade),
      MockProvider(ActiveCaseFacade),
      MockProvider(RolesFacade),
      provideMockStore({
        initialState: {
          activeCase: { ...ACTIVE_CASE_STATE_MOCK },
          'azure-auth': {},
        },
      }),
      MockProvider(TranslocoLocaleService),
    ],
    detectChanges: false,
  });
  beforeEach(() => {
    spectator = createComponent();
    store = spectator.inject(MockStore);
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should call methods', () => {
      component['initializeObservables'] = jest.fn();
      component['approvalFacade'].getApprovers = jest.fn();
      component['activeCaseFacade'].getAllAttachments = jest.fn();

      component.ngOnInit();

      expect(component['approvalFacade'].getApprovers).toHaveBeenCalled();
      expect(
        component['activeCaseFacade'].getAllAttachments
      ).toHaveBeenCalled();
      expect(component['initializeObservables']).toHaveBeenCalled();
    });

    test(
      'should init Observables',
      marbles((m) => {
        const mockQuotationDetailsSummaryKpi: QuotationDetailsSummaryKpi = {
          amountOfQuotationDetails: 2,
          totalNetValue: 2020.4,
          totalWeightedAverageGpi: 0.2474,
          totalWeightedAverageGpm: 0.99,
          totalWeightedAveragePriceDiff: 0.5,
          avgGqRating: 3,
        };
        const expectedPricingInformation: QuotationPricingOverview = {
          netValue: {
            value:
              APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.totalNetValue,
            warning: true,
          },
          currency:
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.currency,
          netValueEur:
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
              .totalNetValueEur,
          avgGqRating: {
            value: mockQuotationDetailsSummaryKpi.avgGqRating,
          },
          gpi: {
            value: mockQuotationDetailsSummaryKpi.totalWeightedAverageGpi,
          },
          gpm: {
            value: APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.gpm,
            warning: true,
          },
          deviation: {
            value:
              APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
                .priceDeviation,
            warning: true,
          },
        };
        store.overrideSelector(getQuotationDetails, QUOTATION_DETAILS_MOCK);
        store.overrideSelector(
          activeCaseFeature.getQuotationDetailsSummaryKpi,
          mockQuotationDetailsSummaryKpi
        );

        store.overrideSelector(
          activeCaseFeature.selectQuotation,
          QUOTATION_MOCK
        );
        store.overrideSelector(activeCaseFeature.selectCustomer, CUSTOMER_MOCK);
        Object.defineProperty(component, 'approvalFacade', {
          value: facadeMock,
        });

        const testDuration: Duration = {
          years: 0,
          months: 6,
          days: 12,
        };
        const calculateDurationSpy = jest.spyOn(miscUtils, 'calculateDuration');
        calculateDurationSpy.mockReturnValue(testDuration);

        component.ngOnInit();

        m.expect(component.generalInformation$).toBeObservable('a', {
          a: {
            approvalLevel: 'approvalLevel',
            validityFrom: ACTIVE_CASE_STATE_MOCK.quotation.sapCreated,
            validityTo: ACTIVE_CASE_STATE_MOCK.quotation.validTo,
            duration: testDuration,
            projectInformation:
              APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
                .projectInformation,
            customer: ACTIVE_CASE_STATE_MOCK.customer,
            requestedQuotationDate:
              ACTIVE_CASE_STATE_MOCK.quotation.sapQuotationToDate,
            comment:
              APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.comment,
            offerType: ACTIVE_CASE_STATE_MOCK.quotation.offerType,
          },
        });

        m.expect(component.quotationCurrency$).toBeObservable('a', {
          a: ACTIVE_CASE_STATE_MOCK.quotation.currency,
        });

        m.expect(component.pricingInformation$).toBeObservable('a', {
          a: expectedPricingInformation,
        });

        m.flush();
        expect(calculateDurationSpy).toHaveBeenCalledWith(
          ACTIVE_CASE_STATE_MOCK.quotation.sapCreated,
          ACTIVE_CASE_STATE_MOCK.quotation.validTo,
          undefined
        );
      })
    );

    test(
      'should init Observables and use GQ Pricing information',
      marbles((m) => {
        Object.defineProperty(component, 'approvalFacade', {
          value: {
            getApprovers: jest.fn(),
            requiredApprovalLevelsForQuotation$: of('approvalLevel'),
            approvalCockpitInformation$: of({
              priceDeviation: null,
              currency:
                APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.currency,
              totalNetValueEur:
                APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
                  .totalNetValueEur,
            } as unknown as ApprovalWorkflowInformation),
          } as unknown as ApprovalFacade,
        });

        const mockQuotationDetailsSummaryKpi: QuotationDetailsSummaryKpi = {
          amountOfQuotationDetails: 2,
          totalNetValue: 2020.4,
          totalWeightedAverageGpi: 0.2474,
          totalWeightedAverageGpm: 0.99,
          totalWeightedAveragePriceDiff: 0.5,
          avgGqRating: 3,
        };

        const expectedPricingInformation: QuotationPricingOverview = {
          netValue: {
            value: mockQuotationDetailsSummaryKpi.totalNetValue,
            warning: undefined,
          },
          currency:
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.currency,
          netValueEur:
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
              .totalNetValueEur,
          avgGqRating: {
            value: mockQuotationDetailsSummaryKpi.avgGqRating,
          },
          gpi: {
            value: mockQuotationDetailsSummaryKpi.totalWeightedAverageGpi,
          },
          gpm: {
            value: mockQuotationDetailsSummaryKpi.totalWeightedAverageGpm,
            warning: undefined,
          },
          deviation: {
            value: mockQuotationDetailsSummaryKpi.totalWeightedAveragePriceDiff,
            warning: false,
          },
        };

        store.overrideSelector(
          activeCaseFeature.getQuotationDetailsSummaryKpi,
          mockQuotationDetailsSummaryKpi
        );

        component.ngOnInit();
        m.expect(component.pricingInformation$).toBeObservable('a', {
          a: expectedPricingInformation,
        });
      })
    );

    test(
      'should init Observables and use SAP price Deviation when value is "0.00" and set warning t true',
      marbles((m) => {
        Object.defineProperty(component, 'approvalFacade', {
          value: {
            getApprovers: jest.fn(),
            requiredApprovalLevelsForQuotation$: of('approvalLevel'),
            approvalCockpitInformation$: of({
              priceDeviation: 0,
              currency:
                APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.currency,
              totalNetValueEur:
                APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
                  .totalNetValueEur,
            } as ApprovalWorkflowInformation),
          } as unknown as ApprovalFacade,
        });

        const mockQuotationDetailsSummaryKpi: QuotationDetailsSummaryKpi = {
          amountOfQuotationDetails: 2,
          totalNetValue: 2020.4,
          totalWeightedAverageGpi: 0.2474,
          totalWeightedAverageGpm: 0.99,
          totalWeightedAveragePriceDiff: 0.5,
          avgGqRating: 3,
        };

        const expectedPricingInformation: QuotationPricingOverview = {
          netValue: {
            value: mockQuotationDetailsSummaryKpi.totalNetValue,
            warning: undefined,
          },
          currency:
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.currency,
          netValueEur:
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
              .totalNetValueEur,
          avgGqRating: {
            value: mockQuotationDetailsSummaryKpi.avgGqRating,
          },
          gpi: {
            value: mockQuotationDetailsSummaryKpi.totalWeightedAverageGpi,
          },
          gpm: {
            value: mockQuotationDetailsSummaryKpi.totalWeightedAverageGpm,
            warning: undefined,
          },
          deviation: {
            value: 0,
            warning: true,
          },
        };

        store.overrideSelector(
          activeCaseFeature.getQuotationDetailsSummaryKpi,
          mockQuotationDetailsSummaryKpi
        );

        component.ngOnInit();
        m.expect(component.pricingInformation$).toBeObservable('a', {
          a: expectedPricingInformation,
        });
      })
    );
    test(
      'should init Observables and use null when SAP and GQ price Deviation is null and set warning to false',
      marbles((m) => {
        Object.defineProperty(component, 'approvalFacade', {
          value: {
            getApprovers: jest.fn(),
            requiredApprovalLevelsForQuotation$: of('approvalLevel'),
            approvalCockpitInformation$: of({
              priceDeviation: null,
              currency:
                APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.currency,
              totalNetValueEur:
                APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
                  .totalNetValueEur,
            } as ApprovalWorkflowInformation),
          } as unknown as ApprovalFacade,
        });

        const mockQuotationDetailsSummaryKpi: QuotationDetailsSummaryKpi = {
          amountOfQuotationDetails: 2,
          totalNetValue: 2020.4,
          totalWeightedAverageGpi: 0.2474,
          totalWeightedAverageGpm: 0.99,
          totalWeightedAveragePriceDiff: null,
          avgGqRating: 3,
        };

        const expectedPricingInformation: QuotationPricingOverview = {
          netValue: {
            value: mockQuotationDetailsSummaryKpi.totalNetValue,
            warning: undefined,
          },
          currency:
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.currency,
          netValueEur:
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
              .totalNetValueEur,
          avgGqRating: {
            value: mockQuotationDetailsSummaryKpi.avgGqRating,
          },
          gpi: {
            value: mockQuotationDetailsSummaryKpi.totalWeightedAverageGpi,
          },
          gpm: {
            value: mockQuotationDetailsSummaryKpi.totalWeightedAverageGpm,
            warning: undefined,
          },
          deviation: {
            value: null,
            warning: false,
          },
        };

        store.overrideSelector(
          activeCaseFeature.getQuotationDetailsSummaryKpi,
          mockQuotationDetailsSummaryKpi
        );

        component.ngOnInit();
        m.expect(component.pricingInformation$).toBeObservable('a', {
          a: expectedPricingInformation,
        });
      })
    );
    test(
      'should init Observables and use sap deviationValue even when it is same as GQ and set warning to false',
      marbles((m) => {
        Object.defineProperty(component, 'approvalFacade', {
          value: {
            getApprovers: jest.fn(),
            requiredApprovalLevelsForQuotation$: of('approvalLevel'),
            approvalCockpitInformation$: of({
              priceDeviation: 0.15,
              currency:
                APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.currency,
              totalNetValueEur:
                APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
                  .totalNetValueEur,
            } as ApprovalWorkflowInformation),
          } as unknown as ApprovalFacade,
        });

        const mockQuotationDetailsSummaryKpi: QuotationDetailsSummaryKpi = {
          amountOfQuotationDetails: 2,
          totalNetValue: 2020.4,
          totalWeightedAverageGpi: 0.2474,
          totalWeightedAverageGpm: 0.99,
          totalWeightedAveragePriceDiff: 0.2,
          avgGqRating: 3,
        };

        const expectedPricingInformation: QuotationPricingOverview = {
          netValue: {
            value: mockQuotationDetailsSummaryKpi.totalNetValue,
            warning: undefined,
          },
          currency:
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.currency,
          netValueEur:
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
              .totalNetValueEur,
          avgGqRating: {
            value: mockQuotationDetailsSummaryKpi.avgGqRating,
          },
          gpi: {
            value: mockQuotationDetailsSummaryKpi.totalWeightedAverageGpi,
          },
          gpm: {
            value: mockQuotationDetailsSummaryKpi.totalWeightedAverageGpm,
            warning: undefined,
          },
          deviation: {
            value: 0.15,
            warning: true,
          },
        };

        store.overrideSelector(
          activeCaseFeature.getQuotationDetailsSummaryKpi,
          mockQuotationDetailsSummaryKpi
        );

        component.ngOnInit();
        m.expect(component.pricingInformation$).toBeObservable('a', {
          a: expectedPricingInformation,
        });
      })
    );
    test(
      'should init Observables and use Gq Deviation when quotation is not synced and therefor sapPriceDeviation will be undefined',
      marbles((m) => {
        Object.defineProperty(component, 'approvalFacade', {
          value: {
            getApprovers: jest.fn(),
            requiredApprovalLevelsForQuotation$: of('approvalLevel'),
            approvalCockpitInformation$: of({
              priceDeviation: undefined,
              currency:
                APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.currency,
              totalNetValueEur:
                APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
                  .totalNetValueEur,
            } as ApprovalWorkflowInformation),
          } as unknown as ApprovalFacade,
        });

        const mockQuotationDetailsSummaryKpi: QuotationDetailsSummaryKpi = {
          amountOfQuotationDetails: 2,
          totalNetValue: 2020.4,
          totalWeightedAverageGpi: 0.2474,
          totalWeightedAverageGpm: 0.99,
          totalWeightedAveragePriceDiff: 0.15,
          avgGqRating: 3,
        };

        const expectedPricingInformation: QuotationPricingOverview = {
          netValue: {
            value: mockQuotationDetailsSummaryKpi.totalNetValue,
            warning: undefined,
          },
          currency:
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.currency,
          netValueEur:
            APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
              .totalNetValueEur,
          avgGqRating: {
            value: mockQuotationDetailsSummaryKpi.avgGqRating,
          },
          gpi: {
            value: mockQuotationDetailsSummaryKpi.totalWeightedAverageGpi,
          },
          gpm: {
            value: mockQuotationDetailsSummaryKpi.totalWeightedAverageGpm,
            warning: undefined,
          },
          deviation: {
            value: 0.15,
            warning: false,
          },
        };

        store.overrideSelector(
          activeCaseFeature.getQuotationDetailsSummaryKpi,
          mockQuotationDetailsSummaryKpi
        );

        component.ngOnInit();
        m.expect(component.pricingInformation$).toBeObservable('a', {
          a: expectedPricingInformation,
        });
      })
    );
  });

  describe('ngOnDestroy', () => {
    test('should call methods', () => {
      component['shutDown$$'].next = jest.fn();
      component['shutDown$$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['shutDown$$'].next).toHaveBeenCalled();
      expect(component['shutDown$$'].complete).toHaveBeenCalled();
    });
  });

  describe('getRating', () => {
    test('should return low when value < 25', () => {
      const result = component.getRating(0.24);
      expect(result).toBe(Rating.LOW);
    });

    test('should return MEDIUM when value between 40 and 25', () => {
      const result = component.getRating(0.34);
      expect(result).toBe(Rating.MEDIUM);
    });

    test('should return GOOD when value more than 40', () => {
      const result = component.getRating(0.41);
      expect(result).toBe(Rating.GOOD);
    });

    test('should return undefined when value is undefined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = component.getRating(undefined);
      expect(result).toBeUndefined();
    });
  });
});
