import { firstValueFrom, of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { getEnvironmentalInfluenceOptions } from './environmental-influence.options';

describe('EnvironmentalInfluenceOptions', () => {
  const translocoService = jest.fn(() => ({
    selectTranslate: (key: string) => of(key),
  }));

  test('getEnvironmentalInfluenceOptions', async () => {
    const result = await firstValueFrom(
      getEnvironmentalInfluenceOptions(translocoService() as TranslocoService)
    );
    expect(result).toMatchSnapshot();
  });
});
