import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator';

import { NumberCurrencyPipe } from './number-currency.pipe';

describe('NumberCurrencyPipe', () => {
  let spectator: SpectatorPipe<NumberCurrencyPipe>;
  let transformationService: TransformationService;

  const createPipe = createPipeFactory({
    pipe: NumberCurrencyPipe,
    providers: [
      {
        provide: TransformationService,
        useValue: {
          transformMarginDetails: jest.fn(),
        },
      },
    ],
  });

  test('create an instance', () => {
    spectator = createPipe();
    transformationService = spectator.inject(TransformationService);

    const pipe = new NumberCurrencyPipe(transformationService);

    expect(pipe).toBeTruthy();
  });

  test('should transform number', () => {
    spectator = createPipe();
    transformationService = spectator.inject(TransformationService);

    const pipe = new NumberCurrencyPipe(transformationService);

    pipe.transform(10_000, 'EUR');

    expect(transformationService.transformMarginDetails).toHaveBeenCalledTimes(
      1
    );
    expect(transformationService.transformMarginDetails).toHaveBeenCalledWith(
      10_000,
      'EUR'
    );
  });
});
