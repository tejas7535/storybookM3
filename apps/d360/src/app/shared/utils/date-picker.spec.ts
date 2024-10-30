import { mondayOfTheWeek } from './date-picker';

describe('DatePickerUtils', () => {
  test.each`
    input           | expected
    ${'2023-09-18'} | ${'2023-09-18'}
    ${'2023-09-22'} | ${'2023-09-18'}
    ${'2023-01-01'} | ${'2022-12-26'}
  `(
    'calculates the monday of the week right with dates',
    ({ input, expected }: { input: string; expected: string }) => {
      const inputDate: Date = new Date(input);
      const expectedDate: Date = new Date(expected);

      const result = mondayOfTheWeek(inputDate);
      expect(result).toStrictEqual(expectedDate);
    }
  );

  test.each`
    input           | expected
    ${'2023-09-18'} | ${'2023-09-18'}
    ${'2023-09-22'} | ${'2023-09-18'}
    ${'2023-01-01'} | ${'2022-12-26'}
  `(
    'calculates the monday of the week right with numbers',
    ({ input, expected }: { input: string; expected: string }) => {
      const inputDate: number = Date.parse(input);
      const expectedDate: Date = new Date(expected);

      const result = mondayOfTheWeek(inputDate);
      expect(result).toStrictEqual(expectedDate);
    }
  );
});
