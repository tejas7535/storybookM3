import { findProperty } from './form-helpers';

describe('Form Helpers', () => {
  const testObj = {
    string: 'string',
    number: 4,
    boolean: true,
  };

  describe('findProperty', () => {
    it('find true', () => {
      expect(findProperty(testObj, 'boolean')).toBe(true);
    });
    it('find unknown', () => {
      expect(findProperty(testObj, 'unknown')).toBe(undefined);
    });
    it('find numeric', () => {
      expect(findProperty(testObj, 'number')).toBe(4);
    });
    it('find string', () => {
      expect(findProperty<string>(testObj, 'string').split('r')).toStrictEqual([
        'st',
        'ing',
      ]);
    });
  });
});
