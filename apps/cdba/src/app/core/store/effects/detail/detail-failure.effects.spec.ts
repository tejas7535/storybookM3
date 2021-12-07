import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpErrorService } from '@cdba/core/http/services/http-error.service';
import { COMPARE_STATE_MOCK } from '@cdba/testing/mocks';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions, EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  loadBomFailure,
  loadCalculationsFailure,
  loadDrawingsFailure,
  loadReferenceTypeFailure,
} from '../../actions';
import { DetailFailureEffects } from './detail-failure.effects';

describe('DetailFailureEffects', () => {
  let spectator: SpectatorService<DetailFailureEffects>;
  let actions$: any;
  let effects: DetailFailureEffects;
  let metadata: EffectsMetadata<DetailFailureEffects>;
  let httpErrorService: HttpErrorService;
  let router: Router;

  const forbiddenError = JSON.stringify(new HttpErrorResponse({ status: 403 }));
  const serverError = JSON.stringify(new HttpErrorResponse({ status: 500 }));

  const createService = createServiceFactory({
    service: DetailFailureEffects,
    imports: [RouterTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          compare: COMPARE_STATE_MOCK,
        },
      }),
      mockProvider(HttpErrorService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(DetailFailureEffects);
    metadata = getEffectsMetadata(effects);
    httpErrorService = spectator.inject(HttpErrorService);
    router = spectator.inject(Router);
  });

  test('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadFailure$', () => {
    test('should not return an action', () => {
      expect(metadata.loadFailure$).toEqual({
        dispatch: false,
        useEffectsErrorHandler: true,
      });
    });

    test(
      'should navigate to forbidden page',
      marbles((m) => {
        router.navigate = jest.fn().mockImplementation();

        const loadBomForbiddenFailureAction = loadBomFailure({
          error: forbiddenError,
        });
        const loadCalculationsForbiddenFailureAction = loadCalculationsFailure({
          error: forbiddenError,
        });
        const loadDrawingsForbiddenFailureAction = loadDrawingsFailure({
          error: forbiddenError,
        });
        const loadReferenceTypeForbiddenFailureAction =
          loadReferenceTypeFailure({ error: forbiddenError });

        actions$ = m.hot('-a-b-c-d', {
          a: loadBomForbiddenFailureAction,
          b: loadCalculationsForbiddenFailureAction,
          c: loadDrawingsForbiddenFailureAction,
          d: loadReferenceTypeForbiddenFailureAction,
        });

        m.expect(effects.loadFailure$).toBeObservable(actions$);
        m.flush();
        expect(router.navigate).toBeCalledTimes(4);
        expect(router.navigate).toHaveBeenCalledWith([
          'empty-states',
          'forbidden',
        ]);
      })
    );

    test(
      'should call default error service',
      marbles((m) => {
        httpErrorService.handleHttpErrorDefault = jest.fn();

        const loadBomServerFailureAction = loadBomFailure({
          error: serverError,
        });
        const loadCalculationsServerFailureAction = loadCalculationsFailure({
          error: serverError,
        });
        const loadDrawingsServerFailureAction = loadDrawingsFailure({
          error: serverError,
        });
        const loadReferenceTypeServernFailureAction = loadReferenceTypeFailure({
          error: serverError,
        });

        actions$ = m.hot('-a-b-c-d', {
          a: loadBomServerFailureAction,
          b: loadCalculationsServerFailureAction,
          c: loadDrawingsServerFailureAction,
          d: loadReferenceTypeServernFailureAction,
        });

        m.expect(effects.loadFailure$).toBeObservable(actions$);
        m.flush();
        expect(httpErrorService.handleHttpErrorDefault).toBeCalledTimes(4);
        expect(httpErrorService.handleHttpErrorDefault).toHaveBeenCalled();
      })
    );
  });
});
