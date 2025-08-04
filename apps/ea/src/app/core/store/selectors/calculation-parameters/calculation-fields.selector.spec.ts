import {
  CATALOG_BEARING_TYPE,
  SLEWING_BEARING_TYPE,
} from '@ea/shared/constants/products';
import {
  CALCULATION_PARAMETERS_STATE_MOCK,
  PRODUCT_SELECTION_STATE_MOCK,
} from '@ea/testing/mocks';

import { getCalculationFieldsConfig } from './calculation-fields.selector';

describe('Calculation Fields Selector', () => {
  const mockState = {
    productSelection: {
      ...PRODUCT_SELECTION_STATE_MOCK,
    },
    calculationParameters: {
      ...CALCULATION_PARAMETERS_STATE_MOCK,
    },
  };

  describe('getCalculationFieldsConfig', () => {
    it('should return the fields config', () => {
      expect(
        getCalculationFieldsConfig({
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            co2DownstreamAvailable: true,
          },
        })
      ).toMatchSnapshot();
    });

    it('should return the fields config without downstream fields', () => {
      expect(
        getCalculationFieldsConfig({
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            co2DownstreamAvailable: false,
          },
        })
      ).toMatchSnapshot();
    });

    describe('Slewing Bearing specific tests', () => {
      const slewingBearingState = {
        ...mockState,
        productSelection: {
          ...mockState.productSelection,
          bearingProductClass: SLEWING_BEARING_TYPE,
          co2DownstreamAvailable: true,
        },
      };

      it('should return slewing bearing fields for rating life calculation', () => {
        const stateWithRatingLife = {
          ...slewingBearingState,
          calculationParameters: {
            ...slewingBearingState.calculationParameters,
            calculationTypes: {
              ...slewingBearingState.calculationParameters.calculationTypes,
              ratingLife: {
                disabled: false,
                selected: true,
                visible: true,
              },
            },
          },
        };

        const result = getCalculationFieldsConfig(stateWithRatingLife);

        expect(result.required).toContain('rotatingCondition');
        expect(result.required).toContain('time');
        expect(result.required).toContain('force');
        expect(result.required).toContain('moment');

        // Should not contain regular bearing fields for slewing bearings
        expect(result.required).not.toContain('load');
        expect(result.required).not.toContain('lubrication');
      });

      it('should return slewing bearing fields for emission calculation', () => {
        const stateWithEmission = {
          ...slewingBearingState,
          calculationParameters: {
            ...slewingBearingState.calculationParameters,
            calculationTypes: {
              ...slewingBearingState.calculationParameters.calculationTypes,
              emission: {
                disabled: false,
                selected: true,
                visible: true,
              },
            },
          },
        };

        const result = getCalculationFieldsConfig(stateWithEmission);

        expect(result.required).toContain('rotatingCondition');

        // Should not contain regular bearing emission fields
        expect(result.required).not.toContain('load');
        expect(result.preset).not.toContain('lubrication');
      });

      it('should handle empty slewing bearing field mappings', () => {
        const stateWithLubrication = {
          ...slewingBearingState,
          calculationParameters: {
            ...slewingBearingState.calculationParameters,
            calculationTypes: {
              // Clear all other calculation types
              emission: {
                disabled: false,
                selected: false,
                visible: false,
              },
              frictionalPowerloss: {
                disabled: false,
                selected: false,
                visible: false,
              },
              overrollingFrequency: {
                disabled: false,
                selected: false,
                visible: false,
              },
              ratingLife: {
                disabled: false,
                selected: false,
                visible: false,
              },
              lubrication: {
                disabled: false,
                selected: true,
                visible: true,
              },
            },
          },
        };

        const result = getCalculationFieldsConfig(stateWithLubrication);

        // Lubrication mapping is empty for slewing bearings
        expect(result.required).toEqual([]);
        expect(result.preset).toEqual([]);
      });

      it('should handle slewing bearing with CO2 downstream disabled', () => {
        const stateWithoutCO2 = {
          ...slewingBearingState,
          productSelection: {
            ...slewingBearingState.productSelection,
            co2DownstreamAvailable: false,
          },
          calculationParameters: {
            ...slewingBearingState.calculationParameters,
            calculationTypes: {
              ...slewingBearingState.calculationParameters.calculationTypes,
              ratingLife: {
                disabled: false,
                selected: true,
                visible: true,
              },
            },
          },
        };

        const result = getCalculationFieldsConfig(stateWithoutCO2);

        expect(result.required).toContain('rotatingCondition');
        expect(result.required).toContain('force');
        expect(result.required).toContain('moment');
        // time field should be filtered out when CO2 downstream is not available
        expect(result.required).not.toContain('time');
      });

      it('should handle multiple calculation types for slewing bearings', () => {
        const stateWithMultipleCalcs = {
          ...slewingBearingState,
          calculationParameters: {
            ...slewingBearingState.calculationParameters,
            calculationTypes: {
              ...slewingBearingState.calculationParameters.calculationTypes,
              ratingLife: {
                disabled: false,
                selected: true,
                visible: true,
              },
              emission: {
                disabled: false,
                selected: true,
                visible: true,
              },
            },
          },
        };

        const result = getCalculationFieldsConfig(stateWithMultipleCalcs);

        // Should combine fields from both calculation types
        expect(result.required).toContain('rotatingCondition');
        expect(result.required).toContain('time');
        expect(result.required).toContain('force');
        expect(result.required).toContain('moment');
      });
    });

    describe('Regular Bearing vs Slewing Bearing comparison', () => {
      const regularBearingState = {
        ...mockState,
        productSelection: {
          ...mockState.productSelection,
          bearingProductClass: CATALOG_BEARING_TYPE,
          co2DownstreamAvailable: true,
        },
        calculationParameters: {
          ...mockState.calculationParameters,
          calculationTypes: {
            ...mockState.calculationParameters.calculationTypes,
            ratingLife: {
              disabled: false,
              selected: true,
              visible: true,
            },
          },
        },
      };

      const slewingBearingStateComparison = {
        ...mockState,
        productSelection: {
          ...mockState.productSelection,
          bearingProductClass: SLEWING_BEARING_TYPE,
          co2DownstreamAvailable: true,
        },
        calculationParameters: {
          ...mockState.calculationParameters,
          calculationTypes: {
            ...mockState.calculationParameters.calculationTypes,
            ratingLife: {
              disabled: false,
              selected: true,
              visible: true,
            },
          },
        },
      };

      it('should return different fields for regular vs slewing bearings', () => {
        const regularResult = getCalculationFieldsConfig(regularBearingState);
        const slewingResult = getCalculationFieldsConfig(
          slewingBearingStateComparison
        );

        // Regular bearing should have load, slewing bearing should have force/moment
        expect(regularResult.required).toContain('load');
        expect(regularResult.required).toContain('rotatingCondition');
        expect(regularResult.required).not.toContain('force');
        expect(regularResult.required).not.toContain('moment');

        expect(slewingResult.required).toContain('rotatingCondition');
        expect(slewingResult.required).toContain('force');
        expect(slewingResult.required).toContain('moment');
        expect(slewingResult.required).toContain('time');
        expect(slewingResult.required).not.toContain('load');
      });
    });

    describe('Edge cases and field filtering', () => {
      it('should skip non-selected calculation types', () => {
        const stateWithUnselected = {
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            bearingProductClass: SLEWING_BEARING_TYPE,
          },
          calculationParameters: {
            ...mockState.calculationParameters,
            calculationTypes: {
              // All calculation types are not selected
              emission: {
                disabled: false,
                selected: false,
                visible: true,
              },
              frictionalPowerloss: {
                disabled: false,
                selected: false,
                visible: true,
              },
              overrollingFrequency: {
                disabled: false,
                selected: false,
                visible: true,
              },
              ratingLife: {
                disabled: false,
                selected: false,
                visible: true,
              },
              lubrication: {
                disabled: false,
                selected: false,
                visible: true,
              },
            },
          },
        };

        const result = getCalculationFieldsConfig(stateWithUnselected);

        expect(result.required).toEqual([]);
        expect(result.preset).toEqual([]);
      });

      it('should skip non-visible calculation types', () => {
        const stateWithInvisible = {
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            bearingProductClass: SLEWING_BEARING_TYPE,
          },
          calculationParameters: {
            ...mockState.calculationParameters,
            calculationTypes: {
              // All calculation types are not visible
              emission: {
                disabled: false,
                selected: true,
                visible: false,
              },
              frictionalPowerloss: {
                disabled: false,
                selected: true,
                visible: false,
              },
              overrollingFrequency: {
                disabled: false,
                selected: true,
                visible: false,
              },
              ratingLife: {
                disabled: false,
                selected: true,
                visible: false,
              },
              lubrication: {
                disabled: false,
                selected: true,
                visible: false,
              },
            },
          },
        };

        const result = getCalculationFieldsConfig(stateWithInvisible);

        expect(result.required).toEqual([]);
        expect(result.preset).toEqual([]);
      });

      it('should handle CO2 downstream field filtering for slewing bearings', () => {
        const stateWithTimeField = {
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            bearingProductClass: SLEWING_BEARING_TYPE,
            co2DownstreamAvailable: false,
          },
          calculationParameters: {
            ...mockState.calculationParameters,
            calculationTypes: {
              ...mockState.calculationParameters.calculationTypes,
              ratingLife: {
                disabled: false,
                selected: true,
                visible: true,
              },
            },
          },
        };

        const result = getCalculationFieldsConfig(stateWithTimeField);

        // time field should be filtered out when CO2 downstream is not available
        expect(result.required).not.toContain('time');
        expect(result.preset).not.toContain('time');
      });
    });

    describe('mapCalculationFields function behavior', () => {
      it('should handle preset to required field promotion', () => {
        const stateWithFrictionalPowerloss = {
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            bearingProductClass: CATALOG_BEARING_TYPE,
          },
          calculationParameters: {
            ...mockState.calculationParameters,
            calculationTypes: {
              // Clear emission which was selected in mock
              emission: {
                disabled: false,
                selected: false,
                visible: false,
              },
              frictionalPowerloss: {
                disabled: false,
                selected: true,
                visible: true,
              },
              lubrication: {
                disabled: false,
                selected: false,
                visible: false,
              },
              overrollingFrequency: {
                disabled: false,
                selected: false,
                visible: false,
              },
              ratingLife: {
                disabled: false,
                selected: false,
                visible: false,
              },
            },
          },
        };

        const result = getCalculationFieldsConfig(stateWithFrictionalPowerloss);

        // Required fields should be in required list
        expect(result.required).toContain('load');
        expect(result.required).toContain('rotatingCondition');
        expect(result.required).toContain('lubrication');

        // Optional fields should be in preset list
        expect(result.preset).toContain('operatingTemperature');
        expect(result.preset).toContain('energySource');
        expect(result.preset).toContain('time');
      });

      it('should handle field moving from preset to required when multiple calculations', () => {
        const stateWithMultipleBearingCalcs = {
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            bearingProductClass: CATALOG_BEARING_TYPE,
          },
          calculationParameters: {
            ...mockState.calculationParameters,
            calculationTypes: {
              // Clear emission which was selected in mock
              emission: {
                disabled: false,
                selected: false,
                visible: false,
              },
              frictionalPowerloss: {
                disabled: false,
                selected: true,
                visible: true,
              },
              lubrication: {
                disabled: false,
                selected: true,
                visible: true,
              },
              overrollingFrequency: {
                disabled: false,
                selected: false,
                visible: false,
              },
              ratingLife: {
                disabled: false,
                selected: false,
                visible: false,
              },
            },
          },
        };

        const result = getCalculationFieldsConfig(
          stateWithMultipleBearingCalcs
        );

        // rotatingCondition should be required (appears in both)
        expect(result.required).toContain('rotatingCondition');
        expect(result.required).toContain('load');
        expect(result.required).toContain('lubrication');
        expect(result.required).toContain('ambientTemperature');
        expect(result.required).toContain('operatingTemperature');

        // Fields that are optional in frictionalPowerloss but not in lubrication
        // should be in preset
        expect(result.preset).toContain('energySource');
        expect(result.preset).toContain('time');
      });

      it('should handle overrollingFrequency calculation type', () => {
        const stateWithOverrolling = {
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            bearingProductClass: CATALOG_BEARING_TYPE,
          },
          calculationParameters: {
            ...mockState.calculationParameters,
            calculationTypes: {
              // Clear other calculations
              emission: {
                disabled: false,
                selected: false,
                visible: false,
              },
              frictionalPowerloss: {
                disabled: false,
                selected: false,
                visible: false,
              },
              lubrication: {
                disabled: false,
                selected: false,
                visible: false,
              },
              overrollingFrequency: {
                disabled: false,
                selected: true,
                visible: true,
              },
              ratingLife: {
                disabled: false,
                selected: false,
                visible: false,
              },
            },
          },
        };

        const result = getCalculationFieldsConfig(stateWithOverrolling);

        expect(result.required).toContain('load');
        expect(result.required).toContain('rotatingCondition');
        expect(result.required).toContain('conditionOfRotation');
        expect(result.preset).toEqual([]);
      });
    });

    describe('Additional slewing bearing edge cases', () => {
      it('should handle frictionalPowerloss and overrollingFrequency for slewing bearings (empty mappings)', () => {
        const stateWithEmptyMappings = {
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            bearingProductClass: SLEWING_BEARING_TYPE,
          },
          calculationParameters: {
            ...mockState.calculationParameters,
            calculationTypes: {
              // Clear other calculations
              emission: {
                disabled: false,
                selected: false,
                visible: false,
              },
              frictionalPowerloss: {
                disabled: false,
                selected: true,
                visible: true,
              },
              lubrication: {
                disabled: false,
                selected: false,
                visible: false,
              },
              overrollingFrequency: {
                disabled: false,
                selected: true,
                visible: true,
              },
              ratingLife: {
                disabled: false,
                selected: false,
                visible: false,
              },
            },
          },
        };

        const result = getCalculationFieldsConfig(stateWithEmptyMappings);

        // Both frictionalPowerloss and overrollingFrequency have empty mappings for slewing bearings
        expect(result.required).toEqual([]);
        expect(result.preset).toEqual([]);
      });

      it('should handle complex slewing bearing scenario with mixed CO2 downstream fields', () => {
        const complexSlewingState = {
          ...mockState,
          productSelection: {
            ...mockState.productSelection,
            bearingProductClass: SLEWING_BEARING_TYPE,
            co2DownstreamAvailable: true,
          },
          calculationParameters: {
            ...mockState.calculationParameters,
            calculationTypes: {
              emission: {
                disabled: false,
                selected: true,
                visible: true,
              },
              frictionalPowerloss: {
                disabled: false,
                selected: false,
                visible: false,
              },
              lubrication: {
                disabled: false,
                selected: false,
                visible: false,
              },
              overrollingFrequency: {
                disabled: false,
                selected: false,
                visible: false,
              },
              ratingLife: {
                disabled: false,
                selected: true,
                visible: true,
              },
            },
          },
        };

        const result = getCalculationFieldsConfig(complexSlewingState);

        // Should combine fields from emission (rotatingCondition) and ratingLife (all fields including time)
        expect(result.required).toContain('rotatingCondition');
        expect(result.required).toContain('time');
        expect(result.required).toContain('force');
        expect(result.required).toContain('moment');
      });
    });
  });
});
