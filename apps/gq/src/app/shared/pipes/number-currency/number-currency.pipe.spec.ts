import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator';

import { HelperService } from '../../services/helper-service/helper-service.service';
import { NumberCurrencyPipe } from './number-currency.pipe';

describe('NumberCurrencyPipe', () => {
  let spectator: SpectatorPipe<NumberCurrencyPipe>;
  let helperService: HelperService;

  const createPipe = createPipeFactory({
    pipe: NumberCurrencyPipe,
    providers: [
      {
        provide: HelperService,
        useValue: {
          transformMarginDetails: jest.fn(),
        },
      },
    ],
  });

  test('create an instance', () => {
    spectator = createPipe();
    helperService = spectator.inject(HelperService);

    const pipe = new NumberCurrencyPipe(helperService);

    expect(pipe).toBeTruthy();
  });

  test('should transform number', () => {
    spectator = createPipe();
    helperService = spectator.inject(HelperService);

    const pipe = new NumberCurrencyPipe(helperService);

    pipe.transform(10_000, 'EUR');

    expect(helperService.transformMarginDetails).toHaveBeenCalledTimes(1);
    expect(helperService.transformMarginDetails).toHaveBeenCalledWith(
      10_000,
      'EUR'
    );
  });
});
