import { FeatureImportance } from '../models';

// name, x-value, y-value, importance
export const contract = [
  ['Half', -0.8, 0.58, -10],
  ['Half', -0.75, 0.7, -0.2],
  ['Half', -0.5, 0.55, 0.4],
  ['Half', -0.43, 0.6, 0.6],
  ['Half', -0.02, 0.5, 0.3],
  ['Fest', 0.5, 0.5, 0.2],
  ['Fest', 0.4, 0.58, 0.7],
  ['Fest', 0.3, 0.7, 0.7],
  ['Fest', 0.2, 0.55, -0.3],
  ['Fest', 0.1, 0.6, -0.2],
];

export const age = [
  ['18y', -0.8, 0.58, -10],
  ['20y', -0.7, 0.7, -10],
  ['24y', -0.6, 0.55, -10],
  ['28y', -0.5, 0.6, -0.4],
  ['32y', 0, 0.5, 0.23],
  ['52y', 0.1, 0.6, 0],
  ['48y', 0.2, 0.55, -10],
  ['42y', 0.3, 0.7, 0],
  ['38y', 0.4, 0.58, -0.2],
  ['60y', 0.5, 0.3, 0.3],
  ['32y', 0.6, 0.2, 0.8],
  ['32y', 0.7, 0.8, 0.45],
  ['32y', 0.9, 0.6, 0.12],
];

export const businessArea = [
  ['developer', -0.5, 0.58, -10],
  ['IT', -0.4, 0.7, 0],
  ['IT', -0.3, 0.55, -0.5],
  ['developer', -0.25, 0.6, 0.4],
  ['HR', -0.1, 0.5, 0.1],
  ['HR', 0.5, 0.5, 0.2],
  ['HR', 0.5, 0.55, 0.2],
  ['HR', 0.5, 0.6, 0.2],
  ['HR', 0.5, 0.65, 0.2],
  ['HR', 0.5, 0.7, 0.2],
  ['HR', 0.55, 0.5, 0.2],
  ['HR', 0.55, 0.55, 0.2],
  ['HR', 0.55, 0.6, 0.2],
  ['HR', 0.55, 0.65, 0.2],
  ['HR', 0.55, 0.7, 0.2],
  ['HR', 0.6, 0.5, 0.2],
  ['HR', 0.6, 0.55, 0.2],
  ['HR', 0.6, 0.6, 0.2],
  ['HR', 0.6, 0.65, 0.2],
  ['HR', 0.6, 0.7, 0.2],
  ['HR', 0.4, 0.58, -0.3],
  ['ML', 0.3, 0.7, 0],
  ['ML', 0.2, 0.55, -10],
  ['ML', 0.1, 0.6, 0],
  ['CEO', 2.8, 0.58, -0.3],
  ['CEO', 3, 0.7, 0],
  ['CEO', 3.1, 0.55, 0],
  ['CEO', 3.2, 0.6, 0],
];

export const featuresImportance: FeatureImportance[] = [
  {
    feature: 'Contract Type',
    data: contract,
  },
  {
    feature: 'Age',
    data: age,
  },
  {
    feature: 'Business Area',
    data: businessArea,
  },
  {
    feature: 'Service Len',
    data: contract,
  },
  {
    feature: 'Children Num',
    data: age,
  },
  {
    feature: 'Position Grad',
    data: businessArea,
  },
  {
    feature: 'Absence Days',
    data: contract,
  },
  {
    feature: 'Comm Dist',
    data: age,
  },
  {
    feature: 'PSG',
    data: businessArea,
  },
  {
    feature: 'Education',
    data: contract,
  },
  {
    feature: 'Position Grow',
    data: age,
  },
  {
    feature: 'Mariage',
    data: businessArea,
  },
  {
    feature: 'SubEntity',
    data: contract,
  },
  {
    feature: 'Position',
    data: age,
  },
  {
    feature: 'PA Score',
    data: businessArea,
  },
  {
    feature: 'OH Area',
    data: contract,
  },
  {
    feature: 'Gender',
    data: age,
  },
  {
    feature: 'Work Location',
    data: businessArea,
  },
  {
    feature: 'Job Catelog',
    data: contract,
  },
];
