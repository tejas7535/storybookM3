import { toCamelCase } from './text';

describe('toCamelCase', () => {
  it('should convert a single word to lowercase', () => {
    expect(toCamelCase('Hello')).toBe('hello');
  });

  it('should convert space-separated words to camelCase', () => {
    expect(toCamelCase('hello world')).toBe('helloWorld');
  });

  it('should convert hyphen-separated words to camelCase', () => {
    expect(toCamelCase('hello-world')).toBe('helloWorld');
  });

  it('should convert underscore-separated words to camelCase', () => {
    expect(toCamelCase('hello_world')).toBe('helloWorld');
  });

  it('should handle mixed separators correctly', () => {
    expect(toCamelCase('hello_world-test case')).toBe('helloWorldTestCase');
  });

  it('should handle uppercase input correctly', () => {
    expect(toCamelCase('HELLO_WORLD')).toBe('helloWorld');
  });

  it('should handle empty strings', () => {
    expect(toCamelCase('')).toBe('');
  });

  it('should handle strings with only separators', () => {
    expect(toCamelCase('---')).toBe('');
    expect(toCamelCase('__')).toBe('');
    expect(toCamelCase('   ')).toBe('');
  });

  it('should handle strings with leading and trailing separators', () => {
    expect(toCamelCase('-hello-world-')).toBe('helloWorld');
    expect(toCamelCase('_hello_world_')).toBe('helloWorld');
    expect(toCamelCase(' hello world ')).toBe('helloWorld');
  });
});
