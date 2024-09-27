import { UndefinedToDashPipe } from './undefined-to-dash.pipe';

describe('UndefinedToDashPipe', () => {
  beforeEach(() => jest.resetAllMocks());
  it('create an instance', () => {
    const pipe = new UndefinedToDashPipe();
    expect(pipe).toBeTruthy();
  });
  test('should return dash for undefined', () => {
    const pipe = new UndefinedToDashPipe();

    const result = pipe.transform(undefined as any);
    expect(result).toBe('-');
  });
  test('should return dash for null', () => {
    const pipe = new UndefinedToDashPipe();

    const result = pipe.transform(null);
    expect(result).toBe('-');
  });
  test('should return value', () => {
    const pipe = new UndefinedToDashPipe();
    const value = 'avc';

    const result = pipe.transform(value);
    expect(result).toBe(value);
  });
});
