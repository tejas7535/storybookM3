import { ActiveDirectoryUser, QuotationDetail } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { Rfq4ProcessActions } from './rfq-4-process.actions';
import { Rfq4ProcessFacade } from './rfq-4-process.facade';
import { rfq4ProcessFeature } from './rfq-4-process.reducer';

describe('rfq4ProcessFacade', () => {
  let facade: Rfq4ProcessFacade;
  let spectator: SpectatorService<Rfq4ProcessFacade>;
  let mockStore: MockStore;
  let actions$: Actions;

  const createService = createServiceFactory({
    service: Rfq4ProcessFacade,
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
    expect(mockStore).toBeTruthy();
  });

  describe('Observables', () => {
    test(
      'should provide findCalculatorsLoading$',
      marbles((m) => {
        const expected = m.cold('a', { a: false });
        mockStore.overrideSelector(
          rfq4ProcessFeature.selectFindCalculatorsLoading,
          false
        );
        m.expect(facade.findCalculatorsLoading$).toBeObservable(expected);
      })
    );

    test(
      'should provide calculators$',
      marbles((m) => {
        const expected = m.cold('a', { a: ['calculator1', 'calculator2'] });
        mockStore.overrideSelector(rfq4ProcessFeature.selectFoundCalculators, [
          'calculator1',
          'calculator2',
        ]);
        m.expect(facade.calculators$).toBeObservable(expected);
      })
    );

    test(
      'should provide sendRecalculateSqvLoading$',
      marbles((m) => {
        const expected = m.cold('a', { a: true });
        mockStore.overrideSelector(
          rfq4ProcessFeature.selectSendRecalculateSqvRequestLoading,
          true
        );
        m.expect(facade.sendRecalculateSqvLoading$).toBeObservable(expected);
      })
    );
    test(
      'should dispatch sendRecalculateSqvRequestSuccess$',
      marbles((m) => {
        const action = Rfq4ProcessActions.sendRecalculateSqvRequestSuccess({
          gqPositionId: '1245',
          rfq4Status: Rfq4Status.IN_PROGRESS,
        });
        const expected = m.cold('b', {
          b: action,
        });

        actions$ = m.hot('a', { a: action });

        m.expect(facade.sendRecalculateSqvSuccess$).toBeObservable(
          expected as any
        );
      })
    );
    test(
      'should provide getMaintainersLoading$',
      marbles((m) => {
        const expected = m.cold('a', { a: false });
        mockStore.overrideSelector(
          rfq4ProcessFeature.selectSapMaintainersLoading,
          false
        );
        m.expect(facade.getMaintainersLoading$).toBeObservable(expected);
      })
    );
    test(
      'maintainers$',
      marbles((m) => {
        const expected = m.cold('a', {
          a: [
            { userId: 'maintainer1' } as ActiveDirectoryUser,
            { userId: 'maintainer2' } as ActiveDirectoryUser,
          ],
        });
        mockStore.overrideSelector(rfq4ProcessFeature.getValidMaintainers, [
          { userId: 'maintainer1' } as ActiveDirectoryUser,
          { userId: 'maintainer2' } as ActiveDirectoryUser,
        ]);
        m.expect(facade.maintainers$).toBeObservable(expected);
      })
    );
  });

  describe('methods', () => {
    describe('findCalculators', () => {
      test('should dispatch findCalculators', () => {
        const gqPositionId = '1234';
        const action = Rfq4ProcessActions.findCalculators({ gqPositionId });
        const spy = jest.spyOn(mockStore, 'dispatch');
        facade.findCalculators(gqPositionId);
        expect(spy).toHaveBeenCalledWith(action);
      });
    });

    describe('clearCalculators', () => {
      test('should dispatch clearCalculators action', () => {
        const action = Rfq4ProcessActions.clearCalculators();
        const spy = jest.spyOn(mockStore, 'dispatch');
        facade.clearCalculators();
        expect(spy).toHaveBeenCalledWith(action);
      });
    });
    describe('sendRecalculateSqvRequest', () => {
      test('should dispatch sendRecalculateSqvRequest', () => {
        const gqPositionId = '1234';
        const message = 'test message';
        const action = Rfq4ProcessActions.sendRecalculateSqvRequest({
          gqPositionId,
          message,
        });
        const spy = jest.spyOn(mockStore, 'dispatch');
        facade.sendRecalculateSqvRequest(gqPositionId, message);
        expect(spy).toHaveBeenCalledWith(action);
      });
    });

    describe('getSapMaintainers', () => {
      test('should dispatch getSapMaintainers action', () => {
        const action = Rfq4ProcessActions.getSapMaintainerUserIds();
        const spy = jest.spyOn(mockStore, 'dispatch');
        facade.getSapMaintainers();
        expect(spy).toHaveBeenCalledWith(action);
      });
    });

    describe('sendEmailRequestToMaintainCalculators', () => {
      test('should dispatch sendEmailRequestToMaintainCalculators', () => {
        const quotationDetail = {} as QuotationDetail;
        const action = Rfq4ProcessActions.sendEmailRequestToMaintainCalculators(
          {
            quotationDetail,
          }
        );
        const spy = jest.spyOn(mockStore, 'dispatch');
        facade.sendEmailRequestToMaintainCalculators(quotationDetail);
        expect(spy).toHaveBeenCalledWith(action);
      });
    });
  });
});
