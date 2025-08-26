import { Rect } from '../../core';
import { TableWithHeader } from './table-with-header';

describe('TableWithHeader', () => {
  let tableWithHeader: TableWithHeader;
  let mockPdfDoc: any;
  let mockHeader: any;
  let mockTable: any;
  let bounds: Rect;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockJsPdf = {
      getFont: jest
        .fn()
        .mockReturnValue({ fontName: 'Arial', fontStyle: 'normal' }),
      getFontSize: jest.fn().mockReturnValue(12),
      getLineHeightFactor: jest.fn().mockReturnValue(1.2),
      getTextDimensions: jest.fn().mockReturnValue({ w: 50, h: 10 }),
      getTextWidth: jest.fn().mockReturnValue(50),
    };

    mockPdfDoc = {
      reset: jest.fn(),
      pdfDoc: mockJsPdf,
    };

    mockHeader = {
      textValue: 'Test Header',
      fontPreference: { fontSize: 12, fontFamily: 'Arial' },
      underline: true,
      dividerColor: '#cccccc',
      evaluate: jest.fn().mockReturnValue([true, 30]),
      render: jest.fn(),
      setDocument: jest.fn(),
      setBounds: jest.fn(),
    };

    mockTable = {
      evaluate: jest.fn().mockReturnValue([true, 70]),
      render: jest.fn(),
      setDocument: jest.fn(),
      setBounds: jest.fn(),
      clearRowConfiguration: jest.fn(),
    };

    tableWithHeader = new TableWithHeader({
      header: mockHeader,
      table: mockTable,
      spacing: 5,
    });

    tableWithHeader.setDocument(mockPdfDoc);
    bounds = new Rect(10, 10, 200, 300);
  });

  it('should create an instance', () => {
    expect(tableWithHeader).toBeTruthy();
  });

  it('should evaluate header and table correctly when table fits', () => {
    const [fits, totalHeight] = tableWithHeader.evaluate(bounds);

    expect(fits).toBe(true);
    expect(totalHeight).toBe(105);

    expect(mockHeader.setDocument).toHaveBeenCalledWith(mockPdfDoc);
    expect(mockHeader.evaluate).toHaveBeenCalledWith(bounds);

    expect(mockTable.setDocument).toHaveBeenCalledWith(mockPdfDoc);

    const tableBoundsArg = mockTable.evaluate.mock.calls[0][0];
    expect(tableBoundsArg.x).toBe(bounds.x);
    expect(tableBoundsArg.y).toBe(bounds.y + 30 + 5);
    expect(tableBoundsArg.height).toBe(bounds.height - 30 - 5);
    expect(tableBoundsArg.width).toBe(bounds.width);
  });

  it('should handle table overflow correctly', () => {
    const mockFittingPart = {
      evaluate: jest.fn().mockReturnValue([true, 40]),
      render: jest.fn(),
      setDocument: jest.fn(),
      setBounds: jest.fn(),
      clearRowConfiguration: jest.fn(),
    };

    const mockOverflowPart = {
      evaluate: jest.fn().mockReturnValue([true, 30]),
      render: jest.fn(),
      setDocument: jest.fn(),
      setBounds: jest.fn(),
      clearRowConfiguration: jest.fn(),
    };

    mockTable.evaluate.mockReturnValue([
      false,
      70,
      mockFittingPart,
      mockOverflowPart,
    ]);

    const [fits, totalHeight] = tableWithHeader.evaluate(bounds);

    expect(fits).toBe(false);
    expect(totalHeight).toBe(bounds.height);
    expect(mockTable.clearRowConfiguration).toHaveBeenCalled();
  });

  it('should render both header and table', () => {
    tableWithHeader.evaluate(bounds);
    tableWithHeader.setBounds(bounds);

    tableWithHeader.render();

    expect(mockHeader.render).toHaveBeenCalled();
    expect(mockTable.render).toHaveBeenCalled();
  });
});
