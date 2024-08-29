import { DeltaTagTypePipe } from './delta-tag-type.pipe';

describe('DeltaTagTypePipe', () => {
  test('create an instance', () => {
    const pipe = new DeltaTagTypePipe();
    expect(pipe).toBeTruthy();
  });

  test('should return error if value.absolute is less than 0', () => {
    const pipe = new DeltaTagTypePipe();
    expect(pipe.transform({ absolute: -1 } as any)).toBe('error');
  });

  test('should return success if value.absolute is greater than 0', () => {
    const pipe = new DeltaTagTypePipe();
    expect(pipe.transform({ absolute: 1 } as any)).toBe('success');
  });

  test('should return neutral if value.absolute is 0', () => {
    const pipe = new DeltaTagTypePipe();
    expect(pipe.transform({ absolute: 0 } as any)).toBe('neutral');
  });
});
