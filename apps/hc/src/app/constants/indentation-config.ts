import { ValidatorFn, Validators } from '@angular/forms';

import { StringOption } from '@schaeffler/inputs';

import { IndentationMaterial, IndentationResponse } from '../models';
import { HB, HRA, HRB, HRC, HV } from './units';

export const IntendationLoadValues = [
  0.001, 0.002, 0.003, 0.005, 0.01, 0.015, 0.02, 0.025, 0.05, 0.1, 0.2, 0.3,
  0.5, 1, 2, 3, 5, 10, 20, 30, 50, 100,
].map(
  (value) =>
    ({
      id: value,
      title: value.toString(),
    } as StringOption)
);

export const IntendationDiameterBallValues = [
  { diameter: 10, load: 3000 },
  { diameter: 10, load: 1500 },
  { diameter: 10, load: 1000 },
  { diameter: 10, load: 500 },
  { diameter: 10, load: 250 },
  { diameter: 10, load: 100 },
  { diameter: 5, load: 750 },
  { diameter: 5, load: 250 },
  { diameter: 5, load: 125 },
  { diameter: 5, load: 62.5 },
  { diameter: 5, load: 25 },
  { diameter: 2.5, load: 187.5 },
  { diameter: 2.5, load: 62.5 },
  { diameter: 2.5, load: 31.25 },
  { diameter: 2.5, load: 15.625 },
  { diameter: 2.5, load: 6.25 },
  { diameter: 1, load: 30 },
  { diameter: 1, load: 10 },
  { diameter: 1, load: 5 },
  { diameter: 1, load: 2.5 },
  { diameter: 1, load: 1 },
];

export const SupportedUnits = [HV, HB, HRA, HRB, HRC];
export const SupportedFormFields = [
  'diameter',
  'diameterBall',
  'load',
  'thickness',
  'material',
  'value',
];

export interface IndentationConfigColumn {
  name: keyof IndentationResponse;
  unit: string;
  format: string;
}

export interface IndentationConfig {
  [key: string]: {
    geometry: IndentationConfigColumn[];
    correction?: IndentationConfigColumn[];
    other?: IndentationConfigColumn[];
    formfields: {
      [key: string]: ValidatorFn[];
    };
  };
}

export const INDENTATION_CONFIG: IndentationConfig = {
  hb: {
    geometry: [
      { name: 'width', unit: 'mm', format: '1.0-3' },
      { name: 'depth', unit: 'mm', format: '1.0-3' },
      { name: 'edge_distance', unit: 'mm', format: '1.0-3' },
      { name: 'indentation_distance', unit: 'mm', format: '1.0-3' },
      { name: 'minimum_thickness', unit: 'mm', format: '1.0-3' },
      { name: 'indenter_ratio', unit: 'ppt', format: '1.0-1' },
    ],
    other: [{ name: 'force_diameter_index', unit: 'none', format: '1.0-1' }],
    formfields: {
      value: [Validators.min(0), Validators.required],
      diameterBall: [Validators.min(0), Validators.required],
    },
  },
  hv: {
    geometry: [
      { name: 'width', unit: 'mm', format: '1.0-3' },
      { name: 'depth', unit: 'mm', format: '1.0-3' },
      { name: 'edge_distance', unit: 'mm', format: '1.0-3' },
      { name: 'indentation_distance', unit: 'mm', format: '1.0-3' },
      { name: 'minimum_thickness', unit: 'mm', format: '1.0-3' },
    ],
    correction: [
      { name: 'hardness_convex_sphere', unit: 'hv', format: '1.0-0' },
      { name: 'hardness_concave_cylinder_0', unit: 'hv', format: '1.0-0' },
      { name: 'hardness_concave_cylinder_45', unit: 'hv', format: '1.0-0' },
      { name: 'hardness_concave_sphere', unit: 'hv', format: '1.0-0' },
      { name: 'hardness_convex_cylinder_0', unit: 'hv', format: '1.0-0' },
      { name: 'hardness_convex_cylinder_45', unit: 'hv', format: '1.0-0' },
    ],
    other: [{ name: 'test_force', unit: 'kp', format: '1.0-3' }],
    formfields: {
      value: [Validators.min(0), Validators.required],
      diameter: [Validators.min(0), Validators.required],
      load: [Validators.min(0), Validators.required],
      thickness: [Validators.min(0)],
      material: [Validators.required],
    },
  },
  hra: {
    geometry: [
      { name: 'width', unit: 'mm', format: '1.0-3' },
      { name: 'depth', unit: 'mm', format: '1.0-3' },
      { name: 'edge_distance', unit: 'mm', format: '1.0-3' },
      { name: 'indentation_distance', unit: 'mm', format: '1.0-3' },
      { name: 'minimum_thickness', unit: 'mm', format: '1.0-3' },
    ],
    correction: [
      { name: 'hardness_convex_cylinder', unit: 'hra', format: '1.1-1' },
    ],
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
    geometry: [
      { name: 'width', unit: 'mm', format: '1.0-3' },
      { name: 'depth', unit: 'mm', format: '1.0-3' },
      { name: 'edge_distance', unit: 'mm', format: '1.0-3' },
      { name: 'indentation_distance', unit: 'mm', format: '1.0-3' },
      { name: 'minimum_thickness', unit: 'mm', format: '1.0-3' },
    ],
    correction: [
      { name: 'hardness_convex_cylinder', unit: 'hrb', format: '1.0-1' },
    ],
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
    geometry: [
      { name: 'width', unit: 'mm', format: '1.0-3' },
      { name: 'depth', unit: 'mm', format: '1.0-3' },
      { name: 'edge_distance', unit: 'mm', format: '1.0-3' },
      { name: 'indentation_distance', unit: 'mm', format: '1.0-3' },
      { name: 'minimum_thickness', unit: 'mm', format: '1.0-3' },
    ],
    correction: [
      { name: 'hardness_convex_cylinder', unit: 'hrb', format: '1.0-1' },
      { name: 'hardness_convex_sphere', unit: 'hrb', format: '1.0-1' },
    ],
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

export const IndentationResetValues = {
  diameter: 3.5,
  diameterBall: IntendationDiameterBallValues[11],
  load: IntendationLoadValues[17],
  material: IndentationMaterial.FE,
};
