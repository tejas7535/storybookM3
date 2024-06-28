import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';

import { MaterialNumberService } from '../../services/material-number/material-number.service';
import { MaterialTransformPipe } from './material-transform.pipe';

describe('MaterialTransformPipe', () => {
  let spectator: SpectatorPipe<MaterialNumberService>;
  let materialTransformPipe: MaterialTransformPipe;
  let materialNumberService: MaterialNumberService;

  const createPipe = createPipeFactory({
    pipe: MaterialTransformPipe,
    providers: [MaterialNumberService],
  });

  beforeEach(() => {
    spectator = createPipe();
    materialNumberService = spectator.inject(MaterialNumberService);
    materialTransformPipe = new MaterialTransformPipe(materialNumberService);
  });

  test('create an instance', () => {
    expect(materialTransformPipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should call materialNumberService.formatStringAsNumber', () => {
      const TEST_STRING = '000000949000042';
      materialNumberService.formatStringAsMaterialNumber = jest.fn();

      materialTransformPipe.transform(TEST_STRING);

      expect(materialNumberService.formatStringAsMaterialNumber).toBeCalledWith(
        TEST_STRING
      );
      expect(
        materialNumberService.formatStringAsMaterialNumber
      ).toBeCalledTimes(1);
    });
  });
});
