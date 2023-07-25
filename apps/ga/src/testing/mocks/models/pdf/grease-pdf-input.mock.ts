import { GreasePdfInput } from '@ga/features/grease-calculation/calculation-result/models';

export const GREASE_PDF_INPUT_MOCK: GreasePdfInput = {
  sectionTitle: 'calculationResult.reportSectionInput',
  tableItems: [
    {
      title: 'Bearing data',
      items: [
        ['Designation ', '6220'],
        ['Design ', 'Radial deep groove ball bearing'],
        ['Series ', '62'],
      ],
    },
    {
      title: 'Bearing dimensions',
      items: [
        ['Width (B)', '34.000 mm'],
        ['Outside diameter (D)', '180.000 mm'],
        ['Inside diameter (d)', '100.000 mm'],
      ],
    },
    {
      title: 'Basic load ratings',
      items: [
        ['Basic static load rating (C0)', '93000 N'],
        ['Basic dynamic load rating (C)', '130000 N'],
      ],
    },
    {
      title: 'Operating conditions',
      items: [
        ['Type of movement ', 'rotating'],
        ['Relative speed (n_rel)', '1000.00 1/min'],
      ],
    },
    {
      title: 'Load',
      items: [
        ['Radial load (F_r)', '10000.00 N'],
        ['Axial load (F_a)', '0.00 N'],
      ],
    },
    {
      title: 'Temperatures',
      items: [
        ['Operating temperature (Theta)', '70.0 °C'],
        ['Ambient temperature (t)', '20 °C'],
        ['Environmental influence ', 'average'],
      ],
    },
  ],
};
