import { NullableStringPipe } from './nullable-string.pipe';

describe('NullableStringPipe', () => {
  test('create an instance', () => {
    const pipe = new NullableStringPipe();
    expect(pipe).toBeTruthy();
  });
  test('should add dash if value is not present', () => {
    const pipe = new NullableStringPipe();
    const result = pipe.transform(undefined as any);
    expect(result).toEqual('-');
  });
  test('should add dash if value length = 0', () => {
    const pipe = new NullableStringPipe();
    const result = pipe.transform('');
    expect(result).toEqual('-');
  });
  test('should normally display value', () => {
    const pipe = new NullableStringPipe();
    const input = 'exampleValue';
    const result = pipe.transform(input);
    expect(result).toEqual(input);
  });
});
