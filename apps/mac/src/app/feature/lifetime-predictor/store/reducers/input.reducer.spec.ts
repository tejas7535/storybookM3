import { ChartType } from '../../enums';
import * as InputActions from '../actions/input.actions';
import { initialState, inputReducer } from './input.reducer';

describe('inputReducer', () => {
  describe('reducer', () => {
    let state: any;
    beforeEach(() => {
      state = {
        predictions: [],
        burdeningTypes: [],
        materials: [],
        selectedMaterial: undefined,
        display: {
          showMurakami: false,
          showFKM: false,
          showStatistical: false,
          chartType: ChartType.Woehler,
          bannerOpen: false,
        },
      };
    });

    it('should return initial state on unknown action / state', () => {
      const action: any = {};
      const newState = inputReducer(undefined, action);

      expect(newState).toEqual(state);
    });

    it('should set state on setMaterial', () => {
      const mockSelectedMaterial = 'Schrott';

      const newState = inputReducer(
        state,
        InputActions.setMaterial({ selectedMaterial: mockSelectedMaterial })
      );
      expect(newState.selectedMaterial).toEqual(mockSelectedMaterial);
    });

    it('should set state on setMaterialOptions', () => {
      const mockMaterial = [
        { name: 'plastik', heatTreatment: 'volleHitze', hardness: 90_001 },
      ];

      const newState = inputReducer(
        state,
        InputActions.setMaterialOptions({ materials: mockMaterial })
      );
      expect(newState.materials).toEqual(mockMaterial);
    });

    it('should set state on setPredictionOptions', () => {
      const mockPredictions = [
        { id: 0, name: 'gehypermockteprediction' },
        { id: 1, name: 'gehypermockteprediction2' },
      ];

      const newState = inputReducer(
        state,
        InputActions.setPredictionOptions({ predictions: mockPredictions })
      );
      expect(newState.predictions).toEqual(mockPredictions);
    });

    it('should set state on setBurdeningTypeOptions', () => {
      const mockBurdeningTypes = [{ id: 0, name: 'wasistdasüberhaupt' }];

      const newState = inputReducer(
        state,
        InputActions.setBurdeningTypeOptions({
          burdeningTypes: mockBurdeningTypes,
        })
      );
      expect(newState.burdeningTypes).toEqual(mockBurdeningTypes);
    });

    it('should set state on setBurdeningTypeOptions', () => {
      const mockDisplay = {
        showFKM: true,
        showMurakami: false,
        showStatistical: false,
        chartType: ChartType.Woehler,
        bannerOpen: false,
      };

      const newState = inputReducer(
        state,
        InputActions.setDisplay({ display: mockDisplay })
      );
      expect(newState.display).toEqual(mockDisplay);
    });

    it('should unset state on unsetDisplay', () => {
      const mockDisplay = {
        showFKM: true,
        showMurakami: false,
        showStatistical: false,
        chartType: ChartType.Woehler,
        bannerOpen: false,
      };

      let newState = inputReducer(
        state,
        InputActions.setDisplay({ display: mockDisplay })
      );

      newState = inputReducer(state, InputActions.unsetDisplay());
      expect(newState.display).toEqual(initialState.display);
    });

    it('should set state on setBannerVisible', () => {
      const mockDisplay = {
        showFKM: false,
        showMurakami: false,
        showStatistical: false,
        chartType: ChartType.Woehler,
        bannerOpen: true,
      };

      const newState = inputReducer(
        state,
        InputActions.setBannerVisible({ bannerOpen: true })
      );
      expect(newState.display).toEqual(mockDisplay);
    });

    it('should set state on setChartType', () => {
      const mockChartType = { chartType: ChartType.Woehler };

      const newState = inputReducer(
        state,
        InputActions.setChartType({ chartType: mockChartType.chartType })
      );
      expect(newState.display).toEqual({
        ...initialState.display,
        ...mockChartType,
      });
    });
  });
});
