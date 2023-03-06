import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
  getQuotationDetails,
  getQuotationOverviewInformation,
} from '@gq/core/store/selectors';
import { Rating } from '@gq/shared/components/kpi-status-card/models/rating.enum';
import { QuotationPricingOverview } from '@gq/shared/models/quotation';
import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { PercentagePipe } from '@gq/shared/pipes/percentage/percentage.pipe';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockPipe } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_DETAILS_MOCK,
} from './../../../../testing/mocks';
import { OverviewTabComponent } from './overview-tab.component';

describe('OverviewTabComponent', () => {
  let component: OverviewTabComponent;
  let spectator: Spectator<OverviewTabComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: OverviewTabComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushModule],
    declarations: [MockPipe(NumberCurrencyPipe), MockPipe(PercentagePipe)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      provideMockStore({
        initialState: {
          processCase: { ...PROCESS_CASE_STATE_MOCK },
          'azure-auth': {},
        },
      }),
    ],
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
          gpi: 24.74,
          gpm: 0.99,
          netValue: 2020.4,
          avgGqRating: 2,
        };
        store.overrideSelector(getQuotationDetails, QUOTATION_DETAILS_MOCK);
        store.overrideSelector(
          getQuotationOverviewInformation,
          mockQuotationOverviewInformation
        );

        component.ngOnInit();

        m.expect(component.generalInformation$).toBeObservable('a', {
          a: {
            approvalLevel: 'L1 + L2',
            validityFrom: '01/01/2023',
            validityTo: '12/31/2023',
            duration: '10 months',
            project: 'GSIM Project',
            projectInformation:
              'This is a longer text that contains some Project information',
            customer: PROCESS_CASE_STATE_MOCK.customer.item,
            requestedQuotationDate: '01/01/2024',
            comment: 'This is a longer comment text, that contains a comment.',
          },
        });

        m.expect(component.quotationCurrency$).toBeObservable('a', {
          a: PROCESS_CASE_STATE_MOCK.quotation.item.currency,
        });

        m.expect(component.pricingInformation$).toBeObservable('a', {
          a: mockQuotationOverviewInformation,
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
