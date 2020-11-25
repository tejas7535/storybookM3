import * as InputSelectors from './input.selectors';

import { mockedMaterials } from '../../../mocks/mock.constants';

describe('InputSelectors', () => {
  it('should getHeatTreatmentList', () => {
    expect(
      InputSelectors.getHeatTreatmentList.projector(mockedMaterials, 'Plastik')
    ).toEqual([
      { name: 'Plastik', heatTreatment: 'volleHitze', hardness: 90001 },
      {
        name: 'Holz',
        heatTreatment: 'halbeHitze',
        hardness: 1,
        disabled: true,
      },
    ]);

    expect(
      InputSelectors.getHeatTreatmentList.projector(mockedMaterials, 'Holz')
    ).toEqual([
      { name: 'Holz', heatTreatment: 'halbeHitze', hardness: 1 },
      {
        name: 'Plastik',
        heatTreatment: 'volleHitze',
        hardness: 90001,
        disabled: true,
      },
    ]);
  });
});
