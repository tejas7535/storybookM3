import { dummyRowData } from '../../../../core/store/reducers/create-case/config/dummy-row-data';
import { setStyle } from './default-column-defs';

describe('defaultColumnDef', () => {
  test('should setStyle', () => {
    const params = {
      data: dummyRowData,
    };
    const style = setStyle(params);
    expect(style).toEqual({ color: '#9ca2a5' });
  });
  test('should setStyle', () => {
    const params = {
      data: { materialNumber: '123', quantity: '10' },
    };
    const style = setStyle(params);
    expect(style).toEqual({});
  });
});
