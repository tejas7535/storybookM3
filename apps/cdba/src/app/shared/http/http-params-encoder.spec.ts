import { HttpParamsEncoder } from './http-params-encoder';

describe('HttpParamsEncoder', () => {
  test('should be created', () => {
    const encoder: HttpParamsEncoder = new HttpParamsEncoder();

    expect(encoder).toBeTruthy();
  });
});
