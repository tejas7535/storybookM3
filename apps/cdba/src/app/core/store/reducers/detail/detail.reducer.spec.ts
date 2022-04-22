import { ReferenceTypeIdentifier } from '@cdba/shared/models';
import {
  BOM_IDENTIFIER_MOCK,
  BOM_ODATA_MOCK,
  CALCULATIONS_MOCK,
  DRAWINGS_MOCK,
  EXCLUDED_CALCULATIONS_MOCK,
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
  selectBomItem,
  selectCalculation,
  selectCalculations,
  selectDrawing,
  selectReferenceType,
} from '../../actions';
import { detailReducer, initialState } from './detail.reducer';
import { CalculationsResponse } from './models';

describe('Detail Reducer', () => {
  const fakeState = {
    ...initialState,
    detail: {
      ...initialState.detail,
      loading: true,
    },
    calculations: {
      ...initialState.calculations,
      loading: true,
    },
  };
  const errorMessage = 'An error occured';

  const referenceTypeIdentifier: ReferenceTypeIdentifier =
    REFERENCE_TYPE_IDENTIFIER_MOCK;

  describe('selectReferenceType', () => {
    test('should set selectedReferenceType', () => {
      const action = selectReferenceType({ referenceTypeIdentifier });
      const state = detailReducer(initialState, action);

      expect(state.selectedReferenceType).toEqual(referenceTypeIdentifier);
    });
  });

  describe('loadReferenceType', () => {
    test('should set loading', () => {
      const action = loadReferenceType();
      const state = detailReducer(initialState, action);

      expect(state.detail.loading).toBeTruthy();
    });

    test('should set reset previous reference type', () => {
      const mockState = {
        ...fakeState,
        detail: { ...fakeState.detail, referenceType: REFERENCE_TYPE_MOCK },
      };
      const action = loadReferenceType();
      const state = detailReducer(mockState, action);

      expect(state.detail.referenceType).toBeUndefined();
    });

    test('should reset previous error', () => {
      const mockState = {
        ...fakeState,
        detail: { ...fakeState.detail, errorMessage },
      };
      const action = loadReferenceType();
      const state = detailReducer(mockState, action);

      expect(state.detail.errorMessage).toBeUndefined();
    });
  });

  describe('loadReferenceTypeSuccess', () => {
    test('should unset loading and set ref types', () => {
      const referenceType = REFERENCE_TYPE_MOCK;

      const action = loadReferenceTypeSuccess({ referenceType });

      const state = detailReducer(fakeState, action);

      expect(state.detail.loading).toBeFalsy();
      expect(state.detail.referenceType).toEqual(referenceType);
      expect(state.detail.errorMessage).toBeUndefined();
    });
  });

  describe('loadReferenceTypeFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadReferenceTypeFailure({
        errorMessage,
        statusCode: 400,
      });

      const state = detailReducer(fakeState, action);

      expect(state.detail.loading).toBeFalsy();
      expect(state.detail.errorMessage).toEqual(errorMessage);
    });
  });

  describe('loadCalculations', () => {
    test('should set loading of calculations and bom', () => {
      const action = loadCalculations();
      const state = detailReducer(initialState, action);

      expect(state.calculations.loading).toBeTruthy();
      expect(state.bom.loading).toBeTruthy();
    });

    test('should reset calculations state', () => {
      const action = loadCalculations();
      const state = detailReducer(initialState, action);

      expect(state.calculations.items).toBeUndefined();
      expect(state.calculations.selectedCalculation).toBeUndefined();
      expect(state.calculations.errorMessage).toBeUndefined();
    });
  });

  describe('loadCalculationsSuccess', () => {
    test('should unset loading and set calculations', () => {
      const item = new CalculationsResponse(
        CALCULATIONS_MOCK,
        EXCLUDED_CALCULATIONS_MOCK
      );

      const action = loadCalculationsSuccess({
        calculations: item.items,
        excludedCalculations: item.excludedItems,
      });

      const state = detailReducer(fakeState, action);

      expect(state.detail.loading).toBeTruthy();
      expect(state.calculations.loading).toBeFalsy();
      expect(state.calculations.items).toEqual(item.items);
    });

    test('should select the first calculation', () => {
      const item = new CalculationsResponse(
        CALCULATIONS_MOCK,
        EXCLUDED_CALCULATIONS_MOCK
      );

      const action = loadCalculationsSuccess({
        calculations: item.items,
        excludedCalculations: item.excludedItems,
      });

      const state = detailReducer(fakeState, action);

      expect(state.calculations.selectedCalculation.nodeId).toEqual('0');
      expect(state.calculations.selectedCalculation.calculation).toEqual(
        CALCULATIONS_MOCK[0]
      );
    });
  });

  describe('loadCalculationsFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadCalculationsFailure({ errorMessage, statusCode: 500 });

      const state = detailReducer(fakeState, action);

      expect(state.calculations.loading).toBeFalsy();
      expect(state.calculations.errorMessage).toEqual(errorMessage);
    });
  });

  describe('selectCalculation', () => {
    test('should set new selected calculation', () => {
      const nodeId = '7';
      const calculation = CALCULATIONS_MOCK[7];
      const action = selectCalculation({ nodeId, calculation });

      const state = detailReducer(fakeState, action);

      expect(state.calculations.selectedCalculation.nodeId).toEqual(nodeId);
      expect(state.calculations.selectedCalculation.calculation).toEqual(
        calculation
      );
    });
  });

  describe('loadDrawings', () => {
    test('should set loading of drawings', () => {
      const action = loadDrawings();
      const state = detailReducer(initialState, action);

      expect(state.drawings.loading).toBeTruthy();
    });

    test('should reset drawings state', () => {
      const action = loadDrawings();
      const state = detailReducer(initialState, action);

      expect(state.drawings.items).toBeUndefined();
      expect(state.drawings.selected).toBeUndefined();
      expect(state.drawings.errorMessage).toBeUndefined();
    });
  });

  describe('loadDrawingsSuccess', () => {
    test('should unset loading and set drawings', () => {
      const items = DRAWINGS_MOCK;
      const action = loadDrawingsSuccess({ items });

      const state = detailReducer(fakeState, action);

      expect(state.drawings.loading).toBeFalsy();
      expect(state.drawings.items).toEqual(items);
    });

    test('should select the first drawing', () => {
      const items = DRAWINGS_MOCK;
      const action = loadDrawingsSuccess({ items });

      const state = detailReducer(fakeState, action);

      expect(state.drawings.selected.nodeId).toEqual('0');
      expect(state.drawings.selected.drawing).toEqual(DRAWINGS_MOCK[0]);
    });
  });

  describe('loadDrawingsFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadDrawingsFailure({ errorMessage, statusCode: 404 });

      const state = detailReducer(fakeState, action);

      expect(state.drawings.loading).toBeFalsy();
      expect(state.drawings.errorMessage).toEqual(errorMessage);
    });
  });

  describe('selectDrawing', () => {
    test('should set new selected drawing', () => {
      const nodeId = '4';
      const drawing = DRAWINGS_MOCK[4];
      const action = selectDrawing({ nodeId, drawing });

      const state = detailReducer(fakeState, action);

      expect(state.drawings.selected.nodeId).toEqual(nodeId);
      expect(state.drawings.selected.drawing).toEqual(drawing);
    });
  });

  describe('loadBom', () => {
    const bomIdentifier = BOM_IDENTIFIER_MOCK;
    test('should set loading', () => {
      const action = loadBom({ bomIdentifier });
      const state = detailReducer(initialState, action);

      expect(state.bom.loading).toBeTruthy();
    });

    test('should reset bom state', () => {
      const action = loadBom({ bomIdentifier });
      const state = detailReducer(initialState, action);

      expect(state.bom.items).toBeUndefined();
      expect(state.bom.errorMessage).toBeUndefined();
    });
  });

  describe('loadBomSuccess', () => {
    test('should unset loading and set bom items', () => {
      const items = BOM_ODATA_MOCK;

      const action = loadBomSuccess({ items });

      const state = detailReducer(fakeState, action);

      expect(state.bom.loading).toBeFalsy();
      expect(state.bom.items).toEqual(items);
    });
  });

  describe('loadBomFailure', () => {
    test('should unset loading / set error message', () => {
      const action = loadBomFailure({ errorMessage, statusCode: 418 });

      const state = detailReducer(fakeState, action);

      expect(state.bom.loading).toBeFalsy();
      expect(state.bom.errorMessage).toEqual(errorMessage);
    });
  });

  describe('selectBomItem', () => {
    test('should set selected Bom Item', () => {
      const item = BOM_ODATA_MOCK[0];
      const action = selectBomItem({ item });

      const state = detailReducer(fakeState, action);

      expect(state.bom.selectedItem).toEqual(BOM_ODATA_MOCK[0]);
    });
  });

  describe('selectCalculations', () => {
    test('should set selected calculation node ids', () => {
      const nodeIds = ['1', '6'];
      const action = selectCalculations({ nodeIds });

      const state = detailReducer(fakeState, action);

      expect(state.calculations.selectedNodeIds).toEqual(nodeIds);
    });
  });
});
