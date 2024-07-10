import { HttpParamsEncoder } from './http-params-encoder';

describe('HttpParamsEncoder', () => {
  test('should be created', () => {
    const encoder: HttpParamsEncoder = new HttpParamsEncoder();

    expect(encoder).toBeTruthy();
  });
  test('should encode key', () => {
    const encoder: HttpParamsEncoder = new HttpParamsEncoder();
    const key = 'test key';
    const encodedKey = encoder.encodeKey(key);

    expect(encodedKey).toBe('test%20key');
  });

  test('should encode value', () => {
    const encoder: HttpParamsEncoder = new HttpParamsEncoder();
    const value = 'test value';
    const encodedValue = encoder.encodeValue(value);

    expect(encodedValue).toBe('test%20value');
  });

  test('should decode key', () => {
    const encoder: HttpParamsEncoder = new HttpParamsEncoder();
    const encodedKey = 'test%20key';
    const decodedKey = encoder.decodeKey(encodedKey);

    expect(decodedKey).toBe('test key');
  });

  test('should decode value', () => {
    const encoder: HttpParamsEncoder = new HttpParamsEncoder();
    const encodedValue = 'test%20value';
    const decodedValue = encoder.decodeValue(encodedValue);

    expect(decodedValue).toBe('test value');
  });
});
