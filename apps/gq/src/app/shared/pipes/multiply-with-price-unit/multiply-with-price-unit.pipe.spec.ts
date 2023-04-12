import { Keyboard } from '@gq/shared/models';
import { HelperService } from '@gq/shared/services/helper/helper.service';
import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator';

import { MultiplyWithPriceUnitPipe } from './multiply-with-price-unit.pipe';

describe('MultiplyWithPriceUnitPipe', () => {
  let pipe: MultiplyWithPriceUnitPipe;
  let helperService: HelperService;
  let spectator: SpectatorPipe<MultiplyWithPriceUnitPipe>;

  const createPipe = createPipeFactory({
    pipe: MultiplyWithPriceUnitPipe,
    providers: [
      {
        provide: HelperService,
        useValue: {
          transformMarginDetails: jest.fn().mockReturnValue('result'),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createPipe();
    helperService = spectator.inject(HelperService);
    pipe = new MultiplyWithPriceUnitPipe(helperService);
  });
  test('create instance', () => {
    expect(pipe).toBeTruthy();
  });

  test('should return dash for invalid value input', () => {
    const result = pipe.transform(undefined, 'EUR', 1, 1);
    expect(result).toEqual(Keyboard.DASH);
  });
  test('should return dash for invalid priceUnit Input', () => {
    const result = pipe.transform(1, 'EUR', undefined as any, undefined as any);
    expect(result).toEqual(Keyboard.DASH);
  });
  test('should adjust value for missing sapPriceUnit', () => {
    const result = pipe.transform(2, 'EUR', 10, undefined as any);

    expect(helperService.transformMarginDetails).toHaveBeenCalledWith(
      20,
      'EUR'
    );
    expect(result).toEqual('result');
  });

  test('should adjust value for given sapPriceUnit', () => {
    const result = pipe.transform(50, 'EUR', 10, 100 as any);

    expect(helperService.transformMarginDetails).toHaveBeenCalledWith(
      5000,
      'EUR'
    );
    expect(result).toEqual('result');
  });
});
