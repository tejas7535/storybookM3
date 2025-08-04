import { CatalogCalculationResult } from '../store/models';
import {
  IDM_LIFERATING_SLEWING_BEARING,
  LoadcaseValueType,
} from './bearinx-result.constant';
import { BearinxOnlineResult } from './bearinx-result.interface';
import {
  extractSlewingBearingFactorsAndEquivalentLoads,
  extractSlewingBearingFriction,
  extractSlewingBearingMaximumFrictionalTorque,
  isSlewingBearing,
} from './slewing-bearing-helper';

// Mock data based on the payload you provided earlier
const SLEWING_BEARING_MOCK: Partial<BearinxOnlineResult> = {
  methodID: IDM_LIFERATING_SLEWING_BEARING,
  subordinates: [
    {
      titleID: 'STRING_OUTP_RESULTS',
      identifier: 'block',
      subordinates: [
        {
          titleID: 'STRING_OUTP_BEARING',
          identifier: 'variableBlock',
          subordinates: [
            {
              abbreviation: 'Lh10',
              identifier: 'variableLine',
              subordinates: [],
              value: '64300',
              unit: 'h',
            },
            {
              abbreviation: 'n',
              identifier: 'variableLine',
              subordinates: [],
              value: '1',
              unit: '1/min',
            },
            {
              designation: 'Maximum frictional torque',
              abbreviation: 'Mr_max',
              identifier: 'variableLine',
              subordinates: [],
              value: '31',
              unit: 'N m',
            },
          ],
        },
        // Load case 1 data (variableBlock without titleID)
        {
          identifier: 'variableBlock',
          title: 'Load case 1',
          subordinates: [
            {
              designation: 'Load case specific fatigue life',
              abbreviation: 'Lh10_i',
              identifier: 'variableLine',
              subordinates: [],
              value: '> 10000000',
              unit: 'h',
            },
            {
              designation: 'Static safety factor',
              abbreviation: 'S0',
              identifier: 'variableLine',
              subordinates: [],
              value: '7.81',
              unit: '',
            },
            {
              designation: 'Frictional moment',
              abbreviation: 'MR',
              identifier: 'variableLine',
              subordinates: [],
              value: '31',
              unit: 'N m',
            },
          ],
        },
        // Load case 2 data (variableBlock without titleID)
        {
          identifier: 'variableBlock',
          title: 'Load case 2',
          subordinates: [
            {
              designation: 'Load case specific fatigue life',
              abbreviation: 'Lh10_i',
              identifier: 'variableLine',
              subordinates: [],
              value: '> 10000000',
              unit: 'h',
            },
            {
              designation: 'Static safety factor',
              abbreviation: 'S0',
              identifier: 'variableLine',
              subordinates: [],
              value: '6.25',
              unit: '',
            },
            {
              designation: 'Frictional moment',
              abbreviation: 'MR',
              identifier: 'variableLine',
              subordinates: [],
              value: '28',
              unit: 'N m',
            },
          ],
        },
      ],
    },
  ],
};

const STANDARD_BEARING_MOCK: Partial<BearinxOnlineResult> = {
  methodID: 'IDM_STANDARD_BEARING',
  subordinates: [],
};

const EMPTY_RESULT_MOCK: Partial<BearinxOnlineResult> = {
  methodID: IDM_LIFERATING_SLEWING_BEARING,
  subordinates: [],
};

const INVALID_STRUCTURE_MOCK: Partial<BearinxOnlineResult> = {
  methodID: IDM_LIFERATING_SLEWING_BEARING,
  subordinates: [
    {
      titleID: 'STRING_OUTP_INVALID',
      identifier: 'block',
      subordinates: [],
    },
  ],
};

