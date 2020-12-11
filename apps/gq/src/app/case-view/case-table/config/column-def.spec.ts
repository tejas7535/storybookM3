import { dateFormatter, filterParams } from './column-def';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('columnDef', () => {
  describe('dateFormatter', () => {
    test('should render Date', () => {
      const data = {
        value: '2020-11-24T07:46:32.446388',
      };
      const res = dateFormatter(data);

      const expected = new Date(data.value).toLocaleDateString();
      expect(res).toEqual(expected);
    });
    test('should render Date', () => {
      const data = {};
      const res = dateFormatter(data);
      expect(res).toEqual('');
    });
  });
  describe('dateComparator', () => {
    let cellDate: string;
    beforeEach(() => {
      cellDate = '2020-12-02T08:09:03.9619909';
    });
    test('should return 0', () => {
      const compareDate = new Date('2020-12-02T00:00:00');

      const res = filterParams.comparator(compareDate, cellDate);
      expect(res).toBe(0);
    });
    test('should return 1', () => {
      const compareDate = new Date('2020-12-01T00:00:00');

      const res = filterParams.comparator(compareDate, cellDate);
      expect(res).toBe(1);
    });
    test('should return -1', () => {
      const compareDate = new Date('2020-12-03T00:00:00');

      const res = filterParams.comparator(compareDate, cellDate);
      expect(res).toBe(-1);
    });
  });
});
