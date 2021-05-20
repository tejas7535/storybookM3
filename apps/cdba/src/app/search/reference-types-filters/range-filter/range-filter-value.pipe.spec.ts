import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

import de from '@angular/common/locales/de';

import { TranslocoService } from '@ngneat/transloco';
import { FilterItemRange } from '../../../core/store/reducers/search/models';
import { RangeFilterValuePipe } from './range-filter-value.pipe';

registerLocaleData(de, 'de-DE');

describe('RangeFilterValuePipe', () => {
  let spectator: SpectatorPipe<RangeFilterValuePipe>;

  const createPipe = createPipeFactory({
    pipe: RangeFilterValuePipe,
    providers: [
      {
        provide: TranslocoService,
        useValue: { translate: jest.fn(() => 'Length') },
      },
      {
        provide: LOCALE_ID,
        useValue: 'de-DE',
      },
    ],
    template: `{{ input | rangeFilterValue }}`,
  });

  afterEach(() => {
    spectator = undefined;
  });

  describe('transform for de-DE', () => {
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
      filter.minSelected = 10.2252;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = 'Min. Length: 10,23xy';

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform correct for maxSelected', () => {
      filter.maxSelected = 90.054;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = 'Max. Length: 90,05xy';

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform for min and maxSelected', () => {
      filter.minSelected = 10;
      filter.maxSelected = 90;
      filter.unit = 'mm';
      spectator = createPipe({ hostProps: { input: filter } });

      expected = '10,00mm - 90,00mm';

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform budget_quantity without decimal places as it is a sum', () => {
      filter.minSelected = 1230;
      filter.maxSelected = 2000;
      filter.unit = 'pc';
      filter.name = 'budget_quantity';

      spectator = createPipe({ hostProps: { input: filter } });

      expected = '1.230pc - 2.000pc';

      expect(spectator.element).toHaveText(expected);
    });
  });
});
