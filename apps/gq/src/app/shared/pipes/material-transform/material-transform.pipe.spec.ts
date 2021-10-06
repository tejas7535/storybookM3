import { Keyboard } from '../../models';
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
  test('should transform string for 13 digit', () => {
    const pipe = new MaterialTransformPipe();
    const transformed = pipe.transform('0000009490000');
    expect(transformed).toEqual('000000949-0000');
  });
  test('should return dash', () => {
    const pipe = new MaterialTransformPipe();
    const transformed = pipe.transform(undefined as any);
    expect(transformed).toEqual(Keyboard.DASH);
  });
});
