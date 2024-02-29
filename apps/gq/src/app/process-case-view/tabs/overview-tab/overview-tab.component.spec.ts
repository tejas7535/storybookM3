import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs/internal/observable/of';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import {
  getQuotationDetails,
  getQuotationOverviewInformation,
} from '@gq/core/store/active-case/active-case.selectors';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { ApprovalWorkflowInformation, Duration } from '@gq/shared/models';
import { QuotationPricingOverview } from '@gq/shared/models/quotation';
import { Rating } from '@gq/shared/models/rating.enum';
import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { PercentagePipe } from '@gq/shared/pipes/percentage/percentage.pipe';
import * as miscUtils from '@gq/shared/utils/misc.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockPipe, MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  APPROVAL_STATE_MOCK,
  CUSTOMER_MOCK,
  QUOTATION_DETAILS_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
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
        const mockQuotationOverviewInformation: QuotationPricingOverview = {
          gpi: { value: 24.74 },
          gpm: { value: 0.99 },
          netValue: { value: 2020.4 },
          avgGqRating: { value: 2 },
          deviation: { value: 0.5 },
        };
        const expectedPricingInformation: QuotationPricingOverview = {
          netValue: {
            value:
              APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.totalNetValue,
            warning: true,
          },
          avgGqRating: {
            value: mockQuotationOverviewInformation.avgGqRating.value,
          },
          gpi: { value: mockQuotationOverviewInformation.gpi.value },
          gpm: {
            value: APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral.gpm,
            warning: true,
          },
          deviation: {
            value:
              APPROVAL_STATE_MOCK.approvalCockpit.approvalGeneral
                .priceDeviation, // no warning when gq and approval value differ
            warning: false,
          },
        };
        store.overrideSelector(getQuotationDetails, QUOTATION_DETAILS_MOCK);
        store.overrideSelector(
          getQuotationOverviewInformation,
          mockQuotationOverviewInformation
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
            approvalCockpitInformation$: of(
              {} as unknown as ApprovalWorkflowInformation
            ),
          } as unknown as ApprovalFacade,
        });

        const mockQuotationOverviewInformation: QuotationPricingOverview = {
          gpi: { value: 24.74, warning: undefined },
          gpm: { value: 0.99, warning: undefined },
          netValue: { value: 2020.4, warning: undefined },
          avgGqRating: { value: 2, warning: undefined },
          deviation: { value: 0.5, warning: true },
        };
        const expectedPricingInformation: QuotationPricingOverview = {
          netValue: {
            value: mockQuotationOverviewInformation.netValue.value,
            warning: undefined,
          },
          avgGqRating: {
            value: mockQuotationOverviewInformation.avgGqRating.value,
            warning: undefined,
          },
          gpi: {
            value: mockQuotationOverviewInformation.gpi.value,
            warning: undefined,
          },
          gpm: {
            value: mockQuotationOverviewInformation.gpm.value,
            warning: undefined,
          },
          deviation: {
            value: mockQuotationOverviewInformation.deviation.value,
            warning: true,
          },
        };

        store.overrideSelector(
          getQuotationOverviewInformation,
          mockQuotationOverviewInformation
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
      const result = component.getRating(24);
      expect(result).toBe(Rating.LOW);
    });

    test('should return MEDIUM when value between 40 and 25', () => {
      const result = component.getRating(34);
      expect(result).toBe(Rating.MEDIUM);
    });

    test('should return GOOD when value more than 40', () => {
      const result = component.getRating(41);
      expect(result).toBe(Rating.GOOD);
    });

    test('should return undefined when value is undefined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = component.getRating(undefined);
      expect(result).toBeUndefined();
    });
  });
});
