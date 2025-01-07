import { firstValueFrom, of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import {
  getElectricityRegionOptions,
  getFossilOriginOptions,
} from './energy-source.options';

describe('EnergySourceOptions', () => {
  const translocoService = jest.fn(() => ({
    selectTranslate: (key: string) => of(key),
  }));

  test('getElectricityRegionOptions', async () => {
    const result = await firstValueFrom(
      getElectricityRegionOptions(translocoService() as TranslocoService)
    );
    expect(result).toMatchSnapshot();
  });

  test('getFossilOriginOptions', async () => {
    const result = await firstValueFrom(
      getFossilOriginOptions(translocoService() as TranslocoService)
    );
    expect(result).toMatchSnapshot();
  });
});
