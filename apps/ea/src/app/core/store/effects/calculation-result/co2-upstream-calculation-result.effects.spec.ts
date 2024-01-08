import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { CO2UpstreamService } from '@ea/core/services/co2-upstream.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CO2UpstreamCalculationResultActions } from '../../actions';
import { ProductSelectionFacade } from '../../facades/product-selection/product-selection.facade';
import { CO2UpstreamCalculationResultEffects } from './co2-upstream-calculation-result.effects';

const co2UpstreamServiceMock = {
  getCO2UpstreamForDesignation: jest.fn(),
};

describe('CO2 Upstream Calculation Result Effects', () => {
  let action: any;
  let actions$: any;
  let effects: CO2UpstreamCalculationResultEffects;
  let spectator: SpectatorService<CO2UpstreamCalculationResultEffects>;

  const createService = createServiceFactory({
    service: CO2UpstreamCalculationResultEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: CO2UpstreamService,
        useValue: co2UpstreamServiceMock,
      },

      {
        provide: ProductSelectionFacade,
        useValue: {
          bearingDesignation$: of('bearing-123'),
          isBearingSupported$: of(true),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CO2UpstreamCalculationResultEffects);
  });

  describe('fetchResult', () => {
    beforeEach(() => {
      co2UpstreamServiceMock.getCO2UpstreamForDesignation.mockReset();
    });
    it('should fetch the result for a supported bearing', () => {
      const fetchSpy = jest
        .spyOn(co2UpstreamServiceMock, 'getCO2UpstreamForDesignation')
        .mockImplementation(() => of('result-from-service'));

      return marbles((m) => {
        action = CO2UpstreamCalculationResultActions.fetchResult();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: CO2UpstreamCalculationResultActions.setCalculationResult({
            calculationResult: 'result-from-service' as any,
          }),
        });

        m.expect(effects.fetchResult$).toBeObservable(expected);
        m.flush();

        expect(fetchSpy).toHaveBeenCalled();
      })();
    });
  });
});
