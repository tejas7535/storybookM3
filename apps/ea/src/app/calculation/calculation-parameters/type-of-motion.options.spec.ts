import { firstValueFrom, of } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';

import { getTypeOfMotion } from './type-of-motion.options';

describe('TypeOfMotionOptions', () => {
  test('getTypeOfMotion', async () => {
    const translocoService = jest.fn(() => ({
      selectTranslate: (key: string) => of(key),
    }));

    expect(
      await firstValueFrom(
        getTypeOfMotion(translocoService() as TranslocoService, [
          { value: 'LB_OSCILLATING' },
          { value: 'LB_ROTATING' },
        ])
      )
    ).toMatchSnapshot();
  });
});
