import {
  ResultItem,
  ResultItemWithTitle,
} from '@mm/core/store/models/calculation-result-state.model';

export const EMPTY_POSITIONS: ResultItem[] = [];

export const NO_IMPORTANT_POSITIONS: ResultItem[] = [
  {
    abbreviation: 'Fx_ini',
    designation: 'Required initial load',
    unit: 'kN',
    value: '296.6',
  },
  {
    abbreviation: 'p_jnt_ini',
    designation: 'Initial joint pressure',
    unit: 'N/mm²',
    value: '2.1',
  },
];

export const SOME_IMPORTANT_POSITIONS: ResultItem[] = [
  {
    abbreviation: 'Fx_ini',
    designation: 'Required initial load',
    unit: 'kN',
    value: '296.6',
  },
  {
    abbreviation: 'p_oil_ini', // Important
    designation: 'Required initial oil pressure',
    unit: 'bar',
    value: '19.88',
  },
  {
    abbreviation: 'p_jnt_ini',
    designation: 'Initial joint pressure',
    unit: 'N/mm²',
    value: '2.1',
  },
];

export const ALL_IMPORTANT_POSITIONS: ResultItem[] = [
  {
    abbreviation: 'n_sld', // Important - second in order
    designation: 'Number of sliding surfaces',
    unit: '-',
    value: '1',
  },
  {
    abbreviation: 'p_oil_ini', // Important - first in order
    designation: 'Required initial oil pressure',
    unit: 'bar',
    value: '19.88',
  },
];

export const MIXED_IMPORTANT_POSITIONAL_REVERSE_ORDER: ResultItem[] = [
  {
    abbreviation: 'p_jnt_ini', // Not important
    designation: 'Initial joint pressure',
    unit: 'N/mm²',
    value: '2.1',
  },
  {
    abbreviation: 'n_sld', // Important - second in order
    designation: 'Number of sliding surfaces',
    unit: '-',
    value: '1',
  },
  {
    abbreviation: 'Fx_ini', // Not important
    designation: 'Required initial load',
    unit: 'kN',
    value: '296.6',
  },
  {
    abbreviation: 'p_oil_ini', // Important - first in order
    designation: 'Required initial oil pressure',
    unit: 'bar',
    value: '19.88',
  },
];

export const EMPTY_END_POSITIONS: ResultItem[] = [];

export const NO_IMPORTANT_END_POSITIONS: ResultItem[] = [
  {
    abbreviation: 'eps_d_ir',
    designation: 'Inner raceway expansion',
    unit: '‰',
    value: '0.450',
  },
  {
    abbreviation: 'Fx_hld',
    designation: 'Holding load',
    unit: 'kN',
    value: '610.6',
  },
];

export const SOME_IMPORTANT_END_POSITIONS: ResultItem[] = [
  {
    abbreviation: 'dx_mnt', // Important
    designation: 'Displacement (start to end position)',
    unit: 'mm',
    value: '5.397',
  },
  {
    abbreviation: 'p_jnt_mnt',
    designation: 'Joint pressure after mounting',
    unit: 'N/mm²',
    value: '10.7',
  },
  {
    abbreviation: 'σ_t_b',
    designation: 'Tangential stress (bore)',
    unit: 'N/mm²',
    value: '103.9',
  },
];

export const ALL_IMPORTANT_END_POSITIONS: ResultItem[] = [
  {
    abbreviation: 'Fx_mnt', // Important - second in order
    designation: 'Required mounting load',
    unit: 'kN',
    value: '1482.9',
  },
  {
    abbreviation: 'dx_mnt', // Important - first in order
    designation: 'Displacement (start to end position)',
    unit: 'mm',
    value: '5.397',
  },
];

export const MIXED_IMPORTANT_END_POSITIONAL_REVERSE_ORDER: ResultItem[] = [
  {
    abbreviation: 'p_jnt_mnt', // Not important
    designation: 'Joint pressure after mounting',
    unit: 'N/mm²',
    value: '10.7',
  },
  {
    abbreviation: 'Fx_mnt', // Important - second in order
    designation: 'Required mounting load',
    unit: 'kN',
    value: '1482.9',
  },
  {
    abbreviation: 'σ_t_rcw', // Not important
    designation: 'Tangential stress (raceway)',
    unit: 'N/mm²',
    value: '94.1',
  },
  {
    abbreviation: 'dx_mnt', // Important - first in order
    designation: 'Displacement (start to end position)',
    unit: 'mm',
    value: '5.397',
  },
];

export const RADIAL_CLEARANCE_RESULT_WITH_ITEMS: ResultItemWithTitle[] = [
  {
    title: 'Clearance 1',
    items: [
      {
        abbreviation: 'c1i1',
        designation: 'Item 1',
        value: '0.1 mm',
      },
      {
        abbreviation: 'c1i2',
        designation: 'Item 2',
        value: '0.2 mm',
      },
    ],
  },
  {
    title: 'Clearance 2',
    items: [
      {
        abbreviation: 'c2i1',
        designation: 'Item 3',
        value: '0.3 mm',
        title: 'Original Title 3',
      },
    ],
  },
] as ResultItemWithTitle[];

export const CLEARANCE_CLASSES_RESULT_WITH_ITEMS: ResultItemWithTitle[] = [
  {
    title: 'Class 1',
    items: [
      {
        abbreviation: 'c1i1',
        designation: 'Item 1',
        value: '0.1 mm',
      },
      {
        abbreviation: 'c1i2',
        designation: 'Item 2',
        value: '0.2 mm',
      },
    ],
  },
  {
    title: 'Class 2',
    items: [
      {
        abbreviation: 'c2i1',
        designation: 'Item 3',
        value: '0.3 mm',
      },
    ],
  },
] as ResultItemWithTitle[];
