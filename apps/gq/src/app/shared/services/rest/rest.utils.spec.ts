import { requestBodyToHashCode } from './rest-utils';

describe('requestBodyToHashCode', () => {
  test('should hash request body', () => {
    const requestBody = {
      name: 'Guided Quoting',
    };

    const result = requestBodyToHashCode(requestBody);

    expect(result).toEqual('12262258836');
  });
});
