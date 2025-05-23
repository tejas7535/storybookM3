import { TranslocoService } from '@jsverse/transloco';
import { detectAppDelivery } from '@mm/core/helpers/settings-helpers';
import { LocaleService, MMSeparator } from '@mm/core/services';
import { AppDelivery } from '@mm/shared/models';
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
        const translocoServiceMock = {
          setActiveLang: jest.fn(),
        } as unknown as TranslocoService;

        const actions$ = m.hot('a', {
          a: GlobalActions.initGlobal({
            bearingId: '123',
            isStandalone: false,
            separator: MMSeparator.Comma,
            language: 'en',
          }),
        });

        const expected = m.cold('(bcdefg)', {
          b: GlobalActions.setIsStandalone({ isStandalone: false }),
          c: GlobalActions.setAppDelivery({
            appDelivery: 'embedded' as AppDelivery,
          }),
          d: GlobalActions.determineInternalUser(),
          e: StorageMessagesActions.getStorageMessage(),
          f: CalculationSelectionActions.fetchBearingData({ bearingId: '123' }),
          g: GlobalActions.setIsInitialized(),
        });

        const result = GlobalEffects.initGlobal$(
          actions$,
          translocoServiceMock,
          localeServiceMock
        );

        m.expect(result).toBeObservable(expected);
        m.flush();

        expect(localeServiceMock.setSeparator).toHaveBeenCalledWith(
          MMSeparator.Comma
        );
        expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith('en');
      })
    );

    it(
      'should dispatch the correct actions and set separator and language for standalone',
      marbles((m) => {
        const actions$ = m.hot('a', {
          a: GlobalActions.initGlobal({}),
        });

        const expected = m.cold('(bcdef)', {
          b: GlobalActions.setIsStandalone({ isStandalone: true }),
          c: GlobalActions.setAppDelivery({
            appDelivery: 'Standalone' as AppDelivery,
          }),
          d: GlobalActions.determineInternalUser(),
          e: StorageMessagesActions.getStorageMessage(),
          f: GlobalActions.setIsInitialized(),
        });

        const result = GlobalEffects.initGlobal$(
          actions$,
          {} as any,
          {} as any
        );

        m.expect(result).toBeObservable(expected);
        m.flush();

        expect(detectAppDelivery).toHaveBeenCalled();
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
      'should dispatch setIsInternalUser action',
      marbles((m) => {
        const appInsightsMock = {
          addCustomPropertyToTelemetryData: jest.fn(),
        } as unknown as ApplicationInsightsService;

        const actions$ = m.hot('a', {
          a: GlobalActions.setIsInternalUser({ isInternalUser: true }),
        });

        const expected = m.cold('(b)', {
          b: GlobalActions.setIsInternalUser({ isInternalUser: true }),
        });

        const result = GlobalEffects.setIsInternalUser$(
          actions$,
          appInsightsMock
        );

        m.expect(result).toBeObservable(expected);
        m.flush();

        expect(
          appInsightsMock.addCustomPropertyToTelemetryData
        ).toHaveBeenCalledWith('internalUser', 'true');
      })
    );
  });
});
