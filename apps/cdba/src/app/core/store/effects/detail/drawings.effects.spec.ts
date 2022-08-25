import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/jest';

import { DetailService } from '@cdba/detail/service/detail.service';
import {
  AUTH_STATE_MOCK,
  DRAWINGS_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
} from '@cdba/testing/mocks';

import {
  loadDrawings,
  loadDrawingsFailure,
  loadDrawingsSuccess,
  selectReferenceType,
} from '../../actions';
import { getSelectedReferenceTypeIdentifier } from '../../selectors';
import { DrawingsEffects } from './drawings.effects';

describe('DrawingsEffects', () => {
  let spectator: SpectatorService<DrawingsEffects>;
  let action: any;
  let actions$: any;
  let effects: DrawingsEffects;
  let detailService: DetailService;
  let store: MockStore;

  const error = new HttpErrorResponse({
    status: HttpStatusCode.BadRequest,
    error: { detail: 'Error Message' },
  });

  const createService = createServiceFactory({
    service: DrawingsEffects,
    imports: [],
    providers: [
      mockProvider(DetailService),
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(DrawingsEffects);
    detailService = spectator.inject(DetailService);
    store = spectator.inject(MockStore);
  });

  describe('loadDrawings$', () => {
    beforeEach(() => {
      action = loadDrawings();

      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    test(
      'should return Success Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const items = DRAWINGS_MOCK;

        const response = m.cold('-a|', {
          a: items,
        });
        detailService.getDrawings = jest.fn(() => response);

        const result = loadDrawingsSuccess({ items });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.loadDrawings$).toBeObservable(expected);
        m.flush();
        expect(detailService.getDrawings).toHaveBeenCalled();
      })
    );

    test(
      'should return Failure Action',
      marbles((m) => {
        actions$ = m.hot('-a', { a: action });

        const result = loadDrawingsFailure({
          errorMessage: 'Error Message',
          statusCode: 400,
        });

        const response = m.cold('-#|', undefined, error);
        const expected = m.cold('--b', { b: result });

        detailService.getDrawings = jest.fn(() => response);

        m.expect(effects.loadDrawings$).toBeObservable(expected);
        m.flush();
        expect(detailService.getDrawings).toHaveBeenCalled();
      })
    );
  });

  describe('triggerDataLoad$', () => {
    test(
      'should return loadRefType, loadCalculations and loadDrawings Action',
      marbles((m) => {
        action = selectReferenceType({
          referenceTypeIdentifier: REFERENCE_TYPE_IDENTIFIER_MOCK,
        });

        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', {
          b: loadDrawings(),
        });

        m.expect(effects.triggerDataLoad$).toBeObservable(expected);
      })
    );
  });
});
