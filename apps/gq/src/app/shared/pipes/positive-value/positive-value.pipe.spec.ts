import { PositiveValuePipe } from './positive-value.pipe';

describe('PositiveValuePipe', () => {
  it('create an instance', () => {
    const pipe = new PositiveValuePipe();
    expect(pipe).toBeTruthy();
  });
  test('should return positive value when negative value is given', () => {
    const pipe = new PositiveValuePipe();
    const result = pipe.transform(-100);
    expect(result).toEqual(100);
  });
  test('should return positive value when positive value is given', () => {
    const pipe = new PositiveValuePipe();
    const result = pipe.transform(100);
    expect(result).toEqual(100);
  });
});
