import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { cold, hot } from 'jasmine-marbles';

import {
  loadMaterialInformation,
  loadMaterialInformationFailure,
  loadMaterialInformationSuccess,
  setSelectedQuotationDetail,
} from '../..';
import { DETAIL_IDENTIFIERS_MOCK } from '../../../../../testing/mocks';
import { DETAIL_CASE_MOCK } from '../../../../../testing/mocks/detail-case.mock';
import { MaterialDetailsService } from '../../../../detail-view/services/material-details.service';
import { DetailCaseEffects } from './detail-case.effects';

describe('Create Case Effects', () => {
  let spectator: SpectatorService<DetailCaseEffects>;

  let action: any;
  let actions$: any;
  let effects: DetailCaseEffects;
  let materialDetailsService: MaterialDetailsService;
  let router: Router;

  const createService = createServiceFactory({
    service: DetailCaseEffects,
    imports: [RouterTestingModule.withRoutes([])],
    providers: [
      provideMockActions(() => actions$),
      {
        provide: MaterialDetailsService,
        useValue: {
          loadMaterials: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(DetailCaseEffects);
    materialDetailsService = spectator.inject(MaterialDetailsService);
    router = spectator.inject(Router);
  });

  describe('getMaterial$', () => {
    test('should return loadMaterialInformation', () => {
      action = {
        type: ROUTER_NAVIGATED,
        payload: {
          routerState: {
            url: '/detail-view',
            queryParams: {
              materialNumber15: DETAIL_IDENTIFIERS_MOCK.materialNumber15,
              gqPositionId: DETAIL_IDENTIFIERS_MOCK.gqPositionId,
            },
          },
        },
      };

      actions$ = hot('-a', { a: action });

      const result1 = loadMaterialInformation({
        materialNumber15: DETAIL_IDENTIFIERS_MOCK.materialNumber15,
      });
      const result2 = setSelectedQuotationDetail({
        gqPositionId: DETAIL_IDENTIFIERS_MOCK.gqPositionId,
      });

      const expected = cold('-(bc)', { b: result1, c: result2 });

      expect(effects.getMaterial$).toBeObservable(expected);
    });

    test('should navigate to not-found if URL is not valid', () => {
      router.navigate = jest.fn();
      action = {
        type: ROUTER_NAVIGATED,
        payload: {
          routerState: {
            url: '/detail-view',
            queryParams: {
              any_number: '456789',
            },
          },
        },
      };

      actions$ = hot('-a', { a: action });
      const expected = cold('---');

      expect(effects.getMaterial$).toBeObservable(expected);
      expect(router.navigate).toHaveBeenCalledWith(['not-found']);
    });
  });

  describe('loadMaterial$', () => {
    beforeEach(() => {
      action = loadMaterialInformation(DETAIL_IDENTIFIERS_MOCK);
    });

    test('should return loadMaterialSuccess when REST Call is successful', () => {
      materialDetailsService.loadMaterials = jest.fn(() => response);
      const materialDetails = DETAIL_CASE_MOCK;
      const result = loadMaterialInformationSuccess({ materialDetails });

      actions$ = hot('-a', { a: action });

      const response = cold('-a|', {
        a: materialDetails,
      });

      const expected = cold('--b', { b: result });

      expect(effects.loadMaterialInformation$).toBeObservable(expected);
      expect(materialDetailsService.loadMaterials).toHaveBeenCalledTimes(1);
      expect(materialDetailsService.loadMaterials).toHaveBeenCalledWith(
        DETAIL_IDENTIFIERS_MOCK.materialNumber15
      );
    });

    test('should return loadMaterialFailure on REST error', () => {
      actions$ = hot('-a', { a: action });
      const errorMessage = ' error';
      const result = loadMaterialInformationFailure({ errorMessage });
      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      materialDetailsService.loadMaterials = jest.fn(() => response);

      expect(effects.loadMaterialInformation$).toBeObservable(expected);
      expect(materialDetailsService.loadMaterials).toHaveBeenCalledTimes(1);
    });
  });
});
