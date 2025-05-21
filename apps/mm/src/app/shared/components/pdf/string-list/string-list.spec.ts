import { Colors, Rect } from '@schaeffler/pdf-generator';

import { ListStyle, StringListComponent } from './string-list';

describe('StringListComponent', () => {
  let stringList: StringListComponent;
  let mockPdfDoc: any;
  const mockItems = ['Item 1', 'Item 2', 'Item 3'];

  beforeEach(() => {
    const mockJsPdf = {
      setFillColor: jest.fn(),
      rect: jest.fn(),
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

    stringList = new StringListComponent({
      items: mockItems,
    });

    stringList.setDocument(mockPdfDoc);

    // Mock the internal methods that interact with the PDF document
    jest.spyOn(stringList as any, 'getMultilineTextHeight').mockReturnValue(15);
    jest.spyOn(stringList as any, 'text').mockImplementation(() => {});
    jest
      .spyOn(stringList as any, 'assertDoc')
      .mockReturnValue(mockPdfDoc.pdfDoc);
  });

  describe('constructor', () => {
    it('should create an instance with default properties', () => {
      expect(stringList).toBeTruthy();
      expect((stringList as any).items).toEqual(mockItems);
      expect((stringList as any).fontOptions).toEqual({});
      expect((stringList as any).lineSpacing).toBe(1.4);
      expect((stringList as any).listStyle).toBe(ListStyle.NONE);
      expect((stringList as any).backgroundColor).toBe(Colors.Surface);
      expect((stringList as any).padding).toBe(8);
      expect((stringList as any).margin).toBe(0);
      expect((stringList as any).startNumber).toBe(1);
    });

    it('should create an instance with custom properties', () => {
      const customFontOptions = { fontSize: 14, fontStyle: 'bold' };
      const customLineSpacing = 2;
      const customListStyle = ListStyle.BULLET;
      const customBackgroundColor = Colors.Primary;
      const customPadding = 12;
      const customMargin = 5;
      const customStartNumber = 5;

      stringList = new StringListComponent({
        items: mockItems,
        fontOptions: customFontOptions,
        lineSpacing: customLineSpacing,
        listStyle: customListStyle,
        backgroundColor: customBackgroundColor,
        padding: customPadding,
        margin: customMargin,
        startNumber: customStartNumber,
      });

      expect((stringList as any).items).toEqual(mockItems);
      expect((stringList as any).fontOptions).toEqual(customFontOptions);
      expect((stringList as any).lineSpacing).toBe(customLineSpacing);
      expect((stringList as any).listStyle).toBe(customListStyle);
      expect((stringList as any).backgroundColor).toBe(customBackgroundColor);
      expect((stringList as any).padding).toBe(customPadding);
      expect((stringList as any).margin).toBe(customMargin);
      expect((stringList as any).startNumber).toBe(customStartNumber);
    });
  });

  describe('evaluate', () => {
    it('should return true when all items fit in the bounds', () => {
      const bounds = new Rect(0, 0, 300, 200);

      const [fits, height] = stringList.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBeGreaterThan(0);
      expect((stringList as any).fittingItems).toEqual(mockItems);
      expect((stringList as any).calculatedHeight).toBeGreaterThan(0);
    });

    it('should return false and split items when they do not fit in the bounds', () => {
      // Set up a smaller bounds to force overflow
      const bounds = new Rect(0, 0, 100, 20);

      // We need to completely re-mock getMultilineTextHeight for this specific test
      // to ensure it returns a height that will force an overflow condition
      const getHeightMock = jest.fn();

      // Return a large height value to ensure items don't fit
      getHeightMock.mockReturnValue(30);

      // Replace the existing mock with our new one
      jest
        .spyOn(stringList as any, 'getMultilineTextHeight')
        .mockImplementation(getHeightMock);

      const [fits, height, fittingComponent, overflowComponent] =
        stringList.evaluate(bounds);

      expect(fits).toBe(false);
      expect(height).toBeGreaterThan(0);
      expect(fittingComponent).toBeTruthy();
      expect(overflowComponent).toBeTruthy();
    });

    it('should handle empty items correctly', () => {
      stringList = new StringListComponent({
        items: [],
      });
      stringList.setDocument(mockPdfDoc);

      const bounds = new Rect(0, 0, 300, 200);

      const [fits, height] = stringList.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(16); // 2 * padding (8)
      expect((stringList as any).fittingItems).toEqual([]);
    });

    it('should skip empty items', () => {
      stringList = new StringListComponent({
        items: ['Item 1', '', 'Item 3'],
      });
      stringList.setDocument(mockPdfDoc);

      // Re-mock the internal methods
      jest
        .spyOn(stringList as any, 'getMultilineTextHeight')
        .mockReturnValue(15);

      const bounds = new Rect(0, 0, 300, 200);

      stringList.evaluate(bounds);

      expect((stringList as any).fittingItems).toEqual(['Item 1', 'Item 3']);
    });
  });

  describe('render', () => {
    it('should render background with correct color', () => {
      const bounds = new Rect(0, 0, 300, 200);
      stringList.setBounds(bounds);
      stringList.evaluate(bounds);
      stringList.render();

      expect(mockPdfDoc.pdfDoc.setFillColor).toHaveBeenCalledWith(
        Colors.Surface
      );
      expect(mockPdfDoc.pdfDoc.rect).toHaveBeenCalled();
    });

    it('should render items with bullet points when listStyle is BULLET', () => {
      stringList = new StringListComponent({
        items: mockItems,
        listStyle: ListStyle.BULLET,
      });
      stringList.setDocument(mockPdfDoc);

      // Re-mock the internal methods
      jest
        .spyOn(stringList as any, 'getMultilineTextHeight')
        .mockReturnValue(15);
      jest.spyOn(stringList as any, 'text').mockImplementation(() => {});
      jest
        .spyOn(stringList as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const bounds = new Rect(0, 0, 300, 200);
      stringList.setBounds(bounds);
      stringList.evaluate(bounds);
      stringList.render();

      // Check that text method was called twice for each item (bullet + text)
      expect((stringList as any).text).toHaveBeenCalledTimes(
        mockItems.length * 2
      );

      // Verify first item's bullet rendering
      expect((stringList as any).text).toHaveBeenCalledWith(
        bounds.x + (stringList as any).padding,
        expect.any(Number),
        '•',
        expect.any(Object)
      );
    });

    it('should render items with numbers when listStyle is NUMBERED', () => {
      stringList = new StringListComponent({
        items: mockItems,
        listStyle: ListStyle.NUMBERED,
      });
      stringList.setDocument(mockPdfDoc);

      // Re-mock the internal methods
      jest
        .spyOn(stringList as any, 'getMultilineTextHeight')
        .mockReturnValue(15);
      jest.spyOn(stringList as any, 'text').mockImplementation(() => {});
      jest
        .spyOn(stringList as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const bounds = new Rect(0, 0, 300, 200);
      stringList.setBounds(bounds);
      stringList.evaluate(bounds);
      stringList.render();

      // Check that text method was called twice for each item (number + text)
      expect((stringList as any).text).toHaveBeenCalledTimes(
        mockItems.length * 2
      );

      // Verify first item's number rendering
      expect((stringList as any).text).toHaveBeenCalledWith(
        bounds.x + (stringList as any).padding,
        expect.any(Number),
        '1.',
        expect.any(Object)
      );
    });

    it('should render items without prefixes when listStyle is NONE', () => {
      stringList = new StringListComponent({
        items: mockItems,
        listStyle: ListStyle.NONE,
      });
      stringList.setDocument(mockPdfDoc);

      // Re-mock the internal methods
      jest
        .spyOn(stringList as any, 'getMultilineTextHeight')
        .mockReturnValue(15);
      jest.spyOn(stringList as any, 'text').mockImplementation(() => {});
      jest
        .spyOn(stringList as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const bounds = new Rect(0, 0, 300, 200);
      stringList.setBounds(bounds);
      stringList.evaluate(bounds);
      stringList.render();

      // Check that text method was called once for each item (only text, no prefix)
      expect((stringList as any).text).toHaveBeenCalledTimes(mockItems.length);

      // Verify first item rendering
      expect((stringList as any).text).toHaveBeenCalledWith(
        bounds.x + (stringList as any).padding,
        expect.any(Number),
        mockItems[0],
        expect.any(Object)
      );
    });
  });

  describe('cloneStringList', () => {
    it('should return undefined for empty items array', () => {
      const result = (stringList as any).cloneStringList([]);
      expect(result).toBeUndefined();
    });

    it('should clone the component with the same properties', () => {
      const clonedItems = ['Item 4', 'Item 5'];
      const result = (stringList as any).cloneStringList(clonedItems);

      expect(result).toBeInstanceOf(StringListComponent);
      expect((result as any).items).toEqual(clonedItems);
      expect((result as any).fontOptions).toEqual(
        (stringList as any).fontOptions
      );
      expect((result as any).lineSpacing).toBe((stringList as any).lineSpacing);
      expect((result as any).listStyle).toBe((stringList as any).listStyle);
      expect((result as any).backgroundColor).toBe(
        (stringList as any).backgroundColor
      );
      expect((result as any).padding).toBe((stringList as any).padding);
      expect((result as any).margin).toBe((stringList as any).margin);
      expect((result as any).startNumber).toBe((stringList as any).startNumber);
    });

    it('should use provided startNumber when cloning', () => {
      const clonedItems = ['Item 4', 'Item 5'];
      const customStartNumber = 10;
      const result = (stringList as any).cloneStringList(
        clonedItems,
        customStartNumber
      );

      expect(result).toBeInstanceOf(StringListComponent);
      expect((result as any).startNumber).toBe(customStartNumber);
    });
  });
});
