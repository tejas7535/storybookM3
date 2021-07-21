import { dateFormatter } from './column-definitions';

describe('columnDef', () => {
  test('should render Date', () => {
    const data = {
      value: '2020-11-24T07:46:32.446388',
    };
    const res = dateFormatter(data);

    const expected = new Date(data.value).toLocaleDateString();
    expect(res).toEqual(expected);
  });
  test('should render empty Date', () => {
    const data = {};
    const res = dateFormatter(data);
    expect(res).toEqual('');
  });
});
