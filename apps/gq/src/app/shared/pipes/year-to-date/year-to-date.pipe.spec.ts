import { YearToDatePipe } from './year-to-date.pipe';

describe('YearToDatePipe', () => {
  test('create an instance', () => {
    const pipe = new YearToDatePipe();
    expect(pipe).toBeTruthy();
  });
  test('should transform dateString', () => {
    const pipe = new YearToDatePipe();
    const result = pipe.transform(2022);

    expect(new Date(2022, 0, 1)).toEqual(result);
  });
});
