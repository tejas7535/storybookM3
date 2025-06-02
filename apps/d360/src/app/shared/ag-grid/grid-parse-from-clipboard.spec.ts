import { Column, GridApi, IRowNode } from 'ag-grid-enterprise';

import { gridParseFromClipboard } from './grid-parse-from-clipboard';

// Mock for the rowIsEmpty function
jest.mock('../components/ag-grid/validation-functions', () => ({
  rowIsEmpty: (node: IRowNode) =>
    node.data.every((item: string) => !item.trim()),
}));

describe('gridParseFromClipboard', () => {
  let mockGridApi: GridApi;
  let mockColumn: Column;
  let mockColumnNext: Column;

  beforeEach(() => {
    // Reset mocks before each test
    mockColumn = {
      getColDef: jest.fn().mockReturnValue({ field: 'col1' }),
    } as unknown as Column;

    mockColumnNext = {
      getColDef: jest.fn().mockReturnValue({ field: 'col2' }),
    } as unknown as Column;

    mockGridApi = {
      getFocusedCell: jest
        .fn()
        .mockReturnValue({ rowIndex: 0, column: mockColumn }),
      forEachNode: jest.fn().mockImplementation((callback) => {
        callback(
          { data: { col1: 'existing1', col2: 'existing2' } } as IRowNode,
          0
        );
        callback(
          { data: { col1: 'existing3', col2: 'existing4' } } as IRowNode,
          1
        );
      }),
      getDisplayedColAfter: jest.fn().mockReturnValue(mockColumnNext),
      applyTransaction: jest.fn(),
    } as unknown as GridApi;
  });

  it('should do nothing when no focused cell is present', () => {
    mockGridApi.getFocusedCell = jest.fn().mockReturnValue(null);

    gridParseFromClipboard(mockGridApi, [['data']]);

    expect(mockGridApi.applyTransaction).not.toHaveBeenCalled();
  });

  it('should update existing rows with clipboard data', () => {
    const clipboardData = [['new1', 'new2']];

    gridParseFromClipboard(mockGridApi, clipboardData);

    expect(mockGridApi.applyTransaction).toHaveBeenCalledWith({
      addIndex: 2,
      add: [],
      update: [{ col1: 'new1', col2: 'new2' }],
    });
  });

  it('should add new rows when clipboard data extends beyond existing data', () => {
    const clipboardData = [
      ['new1', 'new2'],
      ['new3', 'new4'],
      ['new5', 'new6'],
    ];

    gridParseFromClipboard(mockGridApi, clipboardData);

    expect(mockGridApi.applyTransaction).toHaveBeenCalledWith({
      addIndex: 2,
      add: [{ col1: 'new5', col2: 'new6' }],
      update: [
        { col1: 'new1', col2: 'new2' },
        { col1: 'new3', col2: 'new4' },
      ],
    });
  });

  it('should filter out empty rows from clipboard data', () => {
    const clipboardData = [
      ['new1', 'new2'],
      ['', ''], // Empty row
      ['new3', 'new4'],
    ];

    gridParseFromClipboard(mockGridApi, clipboardData);

    expect(mockGridApi.applyTransaction).toHaveBeenCalledWith({
      addIndex: 2,
      add: [],
      update: [
        { col1: 'new1', col2: 'new2' },
        { col1: 'new3', col2: 'new4' },
      ],
    });
  });

  it('should use parseSpecialFields function when provided', () => {
    const clipboardData = [['raw1', 'raw2']];
    const parseSpecialFields = jest.fn().mockImplementation((field, value) => {
      if (field === 'col1') {
        return `parsed_${value}`;
      }

      return value;
    });

    gridParseFromClipboard(mockGridApi, clipboardData, parseSpecialFields);

    expect(parseSpecialFields).toHaveBeenCalledWith('col1', 'raw1');
    expect(parseSpecialFields).toHaveBeenCalledWith('col2', 'raw2');
    expect(mockGridApi.applyTransaction).toHaveBeenCalledWith({
      addIndex: 2,
      add: [],
      update: [{ col1: 'parsed_raw1', col2: 'raw2' }],
    });
  });

  it('should trim whitespace from cell values', () => {
    const clipboardData = [[' data1 ', '  data2  ']];

    gridParseFromClipboard(mockGridApi, clipboardData);

    expect(mockGridApi.applyTransaction).toHaveBeenCalledWith({
      addIndex: 2,
      add: [],
      update: [{ col1: 'data1', col2: 'data2' }],
    });
  });

  it('should handle columns without field defined', () => {
    mockColumn = {
      getColDef: jest.fn().mockReturnValue({ field: undefined }),
    } as unknown as Column;

    mockGridApi.getFocusedCell = jest
      .fn()
      .mockReturnValue({ rowIndex: 0, column: mockColumn });

    const clipboardData = [['data1', 'data2']];

    gridParseFromClipboard(mockGridApi, clipboardData);

    // Should still process the data but skip the undefined field
    expect(mockGridApi.applyTransaction).toHaveBeenCalledWith({
      addIndex: 2,
      add: [],
      update: [{ col1: 'existing1', col2: 'existing2' }],
    });
  });

  it('should stop processing row cells when no next column exists', () => {
    // Make getDisplayedColAfter return null after first column
    mockGridApi.getDisplayedColAfter = jest
      .fn()
      .mockReturnValueOnce(mockColumnNext)
      .mockReturnValue(null);

    const clipboardData = [['data1', 'data2', 'data3']];

    gridParseFromClipboard(mockGridApi, clipboardData);

    // Should only process the first two columns since the third has no column
    expect(mockGridApi.applyTransaction).toHaveBeenCalledWith({
      addIndex: 2,
      add: [],
      update: [{ col1: 'data1', col2: 'data2' }],
    });
  });

  it('should handle empty cells in non-empty rows', () => {
    const clipboardData = [['data1', '', 'data3']];

    // Make a third column
    const mockColumnThird = {
      getColDef: jest.fn().mockReturnValue({ field: 'col3' }),
    } as unknown as Column;

    mockGridApi.getDisplayedColAfter = jest
      .fn()
      .mockReturnValueOnce(mockColumnNext)
      .mockReturnValueOnce(mockColumnThird)
      .mockReturnValue(null);

    gridParseFromClipboard(mockGridApi, clipboardData);

    // Empty cell should be stored as empty string
    expect(mockGridApi.applyTransaction).toHaveBeenCalledWith({
      addIndex: 2,
      add: [],
      update: [{ col1: 'data1', col2: '', col3: 'data3' }],
    });
  });

  it('should handle parseSpecialFields returning undefined', () => {
    const clipboardData = [['data1', 'data2']];
    const parseSpecialFields = jest.fn().mockImplementation((field, value) => {
      if (field === 'col1') {
        return;
      }

      return value;
    });

    gridParseFromClipboard(mockGridApi, clipboardData, parseSpecialFields);

    // Undefined value from parseSpecialFields should be converted to empty string
    expect(mockGridApi.applyTransaction).toHaveBeenCalledWith({
      addIndex: 2,
      add: [],
      update: [{ col1: '', col2: 'data2' }],
    });
  });
});
