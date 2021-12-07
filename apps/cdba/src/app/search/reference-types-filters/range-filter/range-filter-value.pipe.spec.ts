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
  let expected: string;
  let filter: FilterItemRange;
  const translate = jest.fn();
  const localizeNumber = jest.fn();
  const numberInput = 1_234_567.891_011;
  const numberOutputDe = '1.234.567,89';
  const numberOutputEn = '1,234,567.89';
  const mockUnit = 'xy';

  const createPipe = createPipeFactory({
    pipe: RangeFilterValuePipe,
    providers: [
      mockProvider(TranslocoService, { translate }),
      mockProvider(TranslocoLocaleService, { localizeNumber }),
    ],
    template: `{{ input | rangeFilterValue }}`,
  });

  beforeEach(() => {
    translate.mockReturnValue(mockUnit);

    filter = new FilterItemRange(
      'length',
      0,
      100,
      undefined,
      undefined,
      mockUnit
    );
  });

  afterEach(() => {
    spectator = undefined;
  });

  describe('transform for DE locale', () => {
    beforeEach(() => {
      localizeNumber.mockReturnValue(numberOutputDe);
    });

    test('should transform correct for minSelected', () => {
      filter.minSelected = numberInput;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = `Min. ${numberOutputDe}${mockUnit}`;

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform correct for maxSelected', () => {
      filter.maxSelected = numberInput;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = `Max. ${numberOutputDe}${mockUnit}`;

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform for min and maxSelected', () => {
      filter.minSelected = numberInput;
      filter.maxSelected = numberInput;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = `${numberOutputDe}${mockUnit} - ${numberOutputDe}${mockUnit}`;

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform budget_quantity without decimal places as it is a sum', () => {
      filter.minSelected = numberInput;
      filter.maxSelected = numberInput;
      filter.name = 'budget_quantity';

      spectator = createPipe({ hostProps: { input: filter } });

      expected = `${numberOutputDe}${mockUnit} - ${numberOutputDe}${mockUnit}`;

      expect(spectator.element).toHaveText(expected);
    });
  });

  describe('transform for US locale', () => {
    beforeEach(() => {
      localizeNumber.mockReturnValue(numberOutputEn);
    });

    test('should transform correct for minSelected', () => {
      filter.minSelected = numberInput;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = `Min. ${numberOutputEn}${mockUnit}`;

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform correct for maxSelected', () => {
      filter.maxSelected = numberInput;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = `Max. ${numberOutputEn}${mockUnit}`;

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform for min and maxSelected', () => {
      filter.minSelected = numberInput;
      filter.maxSelected = numberInput;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = `${numberOutputEn}${mockUnit} - ${numberOutputEn}${mockUnit}`;

      expect(spectator.element).toHaveText(expected);
    });

    test('should transform budget_quantity without decimal places as it is a sum', () => {
      filter.minSelected = numberInput;
      filter.maxSelected = numberInput;
      filter.name = 'budget_quantity';

      spectator = createPipe({ hostProps: { input: filter } });

      expected = `${numberOutputEn}${mockUnit} - ${numberOutputEn}${mockUnit}`;

      expect(spectator.element).toHaveText(expected);
    });
  });

  describe('handle missing translations', () => {
    beforeEach(() => {
      localizeNumber.mockReturnValue(numberOutputDe);

      translate.mockReturnValue(
        `search.referenceTypesFilters.units.${mockUnit}`
      );
    });

    test('should hide the unit translation if it is not available', () => {
      filter.minSelected = numberInput;
      filter.maxSelected = numberInput;
      spectator = createPipe({ hostProps: { input: filter } });

      expected = `${numberOutputDe} - ${numberOutputDe}`;

      expect(spectator.element).toHaveText(expected);
    });
  });
});
