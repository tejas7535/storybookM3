import { DefaultValuePipe } from './default-value.pipe';

describe('DefaultValuePipe', () => {
  let pipe: DefaultValuePipe;

  beforeEach(() => {
    pipe = new DefaultValuePipe();
  });
  test('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  test('should return dash only if value undefined and suffix not passed', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = pipe.transform(undefined, undefined);
    expect(result).toEqual('-');
  });

  test('should return dash only if value undefined and suffix is passed', () => {
    const result = pipe.transform(undefined, '€');
    expect(result).toEqual('-');
  });

  test('should return value with suffix', () => {
    const result = pipe.transform(200, '€');
    expect(result).toEqual('200 €');
  });

  test('should return value without suffix', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = pipe.transform(200, undefined);
    expect(result).toEqual('200');
  });
});
