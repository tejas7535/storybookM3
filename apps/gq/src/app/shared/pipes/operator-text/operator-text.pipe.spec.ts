import { OperatorTextPipe } from './operator-text.pipe';

describe('OperatorTextPipe', () => {
  it('create an instance', () => {
    const pipe = new OperatorTextPipe();
    expect(pipe).toBeTruthy();
  });
  test('should return "-" if value is less than 0', () => {
    const pipe = new OperatorTextPipe();
    const result = pipe.transform(-100);
    expect(result).toEqual('-');
  });
  test('should return "+" if value is greater than 0', () => {
    const pipe = new OperatorTextPipe();
    const result = pipe.transform(100);
    expect(result).toEqual('+');
  });
});
