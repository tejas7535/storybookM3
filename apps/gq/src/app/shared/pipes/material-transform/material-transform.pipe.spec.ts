import { MaterialTransformPipe } from './material-transform.pipe';

describe('MaterialTransformPipe', () => {
  test('create an instance', () => {
    const pipe = new MaterialTransformPipe();
    expect(pipe).toBeTruthy();
  });

  test('should transform string', () => {
    const pipe = new MaterialTransformPipe();
    const transformed = pipe.transform('000000949000042');
    expect(transformed).toEqual('000000949-0000-42');
  });
});
