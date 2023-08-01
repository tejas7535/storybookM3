import { firstValueFrom, of } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { getContaminationOptions } from './contamination.options';

describe('ContaminationOptions', () => {
  const translocoService = jest.fn(() => ({
    selectTranslate: (key: string) => of(key),
  }));

  test('getContaminationOptions', async () => {
    const result = await firstValueFrom(
      getContaminationOptions(translocoService() as TranslocoService)
    );
    expect(result).toMatchSnapshot();
  });
});
