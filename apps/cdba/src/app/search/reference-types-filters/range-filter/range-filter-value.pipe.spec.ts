import { TestBed } from '@angular/core/testing';

import { TranslocoService } from '@ngneat/transloco';
import { configureTestSuite } from 'ng-bullet';

import { FilterItemRange } from '../../../core/store/reducers/search/models';
import { RangeFilterValuePipe } from './range-filter-value.pipe';

describe('RangeFilterValuePipe', () => {
  let pipe: RangeFilterValuePipe;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        RangeFilterValuePipe,
        {
          provide: TranslocoService,
          useValue: { translate: jest.fn(() => 'Length') },
        },
      ],
    });
  });

  beforeEach(() => {
    pipe = TestBed.inject(RangeFilterValuePipe);
  });

  test('create an instance', () => {
    expect(pipe).toBeTruthy();
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

      expected = 'Min. Length: 10xy';

      expect(pipe.transform(filter)).toEqual(expected);
    });

    test('should transform correct for maxSelected', () => {
      filter.maxSelected = 90;

      expected = 'Max. Length: 90xy';

      expect(pipe.transform(filter)).toEqual(expected);
    });

    test('should transform for min and maxSelected', () => {
      filter.minSelected = 10;
      filter.maxSelected = 90;
      filter.unit = 'mm';

      expected = '10mm - 90mm';

      expect(pipe.transform(filter)).toEqual(expected);
    });
  });
});
