import {
  CalculationResultState,
  MountingTools,
} from '@mm/core/store/models/calculation-result-state.model';
import { APP_STATE_MOCK } from '@mm/testing/mocks/store/app-state.mock';

import {
  getCalculationInputs,
  getCalculationMessages,
  getMountingRecommendations,
  getMountingTools,
  getReportSelectionTypes,
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
});
