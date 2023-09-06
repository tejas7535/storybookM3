import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { ActiveCaseActions } from './active-case.action';
import { ActiveCaseFacade } from './active-case.facade';
import { activeCaseFeature } from './active-case.reducer';

describe('ActiveCaseFacade', () => {
  let facade: ActiveCaseFacade;
  let spectator: SpectatorService<ActiveCaseFacade>;
  let mockStore: MockStore;
  let actions$: Actions;

  const createService = createServiceFactory({
    service: ActiveCaseFacade,
    providers: [provideMockStore({}), provideMockActions(() => actions$)],
  });

  beforeEach(() => {
    spectator = createService();
    facade = spectator.service;
    mockStore = spectator.inject(MockStore);
    actions$ = spectator.inject(Actions);
  });

  test('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('costsUpdating$', () => {
    test(
      'should select update costs loading',
      marbles((m) => {
        mockStore.overrideSelector(
          activeCaseFeature.selectUpdateCostsLoading,
          true
        );
        m.expect(facade.costsUpdating$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });

  describe('updateCostsSuccess$', () => {
    test(
      'should dispatch update costs success',
      marbles((m) => {
        const action = ActiveCaseActions.updateCostsSuccess({} as any);
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(facade.updateCostsSuccess$).toBeObservable(expected as any);
      })
    );
  });

  describe('updateCosts', () => {
    test('should dispatch update costs', () => {
      const gqPosId = '123';
      const action = ActiveCaseActions.updateCosts({ gqPosId });
      const spy = jest.spyOn(mockStore, 'dispatch');

      facade.updateCosts(gqPosId);

      expect(spy).toHaveBeenCalledWith(action);
    });
  });
});
