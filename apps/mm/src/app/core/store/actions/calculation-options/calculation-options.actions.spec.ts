import { PreflightData } from '@mm/core/services/preflght-data-parser/preflight-data.interface';

import { CalculationOptionsActions } from '..';

describe('CalculationOptionsActions', () => {
  it('should create an action to fetch preflight options', () => {
    expect(CalculationOptionsActions.fetchPreflightOptions()).toMatchSnapshot();
  });

  it('should create an action to set preflight options', () => {
    expect(
      CalculationOptionsActions.setCalculationOptions({
        options: {
          innerRingExpansion: '0.35',
        } as Partial<PreflightData> as PreflightData,
      })
    ).toMatchSnapshot();
  });
});
