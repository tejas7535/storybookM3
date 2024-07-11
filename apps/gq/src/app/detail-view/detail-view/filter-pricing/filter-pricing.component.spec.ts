import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { of } from 'rxjs';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import {
  getIsQuotationStatusActive,
  getQuotationCurrency,
} from '@gq/core/store/active-case/active-case.selectors';
import { RolesFacade } from '@gq/core/store/facades';
import { ProcessCaseState } from '@gq/core/store/process-case';
import { PriceSource, UpdatePrice } from '@gq/shared/models/quotation-detail';
import * as fPricingUtils from '@gq/shared/utils/f-pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import {
  AUTH_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
} from '../../../../testing/mocks';
import { ACTIVE_CASE_STATE_MOCK } from '../../../../testing/mocks/state/active-case-state.mock';
import { FilterPricingComponent } from './filter-pricing.component';
import { GqPriceComponent } from './gq-price/gq-price.component';
import { ManualPriceComponent } from './manual-price/manual-price.component';
import { SapPriceComponent } from './sap-price/sap-price.component';
import { TargetPriceComponent } from './target-price/target-price.component';

describe('FilterPricingComponent', () => {
  let component: FilterPricingComponent;
  let spectator: Spectator<FilterPricingComponent>;
  let mockStore: MockStore<ProcessCaseState>;

  const createComponent = createComponentFactory({
    component: FilterPricingComponent,
    detectChanges: false,
    imports: [PushPipe],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          activeCase: ACTIVE_CASE_STATE_MOCK,
          'azure-auth': AUTH_STATE_MOCK,
        },
      }),
      MockProvider(RolesFacade, {
        userHasAccessToComparableTransactions$: of(true),
      }),
    ],
    declarations: [
      ManualPriceComponent,
      GqPriceComponent,
      SapPriceComponent,
      TargetPriceComponent,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    mockStore = spectator.inject(MockStore);

    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('observables', () => {
    test(
      'should set quotationCurrency',
      marbles((m) => {
        mockStore.overrideSelector(getQuotationCurrency, 'EUR');

        m.expect(component.quotationCurrency$).toBeObservable('a', {
          a: 'EUR',
        });
      })
    );
    test(
      'should set quotation is loading',
      marbles((m) => {
        mockStore.overrideSelector(activeCaseFeature.selectUpdateLoading, true);

        m.expect(component.updateIsLoading$).toBeObservable('a', {
          a: true,
        });
      })
    );

    test(
      'should set quotation is active',
      marbles((m) => {
        mockStore.overrideSelector(getIsQuotationStatusActive, true);

        m.expect(component.updateIsLoading$).toBeObservable('a', {
          a: true,
        });
      })
    );

    test(
      'should set quotation detail',
      marbles((m) => {
        mockStore.overrideSelector(
          activeCaseFeature.getSelectedQuotationDetail,
          QUOTATION_DETAIL_MOCK
        );

        m.expect(component.quotationDetail$).toBeObservable('a', {
          a: QUOTATION_DETAIL_MOCK,
        });
      })
    );
  });

  describe('selectManualPrice', () => {
    test(
      'should dispatch action',
      marbles((m) => {
        mockStore.overrideSelector(
          activeCaseFeature.getSelectedQuotationDetail,
          QUOTATION_DETAIL_MOCK
        );
        mockStore.dispatch = jest.fn();

        const updatePrice = new UpdatePrice(
          QUOTATION_DETAIL_MOCK.recommendedPrice,
          PriceSource.GQ
        );

        m.expect(component.quotationDetail$).toBeObservable('a', {
          a: QUOTATION_DETAIL_MOCK,
        });
        m.flush();

        component.selectPrice(updatePrice);

        expect(mockStore.dispatch).toHaveBeenLastCalledWith(
          ActiveCaseActions.updateQuotationDetails({
            updateQuotationDetailList: [
              {
                gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
                price: QUOTATION_DETAIL_MOCK.recommendedPrice,
                priceSource: PriceSource.GQ,
              },
            ],
          })
        );
      })
    );
  });

  describe('isDetailsLinkVisible$', () => {
    describe('not a f number', () => {
      beforeEach(() => {
        jest.spyOn(fPricingUtils, 'isFNumber').mockReturnValue(false);
      });

      test(
        'should return true when is not f number and strategic price is not set',
        marbles((m) => {
          mockStore.overrideSelector(
            activeCaseFeature.getSelectedQuotationDetail,
            { ...QUOTATION_DETAIL_MOCK, strategicPrice: undefined }
          );

          m.expect(component.isDetailsLinkVisible$).toBeObservable('a', {
            a: true,
          });
        })
      );

      test(
        'should return false when is not f number and strategic price is set',
        marbles((m) => {
          mockStore.overrideSelector(
            activeCaseFeature.getSelectedQuotationDetail,
            { ...QUOTATION_DETAIL_MOCK, strategicPrice: 50 }
          );

          m.expect(component.isDetailsLinkVisible$).toBeObservable('a', {
            a: false,
          });
        })
      );
    });

    describe('f number', () => {
      beforeEach(() => {
        jest.spyOn(fPricingUtils, 'isFNumber').mockReturnValue(true);
      });
      test(
        'should return false when is f number and strategic price is not set',
        marbles((m) => {
          mockStore.overrideSelector(
            activeCaseFeature.getSelectedQuotationDetail,
            QUOTATION_DETAIL_MOCK
          );

          m.expect(component.isDetailsLinkVisible$).toBeObservable('a', {
            a: false,
          });
        })
      );

      test(
        'should return false when is f number and strategic price is set',
        marbles((m) => {
          mockStore.overrideSelector(
            activeCaseFeature.getSelectedQuotationDetail,
            { ...QUOTATION_DETAIL_MOCK, strategicPrice: 50 }
          );

          m.expect(component.isDetailsLinkVisible$).toBeObservable('a', {
            a: false,
          });
        })
      );
    });
  });
});
