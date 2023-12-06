import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PurchaseOrderType } from '@gq/shared/models';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { PurchaseOrderTypeActions } from './purchase-order-type.actions';
import { PurchaseOrderTypeEffects } from './purchase-order-type.effects';
import { initialState } from './purchase-order-type.reducer';

describe('PurchaseOrderTypeEffects', () => {
  let action: any;
  let actions$: Actions;
  let effects: PurchaseOrderTypeEffects;
  let spectator: SpectatorService<PurchaseOrderTypeEffects>;

  let quotationService: QuotationService;

  const createService = createServiceFactory({
    service: PurchaseOrderTypeEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: { purchaseOrderType: initialState } }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(PurchaseOrderTypeEffects);

    quotationService = spectator.inject(QuotationService);
  });

  test('should be created', () => {
    expect(effects).toBeTruthy();
    expect(quotationService).toBeTruthy();
  });

  describe('getAllPurchaseOrderTypes$', () => {
    action = PurchaseOrderTypeActions.getAllPurchaseOrderTypes();
    test(
      'Should dispatch success action',
      marbles((m) => {
        const result = PurchaseOrderTypeActions.getAllPurchaseOrderTypesSuccess(
          {
            purchaseOrderTypes: [] as PurchaseOrderType[],
          }
        );
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: [] as PurchaseOrderType[] });
        quotationService.getPurchaseOrderTypes = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });
        m.expect(effects.getAllPurchaseOrderTypes$).toBeObservable(expected);
        m.flush();

        expect(quotationService.getPurchaseOrderTypes).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'Should dispatch error action',
      marbles((m) => {
        const errorMessage = 'error';
        const result = PurchaseOrderTypeActions.getAllPurchaseOrderTypesFailure(
          {
            errorMessage,
          }
        );
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-#|', undefined, errorMessage);
        quotationService.getPurchaseOrderTypes = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });
        m.expect(effects.getAllPurchaseOrderTypes$).toBeObservable(expected);
        m.flush();

        expect(quotationService.getPurchaseOrderTypes).toHaveBeenCalledTimes(1);
      })
    );
  });
});
