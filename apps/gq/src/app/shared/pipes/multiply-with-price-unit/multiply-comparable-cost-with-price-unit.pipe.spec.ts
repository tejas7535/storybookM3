import { Keyboard } from '@gq/shared/models';
import { HelperService } from '@gq/shared/services/helper-service/helper-service.service';
import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator';

import { MultiplyComparableCostWithPriceUnitPipe } from './multiply-comparable-cost-with-price-unit.pipe';

describe('MultiplyComparableCostWithPriceUnitPipe', () => {
  let pipe: MultiplyComparableCostWithPriceUnitPipe;
  let helperService: HelperService;
  let spectator: SpectatorPipe<MultiplyComparableCostWithPriceUnitPipe>;

  const createPipe = createPipeFactory({
    pipe: MultiplyComparableCostWithPriceUnitPipe,
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
    pipe = new MultiplyComparableCostWithPriceUnitPipe(helperService);
  });
  test('create instance', () => {
    expect(pipe).toBeTruthy();
  });

  test('should return dash for invalid Input', () => {
    const result = pipe.transform(undefined, 'EUR', 1, 1);
    expect(result).toEqual(Keyboard.DASH);
  });

  test('should not adjust value for missing sapPriceUnit', () => {
    const result = pipe.transform(1, 'EUR', 10, undefined as any);

    expect(helperService.transformMarginDetails).toHaveBeenCalledWith(1, 'EUR');
    expect(result).toEqual('result');
  });

  test('should adjust value for given sapPriceUnit', () => {
    const result = pipe.transform(50, 'EUR', 10, 100 as any);

    expect(helperService.transformMarginDetails).toHaveBeenCalledWith(
      500,
      'EUR'
    );
    expect(result).toEqual('result');
  });
});
