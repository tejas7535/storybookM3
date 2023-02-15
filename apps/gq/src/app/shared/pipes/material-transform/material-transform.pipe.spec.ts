import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator';

import { GlobalSearchResultsPreviewFormatterPipe } from '../../components/global-search-bar/global-search-results-preview-formatter/global-search-results-preview-formatter.pipe';
import { MaterialNumberService } from '../../services/material-number/material-number.service';
import { MaterialTransformPipe } from './material-transform.pipe';

describe('MaterialTransformPipe', () => {
  let spectator: SpectatorPipe<GlobalSearchResultsPreviewFormatterPipe>;
  let materialNumberService: MaterialNumberService;

  const createPipe = createPipeFactory({
    pipe: MaterialTransformPipe,
    providers: [
      {
        provide: MaterialNumberService,
        useValue: {
          formatStringAsMaterialNumber: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createPipe();
    materialNumberService = spectator.inject(MaterialNumberService);
  });

  test('create an instance', () => {
    const pipe = new MaterialTransformPipe(materialNumberService);
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should call materialNumberService.formatStringAsNumber', () => {
      const pipe = new MaterialTransformPipe(materialNumberService);
      const TEST_STRING = '000000949000042';

      pipe.transform(TEST_STRING);

      expect(materialNumberService.formatStringAsMaterialNumber).toBeCalledWith(
        TEST_STRING
      );
      expect(
        materialNumberService.formatStringAsMaterialNumber
      ).toBeCalledTimes(1);
    });
  });
});
