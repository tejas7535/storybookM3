import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';

import { PercentagePipe } from './percentage.pipe';

describe('PercentagePipe', () => {
  let spectator: SpectatorPipe<PercentagePipe>;
  let transformationService: TransformationService;

  const createPipe = createPipeFactory({
    pipe: PercentagePipe,
    providers: [
      {
        provide: TransformationService,
        useValue: {
          transformPercentage: jest.fn(),
        },
      },
    ],
  });

  test('create an instance', () => {
    spectator = createPipe();
    transformationService = spectator.inject(TransformationService);

    const pipe = new PercentagePipe(transformationService);

    expect(pipe).toBeTruthy();
  });

  test('should call TransformationService', () => {
    spectator = createPipe();
    transformationService = spectator.inject(TransformationService);

    const pipe = new PercentagePipe(transformationService);

    pipe.transform(10);
    expect(transformationService.transformPercentage).toHaveBeenCalledTimes(1);
    expect(transformationService.transformPercentage).toHaveBeenCalledWith(10);
  });
});
