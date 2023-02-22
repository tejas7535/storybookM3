import { Keyboard } from '@gq/shared/models';

import { IsDashOrEmptyStringPipe } from './is-dash-or-empty-string.pipe';

describe('Pipe: IsDashOrEmptyStringPipe', () => {
  const pipe = new IsDashOrEmptyStringPipe();
  test('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  describe('transform', () => {
    test('should return true, if value is empty', () => {
      const result = pipe.transform('');
      expect(result).toBe(true);
    });

    test('should return true, if value is undefined', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = pipe.transform(undefined);
      expect(result).toBe(true);
    });

    test('should return true, if value is "Keyboard.DASH"', () => {
      const result = pipe.transform(Keyboard.DASH);
      expect(result).toBe(true);
    });
    test('should return false, if value is any kind of string', () => {
      const result = pipe.transform('this is a string');
      expect(result).toBe(false);
    });
  });
});
