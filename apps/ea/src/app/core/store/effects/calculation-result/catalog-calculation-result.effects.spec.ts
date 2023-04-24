import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { CatalogService } from '@ea/core/services/catalog.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CatalogCalculationResultActions } from '../../actions';
import { ProductSelectionFacade } from '../../facades/product-selection/product-selection.facade';
import { CatalogCalculationResultEffects } from './catalog-calculation-result.effects';

const CatalogServiceMock = {
  getBasicFrequencies: jest.fn(),
};

describe('Catalog Calculation Result Effects', () => {
  let action: any;
  let actions$: any;
  let effects: CatalogCalculationResultEffects;
  let spectator: SpectatorService<CatalogCalculationResultEffects>;

  const createService = createServiceFactory({
    service: CatalogCalculationResultEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({}),
      {
        provide: CatalogService,
        useValue: CatalogServiceMock,
      },

      {
        provide: ProductSelectionFacade,
        useValue: {
          bearingDesignation$: of('bearing-123'),
          bearingId$: of('bearing-123'),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(CatalogCalculationResultEffects);
  });

  describe('getBasicFrequencies', () => {
    beforeEach(() => {
      CatalogServiceMock.getBasicFrequencies.mockReset();
    });
    it('should fetch the basic frequencies', () => {
      const fetchSpy = jest
        .spyOn(CatalogServiceMock, 'getBasicFrequencies')
        .mockImplementation(() => of('result-from-service'));

      return marbles((m) => {
        action = CatalogCalculationResultActions.fetchBasicFrequencies();
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: CatalogCalculationResultActions.setBasicFrequenciesResult({
            basicFrequenciesResult: 'result-from-service' as any,
          }),
        });

        m.expect(effects.fetchBasicFrequencies$).toBeObservable(expected);
        m.flush();

        expect(fetchSpy).toHaveBeenCalled();
      })();
    });
  });
});
