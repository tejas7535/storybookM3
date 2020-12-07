import { ValidationDescription } from '../../../../core/store/models';
import { infoComparator } from './column-defs';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('columnDef', () => {
  let cell1: any;
  let cell2: any;
  beforeAll(() => {
    cell1 = {
      valid: true,
      description: [ValidationDescription.Valid],
    };
    cell2 = {
      valid: false,
      description: [ValidationDescription.MaterialNumberInValid],
    };
  });

  test('should short info column', () => {
    const res = infoComparator(cell1, cell2);
    expect(res).toEqual(1);
  });
  test('should short info column', () => {
    cell2.valid = true;
    const res = infoComparator(cell1, cell2);
    expect(res).toEqual(0);
  });
  test('should short info column', () => {
    cell1.valid = false;
    cell2.valid = true;
    const res = infoComparator(cell1, cell2);
    expect(res).toEqual(-1);
  });
});
