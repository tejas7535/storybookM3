import { getIdForRow } from './datasources';

describe('getIdForRow', () => {
  it('should return id when it exists directly on the row object', () => {
    const row = { id: '123', someOtherProp: 'value' } as any;

    const result = getIdForRow(row);

    expect(result).toBe('123');
  });

  it('should return id from data property when direct id is undefined', () => {
    const row = {
      id: undefined,
      data: { id: '456' },
      someOtherProp: 'value',
    } as any;

    const result = getIdForRow(row);

    expect(result).toBe('456');
  });

  it('should return id from data property when direct id is null', () => {
    const row = {
      id: null,
      data: { id: '789' },
      someOtherProp: 'value',
    } as any;

    const result = getIdForRow(row);

    expect(result).toBe('789');
  });

  it('should throw an error when no id can be found', () => {
    const row = {
      id: undefined,
      data: { otherId: '123' },
      someOtherProp: 'value',
    } as any;

    expect(() => getIdForRow(row)).toThrow('Could not find id in row.');
  });

  it('should throw an error when both id properties are undefined', () => {
    const row = {
      id: undefined,
      data: { id: undefined },
      someOtherProp: 'value',
    } as any;

    expect(() => getIdForRow(row)).toThrow('Could not find id in row.');
  });
});
