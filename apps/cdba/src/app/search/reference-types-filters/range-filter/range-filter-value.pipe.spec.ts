import {
  createPipeFactory,
  mockProvider,
  SpectatorPipe,
} from '@ngneat/spectator/jest';

import { TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

import { FilterItemRange } from '../../../core/store/reducers/search/models';
import { RangeFilterValuePipe } from './range-filter-value.pipe';

describe('RangeFilterValuePipe', () => {
  let spectator: SpectatorPipe<RangeFilterValuePipe>;
  const translate = jest.fn();
  const localizeNumber = jest.fn();
  const numberInput = 1_234_567.891_011;
  const numberOutputDe = '1.234.567,89';
  const numberOutputEn = '1,234,567.89';

  const createPipe = createPipeFactory({
    pipe: RangeFilterValuePipe,
    providers: [
      mockProvider(TranslocoService, { translate }),
      mockProvider(TranslocoLocaleService, { localizeNumber }),
    ],
    template: `{{ input | rangeFilterValue }}`,
  });

  afterEach(() => {
    spectator = undefined;
  });

  describe('transform for DE locale', () => {
    let filter: FilterItemRange;
    let expected: string;

    beforeEach(() => {
      translate.mockReturnValue('Länge');
      localizeNumber.mockReturnValue(numberOutputDe);

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
      filter.minSelected = numberInput;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = `Min. Länge: ${numberOutputDe}xy`;

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform correct for maxSelected', () => {
      filter.maxSelected = numberInput;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = `Max. Länge: ${numberOutputDe}xy`;

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform for min and maxSelected', () => {
      filter.minSelected = numberInput;
      filter.maxSelected = numberInput;
      filter.unit = 'mm';
      spectator = createPipe({ hostProps: { input: filter } });

      expected = `${numberOutputDe}mm - ${numberOutputDe}mm`;

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform budget_quantity without decimal places as it is a sum', () => {
      filter.minSelected = numberInput;
      filter.maxSelected = numberInput;
      filter.unit = 'pc';
      filter.name = 'budget_quantity';

      spectator = createPipe({ hostProps: { input: filter } });

      expected = `${numberOutputDe}pc - ${numberOutputDe}pc`;

      expect(spectator.element).toHaveText(expected);
    });
  });

  describe('transform for US locale', () => {
    let filter: FilterItemRange;
    let expected: string;

    beforeEach(() => {
      translate.mockReturnValue('Length');
      localizeNumber.mockReturnValue(numberOutputEn);

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
      filter.minSelected = numberInput;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = `Min. Length: ${numberOutputEn}xy`;

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform correct for maxSelected', () => {
      filter.maxSelected = numberInput;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = `Max. Length: ${numberOutputEn}xy`;

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform for min and maxSelected', () => {
      filter.minSelected = numberInput;
      filter.maxSelected = numberInput;
      filter.unit = 'mm';
      spectator = createPipe({ hostProps: { input: filter } });

      expected = `${numberOutputEn}mm - ${numberOutputEn}mm`;

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform budget_quantity without decimal places as it is a sum', () => {
      filter.minSelected = numberInput;
      filter.maxSelected = numberInput;
      filter.unit = 'pc';
      filter.name = 'budget_quantity';

      spectator = createPipe({ hostProps: { input: filter } });

      expected = `${numberOutputEn}pc - ${numberOutputEn}pc`;

      expect(spectator.element).toHaveText(expected);
    });
  });
});
