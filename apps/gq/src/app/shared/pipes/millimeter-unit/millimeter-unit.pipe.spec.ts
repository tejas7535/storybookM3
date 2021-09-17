import { MillimeterUnitPipe } from './millimeter-unit.pipe';

describe('MillimeterUnitPipe', () => {
  test('create an instance', () => {
    const pipe = new MillimeterUnitPipe();
    expect(pipe).toBeTruthy();
  });
  test('should add length unit mm', () => {
    const pipe = new MillimeterUnitPipe();
    const result = pipe.transform(`90`);
    expect(result).toEqual(`90mm`);
  });
  test('should display dash', () => {
    const pipe = new MillimeterUnitPipe();
    const result = pipe.transform(undefined as any);
    expect(result).toEqual(`-`);
  });
});
