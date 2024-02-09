/* eslint-disable max-lines */
import { CatalogCalculationResultState } from '@ea/core/store/models';

export const CATALOG_CALCULATION_RESULT_STATE_MOCK: CatalogCalculationResultState =
  {
    isLoading: false,
    basicFrequencies: {
      rows: [],
      title: 'Catalog Calculation Result',
    },
    result: {
      bearingBehaviour: {
        lh10: {
          unit: 'h',
          value: '123',
        },
      },
      reportInputSuborinates: {
        inputSubordinates: [
          {
            hasNestedStructure: true,
            title: 'some title',
          },
        ],
      },
      reportMessages: {
        errors: ['Errors'],
        warnings: ['Warnings'],
        notes: [],
      },
    },
  };

export const CATALOG_CALCULATION_FULL_RESULT_STATE_MOCK: CatalogCalculationResultState =
  {
    isLoading: false,
    basicFrequencies: {
      rows: [],
      title: 'Catalog Calculation Result',
    },
    result: {
      bearingBehaviour: {
        lh10: {
          unit: 'h',
          value: '152277',
        },
        lh_nm: {
          unit: 'h',
          value: '415307',
        },
        p: {
          unit: 'N',
          value: '1028.71',
        },
        n: {
          unit: '1/min',
          value: '270.0',
        },
        S0_min: {
          value: '2.844',
        },
        P0_max: {
          unit: 'N',
          value: '1125.00',
        },
        lowerGuideIntervalRelubrication: {
          unit: 'h',
          value: '8920',
        },
        upperGuideIntervalRelubrication: {
          unit: 'h',
          value: '13800',
        },
      },
      loadcaseFactorsAndEquivalentLoads: [
        {
          p0: {
            value: 200,
            unit: 'N',
            short: 'P0',
            loadcaseName: 'Loadcase 1',
            title: 'p0',
          },
          p_i: {
            value: 200,
            unit: 'N',
            short: 'P_i',
            loadcaseName: 'Loadcase 1',
            title: 'p_i',
          },
        },
        {
          p0: {
            value: 1125,
            unit: 'N',
            short: 'P0',
            loadcaseName: 'Loadcase 2',
            title: 'p0',
          },
          p_i: {
            value: 1250,
            unit: 'N',
            short: 'P_i',
            loadcaseName: 'Loadcase 2',
            title: 'p_i',
          },
        },
        {
          p0: {
            value: 1125,
            unit: 'N',
            short: 'P0',
            loadcaseName: 'Loadcase 3',
            title: 'p0',
          },
          p_i: {
            value: 1250,
            unit: 'N',
            short: 'P_i',
            loadcaseName: 'Loadcase 3',
            title: 'p_i',
          },
        },
        {
          p0: {
            value: 1125,
            unit: 'N',
            short: 'P0',
            loadcaseName: 'Loadcase 4',
            title: 'p0',
          },
          p_i: {
            value: 1250,
            unit: 'N',
            short: 'P_i',
            loadcaseName: 'Loadcase 4',
            title: 'p_i',
          },
        },
      ],
      loadcaseOverrollingFrequencies: [
        {
          BPFI: {
            value: '18.5926',
            unit: '1/s',
            short: 'BPFI',
            loadcaseName: 'Loadcase 1',
            title: 'BPFI',
          },
          BPFO: {
            value: '11.4074',
            unit: '1/s',
            short: 'BPFO',
            loadcaseName: 'Loadcase 1',
            title: 'BPFO',
          },
          BSF: {
            value: '6.1871',
            unit: '1/s',
            short: 'BSF',
            loadcaseName: 'Loadcase 1',
            title: 'BSF',
          },
          FTF: {
            value: '1.2675',
            unit: '1/s',
            short: 'FTF',
            loadcaseName: 'Loadcase 1',
            title: 'FTF',
          },
        },
        {
          BPFI: {
            value: '46.4816',
            unit: '1/s',
            short: 'BPFI',
            loadcaseName: 'Loadcase 2',
            title: 'BPFI',
          },
          BPFO: {
            value: '28.5184',
            unit: '1/s',
            short: 'BPFO',
            loadcaseName: 'Loadcase 2',
            title: 'BPFO',
          },
          BSF: {
            value: '15.4676',
            unit: '1/s',
            short: 'BSF',
            loadcaseName: 'Loadcase 2',
            title: 'BSF',
          },
          FTF: {
            value: '3.1687',
            unit: '1/s',
            short: 'FTF',
            loadcaseName: 'Loadcase 2',
            title: 'FTF',
          },
        },
        {
          BPFI: {
            value: '46.4816',
            unit: '1/s',
            short: 'BPFI',
            loadcaseName: 'Loadcase 3',
            title: 'BPFI',
          },
          BPFO: {
            value: '28.5184',
            unit: '1/s',
            short: 'BPFO',
            loadcaseName: 'Loadcase 3',
            title: 'BPFO',
          },
          BSF: {
            value: '15.4676',
            unit: '1/s',
            short: 'BSF',
            loadcaseName: 'Loadcase 3',
            title: 'BSF',
          },
          FTF: {
            value: '3.1687',
            unit: '1/s',
            short: 'FTF',
            loadcaseName: 'Loadcase 3',
            title: 'FTF',
          },
        },
        {
          BPFI: {
            value: '46.4816',
            unit: '1/s',
            short: 'BPFI',
            loadcaseName: 'Loadcase 4',
            title: 'BPFI',
          },
          BPFO: {
            value: '28.5184',
            unit: '1/s',
            short: 'BPFO',
            loadcaseName: 'Loadcase 4',
            title: 'BPFO',
          },
          BSF: {
            value: '15.4676',
            unit: '1/s',
            short: 'BSF',
            loadcaseName: 'Loadcase 4',
            title: 'BSF',
          },
          FTF: {
            value: '3.1687',
            unit: '1/s',
            short: 'FTF',
            loadcaseName: 'Loadcase 4',
            title: 'FTF',
          },
        },
      ],
      reportInputSuborinates: {
        inputSubordinates: [
          {
            hasNestedStructure: false,
            title: 'Bearing',
            titleID: 'STRING_OUTP_BEARING',
            subItems: [
              {
                hasNestedStructure: false,
                designation: 'Designation',
                value: '2303-TVH',
              },
              {
                hasNestedStructure: false,
                designation: 'Inside diameter',
                abbreviation: 'd',
                value: '17.000',
                unit: 'mm',
              },
              {
                hasNestedStructure: false,
                designation: 'Outside diameter',
                abbreviation: 'D',
                value: '47.000',
                unit: 'mm',
              },
              {
                hasNestedStructure: false,
                designation: 'Width',
                abbreviation: 'B',
                value: '19.000',
                unit: 'mm',
              },
              {
                hasNestedStructure: false,
                designation: 'Basic dynamic load rating',
                abbreviation: 'C',
                value: '13900',
                unit: 'N',
              },
              {
                hasNestedStructure: false,
                designation: 'Basic static load rating',
                abbreviation: 'C0',
                value: '3200',
                unit: 'N',
              },
              {
                hasNestedStructure: false,
                designation: 'Fatigue limit load',
                abbreviation: 'Cu',
                value: '203',
                unit: 'N',
              },
              {
                hasNestedStructure: false,
                designation: 'Reference speed',
                abbreviation: 'n_ref',
                value: '14900.0',
                unit: '1/min',
              },
              {
                hasNestedStructure: false,
                designation: 'Limiting speed',
                abbreviation: 'n_lim',
                value: '17000.0',
                unit: '1/min',
              },
              {
                hasNestedStructure: false,
                designation: 'Limiting speed, oil',
                abbreviation: 'n_lim_o',
                value: '17000.0',
                unit: '1/min',
              },
              {
                hasNestedStructure: false,
                designation: 'Limiting speed, grease',
                abbreviation: 'n_lim_g',
                value: '14400.0',
                unit: '1/min',
              },
            ],
          },
          {
            hasNestedStructure: false,
            title: 'Basic frequency factors related to 1/s',
            titleID: 'STRING_OUTP_BASIC_FREQUENCIES_FACTOR',
            subItems: [
              {
                hasNestedStructure: false,
                designation: 'Overrolling frequency factor on outer ring',
                abbreviation: 'BPFFO',
                value: '3.4222',
              },
              {
                hasNestedStructure: false,
                designation: 'Overrolling frequency factor on inner ring',
                abbreviation: 'BPFFI',
                value: '5.5778',
              },
              {
                hasNestedStructure: false,
                designation: 'Overrolling frequency factor on rolling element',
                abbreviation: 'BSFF',
                value: '1.8561',
              },
              {
                hasNestedStructure: false,
                designation: 'Ring pass frequency factor on rolling element',
                abbreviation: 'RPFFB',
                value: '3.7122',
              },
              {
                hasNestedStructure: false,
                designation:
                  'Speed factor of rolling element set for rotating inner ring',
                abbreviation: 'FTFF_i',
                value: '0.3802',
              },
              {
                hasNestedStructure: false,
                designation:
                  'Speed factor of rolling element set for rotating outer ring',
                abbreviation: 'FTFF_o',
                value: '0.6198',
              },
            ],
            meaningfulRound: true,
          },
          {
            hasNestedStructure: false,
            title: 'Lubrication data',
            titleID: 'STRING_OUTP_LUBRICATING_DATA',
            subItems: [
              {
                hasNestedStructure: false,
                designation: 'Permitted lubricants',
                value: 'Oil or grease',
              },
              {
                hasNestedStructure: false,
                designation: 'Type of lubrication',
                value: 'grease',
              },
              {
                hasNestedStructure: false,
                designation: 'Type of grease',
                value: 'Arcanol MULTI2',
              },
              {
                hasNestedStructure: false,
                designation: 'Viscosity at 40°C',
                abbreviation: 'ny 40',
                value: '110.0',
                unit: 'mm²/s',
              },
              {
                hasNestedStructure: false,
                designation: 'Viscosity at 100°C',
                abbreviation: 'ny 100',
                value: '11.0',
                unit: 'mm²/s',
              },
              {
                hasNestedStructure: false,
                designation: 'Contamination',
                value: 'normal cleanliness',
              },
              {
                hasNestedStructure: false,
                designation: 'External heat flow',
                abbreviation: 'dQ/dt',
                value: '0.0',
                unit: 'kW',
              },
            ],
          },
          {
            hasNestedStructure: false,
            title: 'Other conditions',
            titleID: 'STRING_OUTP_MISCELLANEOUS_DATA',
            subItems: [
              {
                hasNestedStructure: false,
                designation: 'Ambient temperature',
                abbreviation: 't',
                value: '20.0',
                unit: '°C',
              },
              {
                hasNestedStructure: false,
                designation: 'Environmental influence',
                value: '0.8 (moderate)',
              },
              {
                hasNestedStructure: false,
                designation: 'Requisite reliability',
                value: '90 %',
              },
              {
                hasNestedStructure: false,
                designation: 'Condition of rotation',
                value: 'rotating inner ring',
              },
            ],
          },
          {
            hasNestedStructure: true,
            title: 'Load',
            titleID: 'STRING_OUTP_INPUT_DATA_FOR_ALL_LOADCASES',
            subItems: [
              {
                hasNestedStructure: false,
                title: 'Loadcase 1',
                subItems: [
                  {
                    hasNestedStructure: false,
                    designation: 'Time portion (q)',
                    value: '60.000',
                    unit: '%',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Type of motion',
                    value: 'rotating',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Speed (n_i)',
                    value: '200.00',
                    unit: '1/min',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Mean operating temperature (T)',
                    value: '70',
                    unit: '°C',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Radial load (Fr)',
                    value: '200.0',
                    unit: 'N',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Axial load (Fa)',
                    value: '0.0',
                    unit: 'N',
                  },
                ],
              },
              {
                hasNestedStructure: false,
                title: 'Loadcase 2',
                subItems: [
                  {
                    hasNestedStructure: false,
                    designation: 'Time portion (q)',
                    value: '10.000',
                    unit: '%',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Type of motion',
                    value: 'rotating',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Speed (n_i)',
                    value: '500.00',
                    unit: '1/min',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Mean operating temperature (T)',
                    value: '50',
                    unit: '°C',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Radial load (Fr)',
                    value: '500.0',
                    unit: 'N',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Axial load (Fa)',
                    value: '500.0',
                    unit: 'N',
                  },
                ],
              },
              {
                hasNestedStructure: false,
                title: 'Loadcase 3',
                subItems: [
                  {
                    hasNestedStructure: false,
                    designation: 'Time portion (q)',
                    value: '10.000',
                    unit: '%',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Type of motion',
                    value: 'rotating',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Speed (n_i)',
                    value: '500.00',
                    unit: '1/min',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Mean operating temperature (T)',
                    value: '50',
                    unit: '°C',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Radial load (Fr)',
                    value: '500.0',
                    unit: 'N',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Axial load (Fa)',
                    value: '500.0',
                    unit: 'N',
                  },
                ],
              },
              {
                hasNestedStructure: false,
                title: 'Loadcase 4',
                subItems: [
                  {
                    hasNestedStructure: false,
                    designation: 'Time portion (q)',
                    value: '10.000',
                    unit: '%',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Type of motion',
                    value: 'rotating',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Speed (n_i)',
                    value: '500.00',
                    unit: '1/min',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Mean operating temperature (T)',
                    value: '50',
                    unit: '°C',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Radial load (Fr)',
                    value: '500.0',
                    unit: 'N',
                  },
                  {
                    hasNestedStructure: false,
                    designation: 'Axial load (Fa)',
                    value: '500.0',
                    unit: 'N',
                  },
                ],
              },
            ],
          },
        ],
      },
      reportMessages: {
        errors: ['Calculation failed for some of the reason'],
        warnings: [
          'The total of the load case time portions is less than 100%. The missing time portion is assumed to be a stationary period.',
          '  · Sum of time proportions = 90.000 %',
          'Please note the miscibility of greases in the chapter on grease lubrication.',
        ],
        notes: [
          'Please note that operating temperature needs to meet conditions...',
        ],
      },
      loadcaseFriction: [
        {
          speedDependentFrictionalTorque: {
            value: 2.8,
            unit: 'N mm',
            short: 'M0',
            loadcaseName: 'Loadcase 1',
            title: 'speedDependentFrictionalTorque',
          },
          loadDependentFrictionalTorque: {
            value: 0.6,
            unit: 'N mm',
            short: 'M1',
            loadcaseName: 'Loadcase 1',
            title: 'loadDependentFrictionalTorque',
          },
          totalFrictionalTorque: {
            value: 3.4,
            unit: 'N mm',
            short: 'MR',
            loadcaseName: 'Loadcase 1',
            title: 'totalFrictionalTorque',
          },
          totalFrictionalPowerLoss: {
            value: 0,
            unit: 'kW',
            short: 'NR',
            loadcaseName: 'Loadcase 1',
            title: 'totalFrictionalPowerLoss',
          },
          thermallySafeOperatingSpeed: {
            value: 13_000,
            unit: '1/min',
            short: 'n_theta',
            loadcaseName: 'Loadcase 1',
            title: 'thermallySafeOperatingSpeed',
          },
        },
        {
          speedDependentFrictionalTorque: {
            value: 9,
            unit: 'N mm',
            short: 'M0',
            loadcaseName: 'Loadcase 2',
            title: 'speedDependentFrictionalTorque',
          },
          loadDependentFrictionalTorque: {
            value: 7.9,
            unit: 'N mm',
            short: 'M1',
            loadcaseName: 'Loadcase 2',
            title: 'loadDependentFrictionalTorque',
          },
          totalFrictionalTorque: {
            value: 16.9,
            unit: 'N mm',
            short: 'MR',
            loadcaseName: 'Loadcase 2',
            title: 'totalFrictionalTorque',
          },
          totalFrictionalPowerLoss: {
            value: 0,
            unit: 'kW',
            short: 'NR',
            loadcaseName: 'Loadcase 2',
            title: 'totalFrictionalPowerLoss',
          },
          thermallySafeOperatingSpeed: {
            value: 6000,
            unit: '1/min',
            short: 'n_theta',
            loadcaseName: 'Loadcase 2',
            title: 'thermallySafeOperatingSpeed',
          },
        },
        {
          speedDependentFrictionalTorque: {
            value: 9,
            unit: 'N mm',
            short: 'M0',
            loadcaseName: 'Loadcase 3',
            title: 'speedDependentFrictionalTorque',
          },
          loadDependentFrictionalTorque: {
            value: 7.9,
            unit: 'N mm',
            short: 'M1',
            loadcaseName: 'Loadcase 3',
            title: 'loadDependentFrictionalTorque',
          },
          totalFrictionalTorque: {
            value: 16.9,
            unit: 'N mm',
            short: 'MR',
            loadcaseName: 'Loadcase 3',
            title: 'totalFrictionalTorque',
          },
          totalFrictionalPowerLoss: {
            value: 0,
            unit: 'kW',
            short: 'NR',
            loadcaseName: 'Loadcase 3',
            title: 'totalFrictionalPowerLoss',
          },
          thermallySafeOperatingSpeed: {
            value: 6000,
            unit: '1/min',
            short: 'n_theta',
            loadcaseName: 'Loadcase 3',
            title: 'thermallySafeOperatingSpeed',
          },
        },
        {
          speedDependentFrictionalTorque: {
            value: 9,
            unit: 'N mm',
            short: 'M0',
            loadcaseName: 'Loadcase 4',
            title: 'speedDependentFrictionalTorque',
          },
          loadDependentFrictionalTorque: {
            value: 7.9,
            unit: 'N mm',
            short: 'M1',
            loadcaseName: 'Loadcase 4',
            title: 'loadDependentFrictionalTorque',
          },
          totalFrictionalTorque: {
            value: 16.9,
            unit: 'N mm',
            short: 'MR',
            loadcaseName: 'Loadcase 4',
            title: 'totalFrictionalTorque',
          },
          totalFrictionalPowerLoss: {
            value: 0,
            unit: 'kW',
            short: 'NR',
            loadcaseName: 'Loadcase 4',
            title: 'totalFrictionalPowerLoss',
          },
          thermallySafeOperatingSpeed: {
            value: 6000,
            unit: '1/min',
            short: 'n_theta',
            loadcaseName: 'Loadcase 4',
            title: 'thermallySafeOperatingSpeed',
          },
        },
      ],
      loadcaseLubrication: [
        {
          operatingViscosity: {
            value: 28,
            unit: 'mm²/s',
            short: 'ny',
            loadcaseName: 'Loadcase 1',
            title: 'operatingViscosity',
          },
          referenceViscosity: {
            value: 97.9,
            unit: 'mm²/s',
            short: 'ny1',
            loadcaseName: 'Loadcase 1',
            title: 'referenceViscosity',
          },
          viscosityRatio: {
            value: 0.29,
            short: 'kappa',
            loadcaseName: 'Loadcase 1',
            title: 'viscosityRatio',
          },
          lifeAdjustmentFactor: {
            value: 0.53,
            short: 'a_ISO',
            loadcaseName: 'Loadcase 1',
            title: 'lifeAdjustmentFactor',
          },
        },
        {
          operatingViscosity: {
            value: 65.4,
            unit: 'mm²/s',
            short: 'ny',
            loadcaseName: 'Loadcase 2',
            title: 'operatingViscosity',
          },
          referenceViscosity: {
            value: 45.8,
            unit: 'mm²/s',
            short: 'ny1',
            loadcaseName: 'Loadcase 2',
            title: 'referenceViscosity',
          },
          viscosityRatio: {
            value: 1.43,
            short: 'kappa',
            loadcaseName: 'Loadcase 2',
            title: 'viscosityRatio',
          },
          lifeAdjustmentFactor: {
            value: 2.77,
            short: 'a_ISO',
            loadcaseName: 'Loadcase 2',
            title: 'lifeAdjustmentFactor',
          },
        },
        {
          operatingViscosity: {
            value: 65.4,
            unit: 'mm²/s',
            short: 'ny',
            loadcaseName: 'Loadcase 3',
            title: 'operatingViscosity',
          },
          referenceViscosity: {
            value: 45.8,
            unit: 'mm²/s',
            short: 'ny1',
            loadcaseName: 'Loadcase 3',
            title: 'referenceViscosity',
          },
          viscosityRatio: {
            value: 1.43,
            short: 'kappa',
            loadcaseName: 'Loadcase 3',
            title: 'viscosityRatio',
          },
          lifeAdjustmentFactor: {
            value: 2.77,
            short: 'a_ISO',
            loadcaseName: 'Loadcase 3',
            title: 'lifeAdjustmentFactor',
          },
        },
        {
          operatingViscosity: {
            value: 65.4,
            unit: 'mm²/s',
            short: 'ny',
            loadcaseName: 'Loadcase 4',
            title: 'operatingViscosity',
          },
          referenceViscosity: {
            value: 45.8,
            unit: 'mm²/s',
            short: 'ny1',
            loadcaseName: 'Loadcase 4',
            title: 'referenceViscosity',
          },
          viscosityRatio: {
            value: 1.43,
            short: 'kappa',
            loadcaseName: 'Loadcase 4',
            title: 'viscosityRatio',
          },
          lifeAdjustmentFactor: {
            value: 2.77,
            short: 'a_ISO',
            loadcaseName: 'Loadcase 4',
            title: 'lifeAdjustmentFactor',
          },
        },
      ],
    },
  };
