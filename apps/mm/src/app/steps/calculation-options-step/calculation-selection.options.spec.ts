import { firstValueFrom, of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import {
  getMountingOptions,
  getNumberOfPreviousMountingOptions,
  getShaftMaterialsOptions,
} from './calculation-selection.options';

describe('CalculationSelectionOptions', () => {
  const translocoService = jest.fn(() => ({
    selectTranslate: (key: string) => of(key),
  }));

  test('getNumberOfPreviousMountingOptions', async () => {
    const result = await firstValueFrom(
      getNumberOfPreviousMountingOptions(translocoService() as TranslocoService)
    );
    expect(result).toMatchSnapshot();
  });

  test('getMountingOptions', async () => {
    const result = await firstValueFrom(
      getMountingOptions(translocoService() as TranslocoService)
    );
    expect(result).toMatchSnapshot();
  });

  test('getShaftMaterialsOptions', async () => {
    const result = await firstValueFrom(
      getShaftMaterialsOptions(translocoService() as TranslocoService)
    );
    expect(result).toMatchSnapshot();
  });
});
