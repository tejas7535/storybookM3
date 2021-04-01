import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { FilterItemRange } from '../../../core/store/reducers/search/models';
import { RangeFilterValuePipe } from './range-filter-value.pipe';

describe('RangeFilterValuePipe', () => {
  let spectator: SpectatorPipe<RangeFilterValuePipe>;

  const createPipe = createPipeFactory({
    pipe: RangeFilterValuePipe,
    providers: [
      {
        provide: TranslocoService,
        useValue: { translate: jest.fn(() => 'Length') },
      },
    ],
    template: `{{ input | rangeFilterValue }}`,
  });

  afterEach(() => {
    spectator = undefined;
  });

  describe('transform', () => {
    let filter: FilterItemRange;
    let expected: string;

    beforeEach(() => {
      filter = new FilterItemRange(
        'length',
        0,
        100,
        undefined,
        undefined,
        'xy'
      );
    });

    test('should transform correct for minSelected', () => {
      filter.minSelected = 10;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = 'Min. Length: 10xy';

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform correct for maxSelected', () => {
      filter.maxSelected = 90;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = 'Max. Length: 90xy';

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform for min and maxSelected', () => {
      filter.minSelected = 10;
      filter.maxSelected = 90;
      filter.unit = 'mm';
      spectator = createPipe({ hostProps: { input: filter } });

      expected = '10mm - 90mm';

      expect(spectator.element).toHaveText(expected);
    });
  });
});
