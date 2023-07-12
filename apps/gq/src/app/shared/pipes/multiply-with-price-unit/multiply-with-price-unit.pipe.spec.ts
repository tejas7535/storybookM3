import { Keyboard } from '@gq/shared/models';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { MultiplyWithPriceUnitPipe } from './multiply-with-price-unit.pipe';

describe('MultiplyWithPriceUnitPipe', () => {
  let transformationService: TransformationService;
  let spectator: SpectatorPipe<MultiplyWithPriceUnitPipe>;

  const createPipe = createPipeFactory({
    pipe: MultiplyWithPriceUnitPipe,
    providers: [
      MockProvider(TransformationService, {
        transformNumberCurrency: jest.fn().mockReturnValue('result'),
      }),
    ],
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return dash for invalid value input', () => {
    spectator = createPipe(`{{ 'ab' | multiplyWithPriceUnit }}`);
    expect(spectator.element.textContent).toEqual(Keyboard.DASH);
  });

  test('should return dash for invalid priceUnit Input', () => {
    spectator = createPipe(
      `{{ 1 | multiplyWithPriceUnit : 'EUR' : undefined : undefined }}`
    );
    expect(spectator.element.textContent).toEqual(Keyboard.DASH);
  });

  test('should adjust value for missing sapPriceUnit', () => {
    spectator = createPipe(
      `{{ 2 | multiplyWithPriceUnit : 'EUR' : 10 : undefined }}`
    );
    transformationService = spectator.inject(TransformationService);

    expect(transformationService.transformNumberCurrency).toHaveBeenCalledWith(
      20,
      'EUR'
    );
    expect(spectator.element.textContent).toEqual('result');
  });

  test('should adjust value for given sapPriceUnit', () => {
    spectator = createPipe(
      `{{ 50 | multiplyWithPriceUnit : 'EUR' : 10 : 100 }}`
    );
    transformationService = spectator.inject(TransformationService);
    expect(transformationService.transformNumberCurrency).toHaveBeenCalledWith(
      5000,
      'EUR'
    );
    expect(spectator.element.textContent).toEqual('result');
  });
});
