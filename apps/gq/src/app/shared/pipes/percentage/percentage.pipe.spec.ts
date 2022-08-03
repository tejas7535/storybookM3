import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator';

import { HelperService } from '../../services/helper-service/helper-service.service';
import { PercentagePipe } from './percentage.pipe';

describe('PercentagePipe', () => {
  let spectator: SpectatorPipe<PercentagePipe>;
  let helperService: HelperService;

  const createPipe = createPipeFactory({
    pipe: PercentagePipe,
    providers: [
      {
        provide: HelperService,
        useValue: {
          transformPercentage: jest.fn(),
        },
      },
    ],
  });

  test('create an instance', () => {
    spectator = createPipe();
    helperService = spectator.inject(HelperService);

    const pipe = new PercentagePipe(helperService);

    expect(pipe).toBeTruthy();
  });

  test('should call HelperService', () => {
    spectator = createPipe();
    helperService = spectator.inject(HelperService);

    const pipe = new PercentagePipe(helperService);

    pipe.transform(10);
    expect(helperService.transformPercentage).toHaveBeenCalledTimes(1);
    expect(helperService.transformPercentage).toHaveBeenCalledWith(10);
  });
});
