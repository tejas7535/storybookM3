import { LocaleService, MMSeparator } from '@mm/core/services';
import { marbles } from 'rxjs-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { StorageMessagesActions } from '../../actions';
import { CalculationSelectionActions } from '../../actions/calculation-selection';
import { GlobalActions } from '../../actions/global/global.actions';
import * as GlobalEffects from './global.effects';

jest.mock('@mm/core/helpers/settings-helpers', () => ({
  detectAppDelivery: jest.fn(() => 'Standalone'),
}));

describe('Global Effects', () => {
  describe('initGlobal$', () => {
    it(
      'should dispatch the correct actions and set separator and language for embedded',
      marbles((m) => {
        const localeServiceMock = {
          setSeparator: jest.fn(),
        } as unknown as LocaleService;

        const actions$ = m.hot('a', {
          a: GlobalActions.initGlobal({
            bearingId: '123',
            separator: MMSeparator.Comma,
          }),
        });

        const expected = m.cold('-(defg)', {
          d: GlobalActions.determineInternalUser(),
          e: StorageMessagesActions.getStorageMessage(),
          f: CalculationSelectionActions.fetchBearingData({ bearingId: '123' }),
          g: GlobalActions.setIsInitialized(),
        });

        const result = GlobalEffects.initGlobal$(actions$, localeServiceMock);

        m.expect(result).toBeObservable(expected);
        m.flush();

        expect(localeServiceMock.setSeparator).toHaveBeenCalledWith(
          MMSeparator.Comma
        );
      })
    );

    it(
      'should dispatch the correct actions and set separator and language for standalone',
      marbles((m) => {
        const actions$ = m.hot('a', {
          a: GlobalActions.initGlobal({}),
        });

        const expected = m.cold('-(def)', {
          d: GlobalActions.determineInternalUser(),
          e: StorageMessagesActions.getStorageMessage(),
          f: GlobalActions.setIsInitialized(),
        });

        const result = GlobalEffects.initGlobal$(actions$, {} as any);

        m.expect(result).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('determineInternalUser$', () => {
    it(
      'should dispatch setIsInternalUser action',
      marbles((m) => {
        const internalDetectionServiceMock = {
          getInternalHelloEndpoint: jest.fn(() => m.cold('a', { a: true })),
        } as unknown as any;

        const actions$ = m.hot('a', {
          a: GlobalActions.determineInternalUser(),
        });

        const expected = m.cold('(b)', {
          b: GlobalActions.setIsInternalUser({ isInternalUser: true }),
        });

        const result = GlobalEffects.determineInternalUser$(
          actions$,
          internalDetectionServiceMock
        );

        m.expect(result).toBeObservable(expected);
        m.flush();

        expect(
          internalDetectionServiceMock.getInternalHelloEndpoint
        ).toHaveBeenCalled();
      })
    );
  });

  describe('setIsInternalUser$', () => {
    it(
      'should call addCustomPropertyToTelemetryData with correct parameters',
      marbles((m) => {
        const appInsightsMock = {
          addCustomPropertyToTelemetryData: jest.fn(),
        } as unknown as ApplicationInsightsService;

        const actions$ = m.hot('a', {
          a: GlobalActions.setIsInternalUser({ isInternalUser: true }),
        });

        const result = GlobalEffects.setIsInternalUser$(
          actions$,
          appInsightsMock
        );

        // Since this effect has dispatch: false, we need to subscribe to trigger the tap
        result.subscribe();
        m.flush();

        expect(
          appInsightsMock.addCustomPropertyToTelemetryData
        ).toHaveBeenCalledWith('internalUser', 'true');
      })
    );
  });
});
