import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs/internal/observable/of';

import {
  activeCaseFeature,
  getQuotationDetails,
  getQuotationOverviewInformation,
} from '@gq/core/store/active-case';
import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { Rating } from '@gq/shared/components/kpi-status-card/models/rating.enum';
import {
  ApprovalStatus,
  QuotationPricingOverview,
} from '@gq/shared/models/quotation';
import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { PercentagePipe } from '@gq/shared/pipes/percentage/percentage.pipe';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
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
    getApprovalStatus: jest.fn(),
    requiredApprovalLevelsForQuotation$: of('approvalLevel'),
    approvalStatus$: of(APPROVAL_STATE_MOCK.approvalStatus),
  } as unknown as ApprovalFacade;

  const createComponent = createComponentFactory({
    component: OverviewTabComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushModule],
    declarations: [MockPipe(NumberCurrencyPipe), MockPipe(PercentagePipe)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      MockProvider(ApprovalFacade),
      provideMockStore({
        initialState: {
          activeCase: { ...ACTIVE_CASE_STATE_MOCK },
          'azure-auth': {},
        },
      }),
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
      component.ngOnInit();
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
        };
        const expectedPricingInformation: QuotationPricingOverview = {
          netValue: {
            value: APPROVAL_STATE_MOCK.approvalStatus.netValue,
            warning: true,
          },
          avgGqRating: {
            value: mockQuotationOverviewInformation.avgGqRating.value,
          },
          gpi: { value: mockQuotationOverviewInformation.gpi.value },
          gpm: { value: APPROVAL_STATE_MOCK.approvalStatus.gpm, warning: true },
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

        component.ngOnInit();

        m.expect(component.generalInformation$).toBeObservable('a', {
          a: {
            approvalLevel: 'approvalLevel',
            validityFrom: '01/01/2023',
            validityTo: '12/31/2023',
            duration: '10 months',
            project: 'GSIM Project',
            projectInformation:
              'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.',
            customer: ACTIVE_CASE_STATE_MOCK.customer,
            requestedQuotationDate: '01/01/2024',
            comment:
              'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.',
          },
        });

        m.expect(component.quotationCurrency$).toBeObservable('a', {
          a: ACTIVE_CASE_STATE_MOCK.quotation.currency,
        });

        m.expect(component.pricingInformation$).toBeObservable('a', {
          a: expectedPricingInformation,
        });
      })
    );

    test(
      'should init Observables and use GQ Pricing information',
      marbles((m) => {
        Object.defineProperty(component, 'approvalFacade', {
          value: {
            getApprovalStatus: jest.fn(),
            requiredApprovalLevelsForQuotation$: of('approvalLevel'),
            approvalStatus$: of({} as unknown as ApprovalStatus),
          } as unknown as ApprovalFacade,
        });

        const mockQuotationOverviewInformation: QuotationPricingOverview = {
          gpi: { value: 24.74, warning: undefined },
          gpm: { value: 0.99, warning: undefined },
          netValue: { value: 2020.4, warning: undefined },
          avgGqRating: { value: 2, warning: undefined },
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
      component['shutDown$$'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['shutDown$$'].next).toHaveBeenCalled();
      expect(component['shutDown$$'].unsubscribe).toHaveBeenCalled();
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