describe('SlewingBearingHelper', () => {
  describe('isSlewingBearing', () => {
    it('should return true for slewing bearing methodID', () => {
      expect(
        isSlewingBearing(SLEWING_BEARING_MOCK as BearinxOnlineResult)
      ).toBe(true);
    });

    it('should return false for standard bearing methodID', () => {
      expect(
        isSlewingBearing(STANDARD_BEARING_MOCK as BearinxOnlineResult)
      ).toBe(false);
    });
  });

  describe('extractSlewingBearingFactorsAndEquivalentLoads', () => {
    it('should extract factors and equivalent loads from multiple load cases', () => {
      const result: CatalogCalculationResult = {};
      extractSlewingBearingFactorsAndEquivalentLoads(
        SLEWING_BEARING_MOCK as BearinxOnlineResult,
        result
      );

      expect(result).toMatchSnapshot();
    });

    it('should handle smart parsing of string values like "> 10000000"', () => {
      const result: CatalogCalculationResult = {};
      extractSlewingBearingFactorsAndEquivalentLoads(
        SLEWING_BEARING_MOCK as BearinxOnlineResult,
        result
      );

      const factorsData =
        result[LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS];
      expect(factorsData).toBeDefined();
      expect(factorsData).toHaveLength(2);

      const loadCase1 = factorsData[0];
      const loadCase2 = factorsData[1];

      // Check that numeric values are parsed as numbers
      expect(typeof loadCase1.s0.value).toBe('number');
      expect(loadCase1.s0.value).toBe(7.81);
      expect(typeof loadCase2.s0.value).toBe('number');
      expect(loadCase2.s0.value).toBe(6.25);

      // Check that non-numeric values remain as strings
      expect(typeof loadCase1.lh10_i.value).toBe('string');
      expect(loadCase1.lh10_i.value).toBe('> 10000000');
      expect(typeof loadCase2.lh10_i.value).toBe('string');
      expect(loadCase2.lh10_i.value).toBe('> 10000000');
    });

    it('should include correct loadcaseName for each load case', () => {
      const result: CatalogCalculationResult = {};
      extractSlewingBearingFactorsAndEquivalentLoads(
        SLEWING_BEARING_MOCK as BearinxOnlineResult,
        result
      );

      const factorsData =
        result[LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS];
      expect(factorsData).toBeDefined();
      expect(factorsData).toHaveLength(2);

      const loadCase1 = factorsData[0];
      const loadCase2 = factorsData[1];

      expect(loadCase1.s0.loadcaseName).toBe('Load case 1');
      expect(loadCase1.lh10_i.loadcaseName).toBe('Load case 1');
      expect(loadCase2.s0.loadcaseName).toBe('Load case 2');
      expect(loadCase2.lh10_i.loadcaseName).toBe('Load case 2');
    });

    it('should gracefully handle empty results', () => {
      const result: CatalogCalculationResult = {};
      extractSlewingBearingFactorsAndEquivalentLoads(
        EMPTY_RESULT_MOCK as BearinxOnlineResult,
        result
      );

      expect(result).toEqual({});
    });

    it('should gracefully handle invalid structure', () => {
      const result: CatalogCalculationResult = {};
      extractSlewingBearingFactorsAndEquivalentLoads(
        INVALID_STRUCTURE_MOCK as BearinxOnlineResult,
        result
      );

      expect(result).toEqual({});
    });
  });

  describe('extractSlewingBearingFriction', () => {
    it('should extract friction data from multiple load cases', () => {
      const result: CatalogCalculationResult = {};
      extractSlewingBearingFriction(
        SLEWING_BEARING_MOCK as BearinxOnlineResult,
        result
      );

      expect(result).toMatchSnapshot();
    });

    it('should extract friction values with correct units and load case names', () => {
      const result: CatalogCalculationResult = {};
      extractSlewingBearingFriction(
        SLEWING_BEARING_MOCK as BearinxOnlineResult,
        result
      );

      const frictionData = result[LoadcaseValueType.FRICTION];
      expect(frictionData).toBeDefined();
      expect(frictionData).toHaveLength(2);

      // Load case 1 friction
      const loadCase1Friction = frictionData[0];
      expect(loadCase1Friction.totalFrictionalTorque).toEqual({
        value: '31',
        unit: 'N m',
        short: 'MR',
        title: 'totalFrictionalTorque',
        loadcaseName: 'Load case 1',
      });

      // Load case 2 friction
      const loadCase2Friction = frictionData[1];
      expect(loadCase2Friction.totalFrictionalTorque).toEqual({
        value: '28',
        unit: 'N m',
        short: 'MR',
        title: 'totalFrictionalTorque',
        loadcaseName: 'Load case 2',
      });
    });

    it('should only add load cases that have friction values', () => {
      // Create mock with one load case having friction, one without
      const mockWithPartialFriction: Partial<BearinxOnlineResult> = {
        methodID: IDM_LIFERATING_SLEWING_BEARING,
        subordinates: [
          {
            titleID: 'STRING_OUTP_RESULTS',
            identifier: 'block',
            subordinates: [
              {
                identifier: 'variableBlock',
                title: 'Load case 1',
                subordinates: [
                  {
                    abbreviation: 'MR',
                    identifier: 'variableLine',
                    subordinates: [],
                    value: '31',
                    unit: 'N m',
                  },
                ],
              },
              {
                identifier: 'variableBlock',
                title: 'Load case 2',
                subordinates: [
                  // No friction data in this load case
                  {
                    abbreviation: 'SomeOtherValue',
                    identifier: 'variableLine',
                    subordinates: [],
                    value: '123',
                    unit: 'unit',
                  },
                ],
              },
            ],
          },
        ],
      };

      const result: CatalogCalculationResult = {};
      extractSlewingBearingFriction(
        mockWithPartialFriction as BearinxOnlineResult,
        result
      );

      const frictionData = result[LoadcaseValueType.FRICTION];
      expect(frictionData).toBeDefined();
      expect(frictionData).toHaveLength(1); // Only load case 1 should be included
      expect(frictionData[0].totalFrictionalTorque.loadcaseName).toBe(
        'Load case 1'
      );
    });

    it('should gracefully handle empty results', () => {
      const result: CatalogCalculationResult = {};
      extractSlewingBearingFriction(
        EMPTY_RESULT_MOCK as BearinxOnlineResult,
        result
      );

      expect(result).toEqual({});
    });

    it('should gracefully handle invalid structure', () => {
      const result: CatalogCalculationResult = {};
      extractSlewingBearingFriction(
        INVALID_STRUCTURE_MOCK as BearinxOnlineResult,
        result
      );

      expect(result).toEqual({});
    });
  });

  describe('extractSlewingBearingMaximumFrictionalTorque', () => {
    it('should extract maximum frictional torque from bearing data block', () => {
      const result: CatalogCalculationResult = {};
      extractSlewingBearingMaximumFrictionalTorque(
        SLEWING_BEARING_MOCK as BearinxOnlineResult,
        result
      );

      expect(result.maximumFrictionalTorque).toBeDefined();
      expect(result.maximumFrictionalTorque).toEqual({
        value: '31',
        unit: 'N m',
      });
    });

    it('should gracefully handle empty results', () => {
      const result: CatalogCalculationResult = {};
      extractSlewingBearingMaximumFrictionalTorque(
        EMPTY_RESULT_MOCK as BearinxOnlineResult,
        result
      );

      expect(result.maximumFrictionalTorque).toBeUndefined();
    });

    it('should gracefully handle invalid structure', () => {
      const result: CatalogCalculationResult = {};
      extractSlewingBearingMaximumFrictionalTorque(
        INVALID_STRUCTURE_MOCK as BearinxOnlineResult,
        result
      );

      expect(result.maximumFrictionalTorque).toBeUndefined();
    });
  });

  describe('integration tests', () => {
    it('should extract all slewing bearing data together', () => {
      const result: CatalogCalculationResult = {};

      extractSlewingBearingFactorsAndEquivalentLoads(
        SLEWING_BEARING_MOCK as BearinxOnlineResult,
        result
      );

      extractSlewingBearingFriction(
        SLEWING_BEARING_MOCK as BearinxOnlineResult,
        result
      );

      extractSlewingBearingMaximumFrictionalTorque(
        SLEWING_BEARING_MOCK as BearinxOnlineResult,
        result
      );

      expect(result).toMatchSnapshot();

      // Verify all data types are present
      const factorsData =
        result[LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS];
      const frictionData = result[LoadcaseValueType.FRICTION];
      const maxFrictionalTorque = result.maximumFrictionalTorque;

      expect(factorsData).toBeDefined();
      expect(frictionData).toBeDefined();
      expect(maxFrictionalTorque).toBeDefined();
      expect(factorsData).toHaveLength(2);
      expect(frictionData).toHaveLength(2);
      expect(maxFrictionalTorque).toEqual({
        value: '31',
        unit: 'N m',
      });
    });
  });

  // Add tests for helper functions to improve branch coverage
  describe('helper functions', () => {
    describe('value processing logic', () => {
      it('should convert numeric strings to numbers', () => {
        // Testing the internal logic by checking extractSlewingBearingFactorsAndEquivalentLoads behavior
        const mockResult: BearinxOnlineResult = {
          ...SLEWING_BEARING_MOCK,
          subordinates: [
            {
              titleID: 'STRING_OUTP_RESULTS',
              identifier: 'block',
              subordinates: [
                {
                  identifier: 'variableBlock',
                  title: 'Test Load Case',
                  subordinates: [
                    {
                      abbreviation: 'Lh10_i',
                      identifier: 'variableLine',
                      subordinates: [],
                      value: '123.45',
                      unit: 'h',
                    },
                  ],
                },
              ],
            },
          ],
        } as BearinxOnlineResult;

        const result: CatalogCalculationResult = {};
        extractSlewingBearingFactorsAndEquivalentLoads(mockResult, result);

        expect(
          result[LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS][0].lh10_i.value
        ).toBe(123.45);
      });

      it('should keep non-numeric strings as strings', () => {
        const mockResult: BearinxOnlineResult = {
          ...SLEWING_BEARING_MOCK,
          subordinates: [
            {
              titleID: 'STRING_OUTP_RESULTS',
              identifier: 'block',
              subordinates: [
                {
                  identifier: 'variableBlock',
                  title: 'Test Load Case',
                  subordinates: [
                    {
                      abbreviation: 'Lh10_i',
                      identifier: 'variableLine',
                      subordinates: [],
                      value: '> 10000000',
                      unit: 'h',
                    },
                  ],
                },
              ],
            },
          ],
        } as BearinxOnlineResult;

        const result: CatalogCalculationResult = {};
        extractSlewingBearingFactorsAndEquivalentLoads(mockResult, result);

        expect(
          result[LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS][0].lh10_i.value
        ).toBe('> 10000000');
      });
    });

    describe('extractValuesForLoadCase', () => {
      it('should handle load cases without title (empty string)', () => {
        const mockResult: BearinxOnlineResult = {
          ...SLEWING_BEARING_MOCK,
          subordinates: [
            {
              titleID: 'STRING_OUTP_RESULTS',
              identifier: 'block',
              subordinates: [
                {
                  identifier: 'variableBlock',
                  // No title property
                  subordinates: [
                    {
                      abbreviation: 'Lh10_i',
                      identifier: 'variableLine',
                      subordinates: [],
                      value: '100',
                      unit: 'h',
                    },
                  ],
                },
              ],
            },
          ],
        } as BearinxOnlineResult;

        const result: CatalogCalculationResult = {};
        extractSlewingBearingFactorsAndEquivalentLoads(mockResult, result);

        expect(
          result[LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS][0].lh10_i
            .loadcaseName
        ).toBe('');
      });

      it('should handle load cases with null title', () => {
        const mockResult: BearinxOnlineResult = {
          ...SLEWING_BEARING_MOCK,
          subordinates: [
            {
              titleID: 'STRING_OUTP_RESULTS',
              identifier: 'block',
              subordinates: [
                {
                  identifier: 'variableBlock',
                  title: undefined,
                  subordinates: [
                    {
                      abbreviation: 'Lh10_i',
                      identifier: 'variableLine',
                      subordinates: [],
                      value: '100',
                      unit: 'h',
                    },
                  ],
                },
              ],
            },
          ],
        } as BearinxOnlineResult;

        const result: CatalogCalculationResult = {};
        extractSlewingBearingFactorsAndEquivalentLoads(mockResult, result);

        expect(
          result[LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS][0].lh10_i
            .loadcaseName
        ).toBe('');
      });
    });

    describe('extractSlewingBearingData edge cases', () => {
      it('should handle onlyPushIfHasValues=false with empty values', () => {
        const mockResult: BearinxOnlineResult = {
          ...SLEWING_BEARING_MOCK,
          subordinates: [
            {
              titleID: 'STRING_OUTP_RESULTS',
              identifier: 'block',
              subordinates: [
                {
                  identifier: 'variableBlock',
                  title: 'Empty Load Case',
                  subordinates: [],
                },
              ],
            },
          ],
        } as BearinxOnlineResult;

        const result: CatalogCalculationResult = {};
        extractSlewingBearingFactorsAndEquivalentLoads(mockResult, result);

        // Should still push empty load case since onlyPushIfHasValues=false
        expect(
          result[LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS]
        ).toHaveLength(1);
        expect(
          result[LoadcaseValueType.FACTORS_AND_EQUIVALENT_LOADS][0]
        ).toEqual({});
      });

      it('should not push empty values when onlyPushIfHasValues=true', () => {
        const mockResult: BearinxOnlineResult = {
          ...SLEWING_BEARING_MOCK,
          subordinates: [
            {
              titleID: 'STRING_OUTP_RESULTS',
              identifier: 'block',
              subordinates: [
                {
                  identifier: 'variableBlock',
                  title: 'Empty Load Case',
                  subordinates: [],
                },
              ],
            },
          ],
        } as BearinxOnlineResult;

        const result: CatalogCalculationResult = {};
        extractSlewingBearingFriction(mockResult, result);

        // Should not push empty load case since onlyPushIfHasValues=true
        expect(result[LoadcaseValueType.FRICTION]).toHaveLength(0);
      });
    });
  });
});
