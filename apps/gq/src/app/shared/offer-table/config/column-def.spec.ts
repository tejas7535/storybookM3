import { TestBed } from '@angular/core/testing';

import { NumberFormatPipe } from '../../../shared/pipes/number-format.pipe';
import { numberFormatter } from './column-defs';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('columnDef', () => {
  TestBed.configureTestingModule({
    declarations: [NumberFormatPipe],
  });
  beforeEach(() => {
    NumberFormatPipe.prototype.transform = jest.fn();
  });

  describe('NumberFormatter', () => {
    test('should render Date', () => {
      numberFormatter({
        column: {},
      });
      expect(NumberFormatPipe.prototype.transform).toHaveBeenCalledTimes(1);
    });
  });
});
