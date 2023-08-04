import { ValidatorFn, Validators } from '@angular/forms';

import { HB, HRA, HRB, HRC, HV } from './units';

export interface IndentationConfigColumns {
  columns: string[];
  unit: string;
}

export const SupportedUnits = [HV, HB, HRA, HRB, HRC];
export const SupportedFormFields = [
  'diameter',
  'diameterBall',
  'load',
  'thickness',
  'material',
  'value',
];

export interface IndentationConfig {
  [key: string]: {
    geometry: IndentationConfigColumns;
    correction?: IndentationConfigColumns;
    other?: IndentationConfigColumns;
    formfields: {
      [key: string]: ValidatorFn[];
    };
  };
}

export const INDENTATION_CONFIG: IndentationConfig = {
  hb: {
    geometry: {
      unit: 'mm',
      columns: [
        'width',
        'depth',
        'edge_distance',
        'indentation_distance',
        'minimum_thickness',
        'indenter_ratio',
        'force_diameter_index',
      ],
    },
    other: { unit: 'boolean', columns: ['valid'] },
    formfields: {
      value: [Validators.min(0), Validators.required],
      load: [Validators.min(0), Validators.required],
      diameterBall: [Validators.min(0), Validators.required],
    },
  },
  hv: {
    geometry: {
      unit: 'mm',
      columns: [
        'width',
        'depth',
        'edge_distance',
        'indentation_distance',
        'minimum_thickness',
      ],
    },
    correction: {
      unit: 'hv',
      columns: [
        'hardness_convex_sphere',
        'hardness_concave_cylinder_0',
        'hardness_concave_cylinder_45',
        'hardness_concave_sphere',
        'hardness_convex_cylinder_0',
        'hardness_convex_cylinder_45',
      ],
    },
    other: { unit: 'kp', columns: ['test_force'] },
    formfields: {
      value: [Validators.min(0), Validators.required],
      diameter: [Validators.min(0), Validators.required],
      load: [Validators.min(0), Validators.required],
      thickness: [Validators.min(0), Validators.required],
      material: [Validators.required],
    },
  },
  hra: {
    geometry: {
      unit: 'mm',
      columns: [
        'width',
        'depth',
        'edge_distance',
        'indentation_distance',
        'minimum_thickness',
      ],
    },
    correction: {
      unit: 'hra',
      columns: ['hardness_convex_cylinder'],
    },
    formfields: {
      diameter: [
        Validators.min(3.0001),
        Validators.max(18.9999),
        Validators.required,
      ],
      value: [
        Validators.min(20.0001),
        Validators.max(89.9999),
        Validators.required,
      ],
    },
  },
  hrb: {
    geometry: {
      unit: 'mm',
      columns: [
        'width',
        'depth',
        'edge_distance',
        'indentation_distance',
        'minimum_thickness',
      ],
    },
    correction: {
      unit: 'hrb',
      columns: ['hardness_convex_cylinder'],
    },
    formfields: {
      diameter: [
        Validators.min(3.0001),
        Validators.max(12.4999),
        Validators.required,
      ],
      value: [
        Validators.min(20.0001),
        Validators.max(99.9999),
        Validators.required,
      ],
    },
  },
  hrc: {
    geometry: {
      unit: 'mm',
      columns: [
        'width',
        'depth',
        'edge_distance',
        'indentation_distance',
        'minimum_thickness',
      ],
    },
    correction: {
      unit: 'hrc',
      columns: ['hardness_convex_cylinder', 'hardness_convex_sphere'],
    },
    formfields: {
      diameter: [
        Validators.min(3.0001),
        Validators.max(18.9999),
        Validators.required,
      ],
      value: [
        Validators.min(20.0001),
        Validators.max(89.9999),
        Validators.required,
      ],
    },
  },
};
