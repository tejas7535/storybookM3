import { NumberFormatPipe } from './number-format.pipe';

describe('NumberFormatPipe', () => {
  test('create an instance', () => {
    const pipe = new NumberFormatPipe();
    expect(pipe).toBeTruthy();
  });
  test('transform data with digits', () => {
    const pipe = new NumberFormatPipe();
    const result = pipe.transform(10000, '');

    expect(result).toEqual('10,000.00');
  });
  test('transform data without digits', () => {
    const pipe = new NumberFormatPipe();
    const result = pipe.transform(10000, 'orderQuantity');

    expect(result).toEqual('10,000');
  });
});
