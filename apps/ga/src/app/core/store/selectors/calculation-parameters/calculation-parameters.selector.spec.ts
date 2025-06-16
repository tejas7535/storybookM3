import { ApplicationScenario } from '@ga/features/grease-calculation/calculation-parameters/constants/application-scenarios.model';
import { defaultPreferredGreaseOption } from '@ga/shared/constants';
import {
  AxisOrientation,
  EnvironmentImpact,
  InstallationMode,
  LoadInstallation,
  Movement,
} from '@ga/shared/models';
import { Grease } from '@ga/shared/services/greases/greases.service';

import * as selectors from './calculation-parameters.selector';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key) => key),
}));

describe('Calculation Parameters Selectors', () => {
  const testState = {
    calculationParameters: {
      competitorsGreases: [
        {
          company: 'Test Company',
          id: 'test-id-1',
          name: 'Test Grease 1',
          mixableGreases: ['schaeffler-1', 'schaeffler-2'],
        },
        {
          company: 'Another Company',
          id: 'test-id-2',
          name: 'Test Grease 2',
          mixableGreases: ['schaeffler-3'],
        },
      ] as Grease[],
      schaefflerGreases: [
        {
          company: 'Schaeffler',
          id: 'schaeffler-1',
          name: 'Schaeffler Grease 1',
          mixableGreases: [],
        },
        {
          company: 'Schaeffler',
          id: 'schaeffler-2',
          name: 'Schaeffler Grease 2',
          mixableGreases: [],
        },
        {
          company: 'Schaeffler',
          id: 'schaeffler-3',
          name: 'Schaeffler Grease 3',
          mixableGreases: [],
        },
      ] as Grease[],
      movements: {
        type: Movement.rotating,
        rotationalSpeed: 100,
        axisOrientation: AxisOrientation.Horizontal,
      },
      environment: {
        operatingTemperature: 50,
        environmentTemperature: 25,
        environmentImpact: EnvironmentImpact.low,
        applicationScenario: ApplicationScenario.All,
      },
      loads: {
        exact: true,
        radial: 100,
        axial: 50,
        loadRatio: '0.5',
      },
      properties: [
        {
          name: LoadInstallation.radial,
          value: InstallationMode.fixed,
        },
        {
          name: LoadInstallation.positiveAxial,
          value: InstallationMode.fixed,
        },
        {
          name: LoadInstallation.negativeAxial,
          value: InstallationMode.free,
        },
        {
          name: 'other-property',
          value: 'some-value',
        },
      ],
      preferredGrease: {
        loading: false,
        greaseOptions: [
          { id: 'option-1', text: 'Option 1' },
          { id: 'option-2', text: 'Option 2' },
        ],
        selectedGrease: { id: 'option-1', text: 'Option 1' },
      },
      automaticLubrication: true,
      valid: true,
      updating: false,
    },
    bearings: {
      selectedBearing: 'BEARING-123',
    },
    model: {
      id: 'MODEL-456',
    },
  };

  describe('Already covered selectors', () => {
    it('should get selected movement type', () => {
      expect(selectors.getSelectedMovementType(testState)).toEqual(
        Movement.rotating
      );
    });

    it('should get environment temperatures', () => {
      expect(selectors.getEnvironmentTemperatures(testState)).toEqual({
        operatingTemperature: 50,
        environmentTemperature: 25,
      });
    });

    it('should get loads input type', () => {
      expect(selectors.getLoadsInputType(testState)).toBe(true);
    });

    it('should get parameter validity', () => {
      expect(selectors.getParameterValidity(testState)).toBe(true);
    });

    it('should get parameter updating', () => {
      expect(selectors.getParameterUpdating(testState)).toBe(false);
    });

    it('should get properties', () => {
      expect(selectors.getProperties(testState)).toEqual(
        testState.calculationParameters.properties
      );
    });

    it('should get load directions', () => {
      expect(selectors.getLoadDirections(testState)).toEqual({
        [LoadInstallation.radial]: true,
        [LoadInstallation.positiveAxial]: true,
        [LoadInstallation.negativeAxial]: false,
      });
    });

    it('should check if axial load is possible', () => {
      expect(selectors.axialLoadPossible(testState)).toBe(true);
    });

    it('should check if radial load is possible', () => {
      expect(selectors.radialLoadPossible(testState)).toBe(true);
    });
  });

  describe('getCompetitorsGreases', () => {
    it('should return competitorsGreases from state', () => {
      expect(selectors.getCompetitorsGreases(testState)).toEqual(
        testState.calculationParameters.competitorsGreases
      );
    });
  });

  describe('getSchaefflerGreases', () => {
    it('should return schaefflerGreases from state', () => {
      expect(selectors.getSchaefflerGreases(testState)).toEqual(
        testState.calculationParameters.schaefflerGreases
      );
    });
  });

  describe('getPreferredGrease', () => {
    it('should return preferredGrease from state', () => {
      expect(selectors.getPreferredGrease(testState)).toEqual(
        testState.calculationParameters.preferredGrease
      );
    });
  });

  describe('getPreferredGreaseOptions', () => {
    it('should return preferredGrease options from state', () => {
      expect(selectors.getPreferredGreaseOptions(testState)).toEqual(
        testState.calculationParameters.preferredGrease.greaseOptions
      );
    });

    it('should return undefined if preferredGrease is undefined', () => {
      const stateWithoutPreferredGrease: any = {
        calculationParameters: {
          ...testState.calculationParameters,
          preferredGrease: undefined,
        },
      };
      expect(
        selectors.getPreferredGreaseOptions(stateWithoutPreferredGrease)
      ).toBeUndefined();
    });
  });

  describe('getAllGreases', () => {
    it('should combine grease categories with competitor greases', () => {
      const result = selectors.getAllGreases(testState);
      expect(result.length).toBeGreaterThan(0);

      const competitorCategory = result.find(
        (category) => (category as any).isCompetitor === true
      );
      expect(competitorCategory).toBeDefined();

      expect(result.filter((c) => (c as any).isCompetitor).length).toBe(2);
    });
  });

  describe('getPreferredGreaseOptionsLoading', () => {
    it('should return loading status from preferredGrease', () => {
      expect(selectors.getPreferredGreaseOptionsLoading(testState)).toBe(false);
    });

    it('should return undefined if preferredGrease is undefined', () => {
      const stateWithoutPreferredGrease: any = {
        calculationParameters: {
          ...testState.calculationParameters,
          preferredGrease: undefined,
        },
      };
      expect(
        selectors.getPreferredGreaseOptionsLoading(stateWithoutPreferredGrease)
      ).toBeUndefined();
    });
  });

  describe('getPreferredGreaseSelection', () => {
    it('should return selectedGrease from preferredGrease', () => {
      expect(selectors.getPreferredGreaseSelection(testState)).toEqual(
        testState.calculationParameters.preferredGrease.selectedGrease
      );
    });

    it('should return undefined if preferredGrease is undefined', () => {
      const stateWithoutPreferredGrease: any = {
        calculationParameters: {
          ...testState.calculationParameters,
          preferredGrease: undefined,
        },
      };
      expect(
        selectors.getPreferredGreaseSelection(stateWithoutPreferredGrease)
      ).toBeUndefined();
    });
  });

  describe('getAutomaticLubrication', () => {
    it('should return automaticLubrication from state', () => {
      expect(selectors.getAutomaticLubrication(testState)).toBe(true);
    });
  });

  describe('getGreaseApplication', () => {
    it('should return applicationScenario from environment', () => {
      expect(selectors.getGreaseApplication(testState)).toBe(
        ApplicationScenario.All
      );
    });
  });

  describe('isApplicationScenarioDisabled', () => {
    it('should return true when movement type is oscillating', () => {
      const stateWithOscillating = {
        calculationParameters: {
          ...testState.calculationParameters,
          movements: {
            ...testState.calculationParameters.movements,
            type: Movement.oscillating,
          },
        },
      };
      expect(
        selectors.isApplicationScenarioDisabled(stateWithOscillating)
      ).toBe(true);
    });

    it('should return true when a preferred grease is selected other than default', () => {
      const stateWithSelectedGrease = {
        calculationParameters: {
          ...testState.calculationParameters,
          preferredGrease: {
            ...testState.calculationParameters.preferredGrease,
            selectedGrease: {
              id: 'custom-id',
              text: 'Custom Grease',
            },
          },
        },
      };
      expect(
        selectors.isApplicationScenarioDisabled(stateWithSelectedGrease)
      ).toBe(true);
    });

    it('should return false when movement type is not oscillating and no preferred grease is selected', () => {
      const stateWithDefaultGrease = {
        calculationParameters: {
          ...testState.calculationParameters,
          movements: {
            ...testState.calculationParameters.movements,
            type: Movement.rotating,
          },
          preferredGrease: {
            ...testState.calculationParameters.preferredGrease,
            selectedGrease: defaultPreferredGreaseOption,
          },
        },
      };
      expect(
        selectors.isApplicationScenarioDisabled(stateWithDefaultGrease)
      ).toBe(false);
    });
  });

  describe('getMotionType', () => {
    it('should return the motion type from movements', () => {
      expect(selectors.getMotionType(testState)).toBe(Movement.rotating);
    });
  });

  describe('isVerticalAxisOrientation', () => {
    it('should return true when axis orientation is vertical', () => {
      const stateWithVerticalAxis = {
        calculationParameters: {
          ...testState.calculationParameters,
          movements: {
            ...testState.calculationParameters.movements,
            axisOrientation: AxisOrientation.Vertical,
          },
        },
      };
      expect(selectors.isVerticalAxisOrientation(stateWithVerticalAxis)).toBe(
        true
      );
    });

    it('should return false when axis orientation is horizontal', () => {
      expect(selectors.isVerticalAxisOrientation(testState)).toBe(false);
    });
  });

  describe('getSelectedCompetitorGreaseFromPreferred', () => {
    it('should return the competitor grease matching the selected preferred grease id', () => {
      const stateWithSelectedCompetitorGrease = {
        calculationParameters: {
          ...testState.calculationParameters,
          preferredGrease: {
            ...testState.calculationParameters.preferredGrease,
            selectedGrease: {
              id: 'test-id-1',
              text: 'Test Grease 1',
            },
          },
        },
      };
      const result = selectors.getSelectedCompetitorGreaseFromPreferred(
        stateWithSelectedCompetitorGrease
      );
      expect(result).toEqual({
        company: 'Test Company',
        id: 'test-id-1',
        name: 'Test Grease 1',
        mixableGreases: ['schaeffler-1', 'schaeffler-2'],
      });
    });

    it('should return undefined when no matching competitor grease is found', () => {
      const stateWithNonMatchingGreaseId = {
        calculationParameters: {
          ...testState.calculationParameters,
          preferredGrease: {
            ...testState.calculationParameters.preferredGrease,
            selectedGrease: {
              id: 'non-existent-id',
              text: 'Non-existent Grease',
            },
          },
        },
      };
      expect(
        selectors.getSelectedCompetitorGreaseFromPreferred(
          stateWithNonMatchingGreaseId
        )
      ).toBeUndefined();
    });

    it('should return undefined when selectedGrease has no id', () => {
      const stateWithNoGreaseId = {
        calculationParameters: {
          ...testState.calculationParameters,
          preferredGrease: {
            ...testState.calculationParameters.preferredGrease,
            selectedGrease: {
              id: undefined as any,
              text: 'No ID Grease',
            },
          },
        },
      };
      expect(
        selectors.getSelectedCompetitorGreaseFromPreferred(stateWithNoGreaseId)
      ).toBeUndefined();
    });
  });

  describe('getMixableGreasesOfSelectedFromPreferred', () => {
    it('should return mixable greases ids of the selected competitor grease', () => {
      const stateWithSelectedCompetitorGrease = {
        calculationParameters: {
          ...testState.calculationParameters,
          preferredGrease: {
            ...testState.calculationParameters.preferredGrease,
            selectedGrease: {
              id: 'test-id-1',
              text: 'Test Grease 1',
            },
          },
        },
      };
      expect(
        selectors.getMixableGreasesOfSelectedFromPreferred(
          stateWithSelectedCompetitorGrease
        )
      ).toEqual(['schaeffler-1', 'schaeffler-2']);
    });

    it('should return empty array when no competitor grease is selected', () => {
      expect(
        selectors.getMixableGreasesOfSelectedFromPreferred(testState)
      ).toEqual([]);
    });
  });

  describe('getMixableSchaefflerGreases', () => {
    it('should return Schaeffler greases that are mixable with the selected competitor grease', () => {
      const stateWithSelectedCompetitorGrease = {
        calculationParameters: {
          ...testState.calculationParameters,
          preferredGrease: {
            ...testState.calculationParameters.preferredGrease,
            selectedGrease: {
              id: 'test-id-1',
              text: 'Test Grease 1',
            },
          },
        },
      };
      const result = selectors.getMixableSchaefflerGreases(
        stateWithSelectedCompetitorGrease
      );
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('schaeffler-1');
      expect(result[1].id).toBe('schaeffler-2');
    });

    it('should return empty array when no competitor grease is selected', () => {
      expect(selectors.getMixableSchaefflerGreases(testState)).toEqual([]);
    });
  });
});
