import {
  CalculationResultState,
  MountingTools,
} from '@mm/core/store/models/calculation-result-state.model';
import { APP_STATE_MOCK } from '@mm/testing/mocks/store/app-state.mock';

import {
  getCalculationInputs,
  getCalculationMessages,
  getEndPositions,
  getMountingRecommendations,
  getMountingTools,
  getReportSelectionTypes,
  getStartPositions,
  getVersions,
  hasMountingTools,
  isResultAvailable,
} from './calculation-result.selector';

describe('CalculationResultSelector', () => {
  const state: CalculationResultState = {
    ...APP_STATE_MOCK.calculationResult,
  };

  describe('getCalculationInputs', () => {
    describe('when inputs are not defined', () => {
      it('should return undefined', () => {
        const result = getCalculationInputs.projector(state);

        expect(result).toBeUndefined();
      });
    });

    describe('when inputs are defined', () => {
      it('should return inputs', () => {
        expect(
          getCalculationInputs({
            calculationResult: {
              result: {
                inputs: [
                  {
                    hasNestedStructure: true,
                    title: 'some title',
                  },
                ],
              },
            },
          })
        ).toMatchSnapshot();
      });
    });
  });

  describe('getMountingRecommendations', () => {
    describe('when mounting recommendations are not defined', () => {
      it('should return empty array', () => {
        const result = getMountingRecommendations.projector(state);
        expect(result).toEqual([]);
      });
    });

    describe('when mounting recommendations are defined', () => {
      it('should return mounting recommendations', () => {
        expect(
          getMountingRecommendations({
            calculationResult: {
              result: {
                mountingRecommendations: [
                  'first recommendation',
                  'second recommendation',
                ],
              },
            },
          })
        ).toMatchSnapshot();
      });
    });
  });

  describe('getMountingTools', () => {
    describe('when mounting tools are not defined', () => {
      it('should return empty object', () => {
        const result = getMountingTools.projector(state);
        expect(result).toBeUndefined();
      });
    });

    describe('when mounting tools are defined', () => {
      it('should return mounting tools', () => {
        expect(
          getMountingTools({
            calculationResult: {
              result: {
                mountingTools: {
                  additionalTools: [],
                  hydraulicNut: [],
                  pumps: {
                    title: '',
                    items: [],
                  },
                  locknut: [],
                  sleeveConnectors: [],
                } as MountingTools,
              },
            },
          })
        ).toMatchSnapshot();
      });
    });
  });

  describe('getCalculationMessages', () => {
    describe('when messages are not defined', () => {
      it('should return default messages', () => {
        const result = getCalculationMessages.projector(state);
        expect(result).toEqual({
          errors: [],
          notes: [],
          warnings: [],
        });
      });
    });

    describe('when messages are defined', () => {
      it('should return messages', () => {
        expect(
          getCalculationMessages({
            calculationResult: {
              result: {
                reportMessages: {
                  notes: ['some note'],
                  warnings: [],
                  errors: [],
                },
              },
            },
          })
        ).toMatchSnapshot();
      });
    });
  });

  describe('isResultAvailable', () => {
    describe('when result is not available', () => {
      it('should return false', () => {
        const result = isResultAvailable.projector(state);
        expect(result).toBe(false);
      });
    });

    describe('when result is available', () => {
      it('should return true', () => {
        expect(
          isResultAvailable({
            calculationResult: {
              result: {},
            },
          })
        ).toBe(true);
      });
    });

    describe('when old result is available but is loading a new result', () => {
      it('should return false', () => {
        expect(
          isResultAvailable({
            calculationResult: {
              result: {},
              isLoading: true,
            },
          })
        ).toBe(false);
      });
    });

    describe('hasMountingTools', () => {
      describe('when mounting tools are not available', () => {
        it('should return false', () => {
          expect(
            hasMountingTools({
              calculationResult: {
                result: {},
              },
            })
          ).toBe(false);
        });
      });

      describe('when mounting tools are available', () => {
        const mountingTools: MountingTools = {
          additionalTools: [],
          hydraulicNut: [],
          pumps: {
            title: '',
            items: [],
          },
          locknut: [],
          sleeveConnectors: [],
        } as MountingTools;

        it('should return true when hydraulic nut provided', () => {
          expect(
            hasMountingTools({
              calculationResult: {
                result: {
                  mountingTools: {
                    ...mountingTools,
                    hydraulicNut: [
                      {
                        value: 'some value',
                        unit: 'unit',
                        designation: 'designation value',
                      },
                    ],
                  },
                },
              },
            })
          ).toBe(true);
        });

        it('should return true when additional tools provided', () => {
          expect(
            hasMountingTools({
              calculationResult: {
                result: {
                  mountingTools: {
                    ...mountingTools,
                    additionalTools: [
                      {
                        value: 'some value',
                        unit: 'unit',
                        designation: 'designation value',
                      },
                    ],
                  },
                },
              },
            })
          ).toBe(true);
        });

        it('should return true when pumps provided', () => {
          expect(
            hasMountingTools({
              calculationResult: {
                result: {
                  mountingTools: {
                    ...mountingTools,
                    pumps: {
                      title: 'pumps title',
                      items: [
                        {
                          field: 'some field',
                          value: 'some value',
                          isRecommended: true,
                        },
                      ],
                    },
                  },
                },
              },
            })
          ).toBe(true);
        });

        it('should return true when locknut provided', () => {
          expect(
            hasMountingTools({
              calculationResult: {
                result: {
                  mountingTools: {
                    ...mountingTools,
                    locknut: [
                      {
                        value: 'some value',
                        unit: 'unit',
                        designation: 'designation value',
                      },
                    ],
                  },
                },
              },
            })
          ).toBe(true);
        });
      });
    });

    describe('getReportSelectionTypes', () => {
      describe('when no reports types are available', () => {
        it('should return empty list', () => {
          expect(
            getReportSelectionTypes({
              calculationResult: {
                result: {},
              },
            })
          ).toEqual([]);
        });
      });

      describe('when reports types are available', () => {
        it('should return types list', () => {
          expect(
            getReportSelectionTypes({
              calculationResult: {
                result: {
                  reportMessages: {
                    notes: ['some note'],
                    warnings: [],
                    errors: [],
                  },
                  mountingTools: {
                    additionalTools: [
                      {
                        value: 'some value',
                        unit: 'unit',
                        designation: 'designation value',
                      },
                    ],
                    hydraulicNut: [],
                    pumps: {
                      title: '',
                      items: [],
                    },
                    locknut: [],
                    sleeveConnectors: [],
                  } as MountingTools,
                  mountingRecommendations: [
                    'first recommendation',
                    'second recommendation',
                  ],
                  inputs: [
                    {
                      hasNestedStructure: true,
                      title: 'some title',
                    },
                  ],
                },
              },
            })
          ).toMatchSnapshot();
        });
      });
    });
  });
  describe('getVersions', () => {
    const mockState = {
      calculationResult: {},
    };
    it('should return undefined if there are no versions', () => {
      expect(
        getVersions({
          ...mockState,
          calculationResult: {
            ...mockState.calculationResult,
            versions: undefined,
          },
        })
      ).toBeUndefined();
    });

    it('should return undefined if the versions object is empty', () => {
      expect(
        getVersions({
          ...mockState,
          calculationResult: {
            ...mockState.calculationResult,
            versions: {},
          },
        })
      ).toBeUndefined();
    });

    it('should return the versions as a string', () => {
      expect(
        getVersions({
          ...mockState,
          calculationResult: {
            ...mockState.calculationResult,
            versions: {
              '1': 'v1',
              '2': 'v2',
            },
          },
        })
      ).toEqual('1 v1 / 2 v2');
    });
  });
  describe('getStartPositions', () => {
    describe('when start positions are not defined', () => {
      it('should return empty array', () => {
        const result = getStartPositions.projector(state);
        expect(result).toEqual([]);
      });
    });

    describe('when start positions are defined', () => {
      it('should return start positions', () => {
        expect(
          getStartPositions({
            calculationResult: {
              result: {
                startPositions: [
                  { abbreviation: 'pos1', value: '10 mm', title: 'Position 1' },
                  { abbreviation: 'pos2', value: '20 mm', title: 'Position 2' },
                ],
              },
            },
          })
        ).toEqual([
          { abbreviation: 'pos1', value: '10 mm', title: 'Position 1' },
          { abbreviation: 'pos2', value: '20 mm', title: 'Position 2' },
        ]);
      });
    });
  });

  describe('getEndPositions', () => {
    describe('when end positions are not defined', () => {
      it('should return empty array', () => {
        const result = getEndPositions.projector(state);
        expect(result).toEqual([]);
      });
    });

    describe('when end positions are defined', () => {
      it('should return end positions', () => {
        expect(
          getEndPositions({
            calculationResult: {
              result: {
                endPositions: [
                  {
                    abbreviation: 'pos1',
                    value: '15 mm',
                    title: 'End Position 1',
                  },
                  {
                    abbreviation: 'pos2',
                    value: '25 mm',
                    title: 'End Position 2',
                  },
                ],
              },
            },
          })
        ).toEqual([
          { abbreviation: 'pos1', value: '15 mm', title: 'End Position 1' },
          { abbreviation: 'pos2', value: '25 mm', title: 'End Position 2' },
        ]);
      });
    });

    describe('when result is null', () => {
      it('should return empty array', () => {
        expect(
          getEndPositions({
            calculationResult: {
              // eslint-disable-next-line unicorn/no-null
              result: null,
            },
          })
        ).toEqual([]);
      });
    });
    describe('getReportSelectionTypes', () => {
      describe('when no inputs, mounting tools, recommendations, messages, start positions, or end positions are available', () => {
        it('should return an empty array', () => {
          const result = getReportSelectionTypes.projector(
            undefined,
            false,
            [],
            { errors: [], warnings: [], notes: [] },
            [],
            [],
            [],
            []
          );
          expect(result).toEqual([]);
        });
      });

      describe('when start positions are available', () => {
        it('should include "startPosition" in the result', () => {
          const result = getReportSelectionTypes.projector(
            undefined,
            false,
            [],
            { errors: [], warnings: [], notes: [] },
            [
              {
                abbreviation: 'pos1',
                value: '10',
                designation: 'Position 1',
                unit: 'mm',
              },
            ],
            [],
            [],
            []
          );
          expect(result).toEqual([{ name: 'startPosition' }]);
        });
      });

      describe('when end positions are available', () => {
        it('should include "endPosition" in the result', () => {
          const result = getReportSelectionTypes.projector(
            undefined,
            false,
            [],
            { errors: [], warnings: [], notes: [] },
            [],
            [
              {
                abbreviation: 'pos1',
                value: '15',
                designation: 'End Position 1',
                unit: 'mm',
              },
            ],
            [],
            []
          );
          expect(result).toEqual([{ name: 'endPosition' }]);
        });
      });

      describe('when inputs are available', () => {
        it('should include "reportInputs" in the result', () => {
          const result = getReportSelectionTypes.projector(
            [{ hasNestedStructure: true, title: 'some title' }],
            false,
            [],
            { errors: [], warnings: [], notes: [] },
            [],
            [],
            [],
            []
          );
          expect(result).toEqual([{ name: 'reportInputs' }]);
        });
      });

      describe('when mounting tools are available', () => {
        it('should include "mountingToolsAndUtilities" in the result', () => {
          const result = getReportSelectionTypes.projector(
            undefined,
            true,
            [],
            { errors: [], warnings: [], notes: [] },
            [],
            [],
            [],
            []
          );
          expect(result).toEqual([{ name: 'mountingToolsAndUtilities' }]);
        });
      });

      describe('when mounting recommendations are available', () => {
        it('should include "mountingInstructions" in the result', () => {
          const result = getReportSelectionTypes.projector(
            undefined,
            false,
            ['first recommendation', 'second recommendation'],
            { errors: [], warnings: [], notes: [] },
            [],
            [],
            [],
            []
          );
          expect(result).toEqual([{ name: 'mountingInstructions' }]);
        });
      });

      describe('when messages are available', () => {
        it('should include "reportMessages" in the result if there are errors', () => {
          const result = getReportSelectionTypes.projector(
            undefined,
            false,
            [],
            { errors: ['some error'], warnings: [], notes: [] },
            [],
            [],
            [],
            []
          );
          expect(result).toEqual([{ name: 'reportMessages' }]);
        });

        it('should include "reportMessages" in the result if there are warnings', () => {
          const result = getReportSelectionTypes.projector(
            undefined,
            false,
            [],
            { errors: [], warnings: ['some warning'], notes: [] },
            [],
            [],
            [],
            []
          );
          expect(result).toEqual([{ name: 'reportMessages' }]);
        });

        it('should include "reportMessages" in the result if there are notes', () => {
          const result = getReportSelectionTypes.projector(
            undefined,
            false,
            [],
            { errors: [], warnings: [], notes: ['some note'] },
            [],
            [],
            [],
            []
          );
          expect(result).toEqual([{ name: 'reportMessages' }]);
        });
      });

      describe('when multiple conditions are met', () => {
        it('should include all applicable report selection types', () => {
          const result = getReportSelectionTypes.projector(
            [{ hasNestedStructure: true, title: 'some title' }],
            true,
            ['first recommendation'],
            { errors: ['some error'], warnings: [], notes: [] },
            [
              {
                abbreviation: 'pos1',
                value: '10',
                designation: 'Position 1',
                unit: 'mm',
              },
            ],
            [
              {
                abbreviation: 'pos2',
                value: '15',
                designation: 'End Position 1',
                unit: 'mm',
              },
            ],
            [
              {
                designation: 'some designation',
                value: 'some value',
                unit: 'some unit',
              },
            ],
            [
              {
                designation: 'some designation',
                value: 'some value',
                unit: 'some unit',
              },
            ]
          );
          expect(result).toMatchSnapshot();
        });
      });
    });
  });
});
