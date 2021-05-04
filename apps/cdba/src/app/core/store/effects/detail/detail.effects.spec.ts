import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';

import { SnackBarService } from '@schaeffler/snackbar';

import { DetailService } from '@cdba/detail/service/detail.service';
import { BomIdentifier, ReferenceTypeIdentifier } from '@cdba/shared/models';
import {
  BOM_MOCK,
  CALCULATIONS_MOCK,
  DRAWINGS_MOCK,
  REFERENCE_TYPE_IDENTIFIER_MOCK,
  REFERENCE_TYPE_MOCK,
} from '@cdba/testing/mocks';

import {
  loadBom,
  loadBomFailure,
  loadBomSuccess,
  loadCalculations,
  loadCalculationsFailure,
  loadCalculationsSuccess,
  loadDrawings,
  loadDrawingsFailure,
  loadDrawingsSuccess,
  loadReferenceType,
  loadReferenceTypeFailure,
  loadReferenceTypeSuccess,
  selectCalculation,
  selectReferenceType,
} from '../../actions';
import { ReferenceTypeResult } from '../../reducers/detail/models';
import {
  getBomIdentifierForSelectedCalculation,
  getSelectedReferenceTypeIdentifier,
} from '../../selectors/details/detail.selector';
import { DetailEffects } from './detail.effects';

