import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BehaviorSubject, of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades';
import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import * as fPricingUtils from '@gq/shared/utils/f-pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { FilterPricingComponent } from './filter-pricing.component';

describe('FilterPricingComponent', () => {
  let component: FilterPricingComponent;
  let spectator: Spectator<FilterPricingComponent>;
  const getSelectedQuotationDetailSubject$$ =
    new BehaviorSubject<QuotationDetail>({
      ...QUOTATION_DETAIL_MOCK,
      strategicPrice: undefined,
    });

  const createComponent = createComponentFactory({
    component: FilterPricingComponent,
    imports: [PushPipe, provideTranslocoTestingModule({ en: {} })],
    providers: [
      provideMockStore({}),
      MockProvider(RolesFacade, {
        userHasAccessToComparableTransactions$: of(true),
        userHasGPCRole$: of(true),
        userHasSQVRole$: of(true),
        userHasEditPriceSourceRole$: of(true),
        userHasManualPriceRole$: of(true),
      }),
      MockProvider(ActiveCaseFacade, {
        canEditQuotation$: of(true),
        updateQuotationDetails: jest.fn(),
        selectedQuotationDetail$:
          getSelectedQuotationDetailSubject$$.asObservable(),
        quotationDetailUpdating$: of(false),
        quotationCurrency$: of(QUOTATION_MOCK.currency),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      jest.spyOn(fPricingUtils, 'isFNumber').mockReturnValue(true);
    });

    test(
      'should initialize observables and variables',
      marbles((m) => {
        m.expect(component.quotationCurrency$).toBeObservable(
          m.cold('(a|)', { a: QUOTATION_MOCK.currency })
        );
        m.expect(component.updateIsLoading$).toBeObservable(
          m.cold('(a|)', {
            a: false,
          })
        );

        m.expect(component.isDetailsLinkVisible$).toBeObservable(
          m.cold('a', {
            a: false,
          })
        );
        m.expect(component.updateIsLoading$).toBeObservable(
          m.cold('(a|)', { a: false })
        );
        m.expect(component.userHasManualPriceRole$).toBeObservable(
          m.cold('(a|)', { a: true })
        );
        m.expect(component.quotationIsEditable$).toBeObservable(
          m.cold('(a|)', { a: true })
        );
        m.expect(component.userHasManualPriceRole$).toBeObservable(
          m.cold('(a|)', { a: true })
        );
        m.expect(component.userHasGPCRole$).toBeObservable(
          m.cold('(a|)', { a: true })
        );
        m.expect(component.userHasSQVRole$).toBeObservable(
          m.cold('(a|)', { a: true })
        );
      })
    );
  });

  describe('selectManualPrice', () => {
    test(
      'should dispatch action',
      marbles((m) => {
        const updatePrice = new UpdatePrice(
          QUOTATION_DETAIL_MOCK.recommendedPrice,
          PriceSource.GQ
        );

        m.expect(component.quotationDetail$).toBeObservable('a', {
          a: QUOTATION_DETAIL_MOCK,
        });
        m.flush();

        component.selectPrice(updatePrice);
        expect(
          component['activeCaseFacade'].updateQuotationDetails
        ).toHaveBeenCalledWith([
          {
            gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
            price: QUOTATION_DETAIL_MOCK.recommendedPrice,
            priceSource: PriceSource.GQ,
          },
        ]);
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
          getSelectedQuotationDetailSubject$$.next({
            ...QUOTATION_DETAIL_MOCK,
            strategicPrice: undefined,
          });
          m.expect(component.isDetailsLinkVisible$).toBeObservable('a', {
            a: true,
          });
        })
      );

      test(
        'should return false when is not f number and strategic price is set',
        marbles((m) => {
          getSelectedQuotationDetailSubject$$.next({
            ...QUOTATION_DETAIL_MOCK,
            strategicPrice: 50,
          });
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
          getSelectedQuotationDetailSubject$$.next(QUOTATION_DETAIL_MOCK);
          m.expect(component.isDetailsLinkVisible$).toBeObservable('a', {
            a: false,
          });
        })
      );

      test(
        'should return false when is f number and strategic price is set',
        marbles((m) => {
          getSelectedQuotationDetailSubject$$.next({
            ...QUOTATION_DETAIL_MOCK,
            strategicPrice: 50,
          });
          m.expect(component.isDetailsLinkVisible$).toBeObservable('a', {
            a: false,
          });
        })
      );
    });
  });
});