describe('Detail Effects', () => {
  let spectator: SpectatorService<DetailEffects>;
  let action: any;
  let actions$: any;
  let effects: DetailEffects;
  let detailService: DetailService;
  let store: any;
  let router: Router;
  let snackbarService: SnackBarService;

  const errorMessage = 'An error occured';

  const createService = createServiceFactory({
    service: DetailEffects,
    imports: [RouterTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      mockProvider(DetailService),
      mockProvider(SnackBarService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(DetailEffects);
    detailService = spectator.inject(DetailService);
    store = spectator.inject(MockStore);
    router = spectator.inject(Router);
    snackbarService = spectator.inject(SnackBarService);
  });

  describe('loadReferenceType$', () => {
    beforeEach(() => {
      action = loadReferenceType();

      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    test('should return Success Action', () => {
      actions$ = hot('-a', { a: action });

      const item = new ReferenceTypeResult(REFERENCE_TYPE_MOCK);

      const response = cold('-a|', {
        a: item,
      });
      detailService.getDetails = jest.fn(() => response);

      const result = loadReferenceTypeSuccess({ item });
      const expected = cold('--b', { b: result });

      expect(effects.loadReferenceType$).toBeObservable(expected);
      expect(detailService.getDetails).toHaveBeenCalledTimes(1);
      expect(snackbarService.showInfoMessage).not.toHaveBeenCalled();
    });

    test('should call showInfoMessage', () => {
      actions$ = hot('-a', { a: action });

      const item = new ReferenceTypeResult({
        ...REFERENCE_TYPE_MOCK,
        isPcmRow: true,
      });

      const response = cold('-a|', {
        a: item,
      });
      detailService.getDetails = jest.fn(() => response);

      const result = loadReferenceTypeSuccess({ item });
      const expected = cold('--b', { b: result });

      expect(effects.loadReferenceType$).toBeObservable(expected);
      expect(snackbarService.showInfoMessage).toHaveBeenCalled();
    });

    test('should return Failure Action', () => {
      actions$ = hot('-a', { a: action });

      const result = loadReferenceTypeFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      detailService.getDetails = jest.fn(() => response);

      expect(effects.loadReferenceType$).toBeObservable(expected);
      expect(detailService.getDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadCalculations$', () => {
    beforeEach(() => {
      action = loadCalculations();

      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    test('should return Success Action', () => {
      actions$ = hot('-a', { a: action });

      const items = CALCULATIONS_MOCK;

      const response = cold('-a|', {
        a: items,
      });
      detailService.calculations = jest.fn(() => response);

      const result = loadCalculationsSuccess({ items });
      const expected = cold('--b', { b: result });

      expect(effects.loadCalculations$).toBeObservable(expected);
      expect(detailService.calculations).toHaveBeenCalledTimes(1);
    });

    test('should return Failure Action', () => {
      actions$ = hot('-a', { a: action });

      const result = loadCalculationsFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      detailService.calculations = jest.fn(() => response);

      expect(effects.loadCalculations$).toBeObservable(expected);
      expect(detailService.calculations).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadDrawings$', () => {
    beforeEach(() => {
      action = loadDrawings();

      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    test('should return Success Action', () => {
      actions$ = hot('-a', { a: action });

      const items = DRAWINGS_MOCK;

      const response = cold('-a|', {
        a: items,
      });
      detailService.getDrawings = jest.fn(() => response);

      const result = loadDrawingsSuccess({ items });
      const expected = cold('--b', { b: result });

      expect(effects.loadDrawings$).toBeObservable(expected);
      expect(detailService.getDrawings).toHaveBeenCalledTimes(1);
    });

    test('should return Failure Action', () => {
      actions$ = hot('-a', { a: action });

      const result = loadDrawingsFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      detailService.getDrawings = jest.fn(() => response);

      expect(effects.loadDrawings$).toBeObservable(expected);
      expect(detailService.getDrawings).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadBom$', () => {
    beforeEach(() => {
      action = loadBom();

      const bomIdentifier = new BomIdentifier(
        '20200604',
        'number',
        'type',
        'version',
        'yes',
        'ref',
        'var'
      );

      store.overrideSelector(
        getBomIdentifierForSelectedCalculation,
        bomIdentifier
      );
    });

    test('should return Success Action', () => {
      actions$ = hot('-a', { a: action });

      const items = BOM_MOCK;

      const response = cold('-a|', {
        a: items,
      });
      detailService.getBom = jest.fn(() => response);

      const result = loadBomSuccess({ items });
      const expected = cold('--b', { b: result });

      expect(effects.loadBom$).toBeObservable(expected);
      expect(detailService.getBom).toHaveBeenCalledTimes(1);
    });

    test('should return Failure Action', () => {
      actions$ = hot('-a', { a: action });

      const result = loadBomFailure({ errorMessage });

      const response = cold('-#|', undefined, errorMessage);
      const expected = cold('--b', { b: result });

      detailService.getBom = jest.fn(() => response);

      expect(effects.loadBom$).toBeObservable(expected);
      expect(detailService.getBom).toHaveBeenCalledTimes(1);
    });
  });

  describe('triggerBomLoad$', () => {
    const result = loadBom();

    test('should return loadBom Action when a new calculation was selected', () => {
      action = selectCalculation({
        nodeId: '5',
        calculation: CALCULATIONS_MOCK[0],
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('-b', { b: result });

      expect(effects.triggerBomLoad$).toBeObservable(expected);
    });

    test('should return loadBom Action when calculation were loaded successfully', () => {
      action = loadCalculationsSuccess({
        items: CALCULATIONS_MOCK,
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('-b', { b: result });

      expect(effects.triggerBomLoad$).toBeObservable(expected);
    });
  });

  describe('triggerDataLoad$', () => {
    test('should return loadRefType, loadCalculations and loadDrawings Action', () => {
      action = selectReferenceType({
        referenceTypeIdentifier: REFERENCE_TYPE_IDENTIFIER_MOCK,
      });

      actions$ = hot('-a', { a: action });

      const expected = cold('-(bcd)', {
        b: loadReferenceType(),
        c: loadCalculations(),
        d: loadDrawings(),
      });

      expect(effects.triggerDataLoad$).toBeObservable(expected);
    });
  });

  describe('selectReferenceType$', () => {
    beforeEach(() => {
      store.overrideSelector(
        getSelectedReferenceTypeIdentifier,
        REFERENCE_TYPE_IDENTIFIER_MOCK
      );
    });

    xtest('should return select referenceTypeAction', () => {
      action = {
        type: ROUTER_NAVIGATED,
        payload: {
          routerState: {
            url: '/detail/details',
            queryParams: {
              material_number: '456789',
              plant: '0060',
              identification_hash: 'identifier',
            },
          },
        },
      };

      actions$ = hot('-a', { a: action });

      const referenceTypeIdentifier = new ReferenceTypeIdentifier(
        '456789',
        '0060',
        'identifier'
      );

      const result = selectReferenceType({ referenceTypeIdentifier });
      const expected = cold('-b', { b: result });

      expect(effects.selectReferenceType$).toBeObservable(expected);
    });

    test('should navigate to not-found if URL is not valid', () => {
      router.navigate = jest.fn();
      action = {
        type: ROUTER_NAVIGATED,
        payload: {
          routerState: {
            url: '/detail/details',
            queryParams: {
              material_number: '456789',
            },
          },
        },
      };

      actions$ = hot('-a', { a: action });
      const expected = cold('---');

      expect(effects.selectReferenceType$).toBeObservable(expected);
      expect(router.navigate).toHaveBeenCalledWith(['not-found']);
    });
  });

  describe('DetailsEffects.mapQueryParamsToIdentifier', () => {
    let queryParams;

    test('should return undefined, if mandatory params are missing', () => {
      queryParams = { material_number: '23', rfq: '2341' };

      expect(
        DetailEffects['mapQueryParamsToIdentifier'](queryParams)
      ).toBeUndefined();
    });

    test('should return RefTypeIdentifier', () => {
      queryParams = {
        material_number: '23',
        plant: '0060',
        identification_hash: 'identification',
      };

      expect(DetailEffects['mapQueryParamsToIdentifier'](queryParams)).toEqual({
        materialNumber: '23',
        plant: '0060',
        identificationHash: 'identification',
      });
    });
  });

  describe('DetailsEffects.checkEqualityOfIdentifier', () => {
    let fromRoute;
    let current;
    let result;

    beforeEach(() => {
      fromRoute = undefined;
      current = undefined;
      result = undefined;
    });

    test('should return false, if current value is undefined', () => {
      fromRoute = REFERENCE_TYPE_IDENTIFIER_MOCK;
      current = undefined;

      result = DetailEffects['checkEqualityOfIdentifier'](fromRoute, current);

      expect(result).toBeFalsy();
    });

    test('should return false, if one value differs', () => {
      fromRoute = REFERENCE_TYPE_IDENTIFIER_MOCK;
      current = {
        ...REFERENCE_TYPE_IDENTIFIER_MOCK,
        identificationHash: 'new id',
      };

      result = DetailEffects['checkEqualityOfIdentifier'](fromRoute, current);

      expect(result).toBeFalsy();
    });
  });
});
// eslint-disable-next-line max-lines
