import { Rect } from '@schaeffler/pdf-generator';

import { LinkBlock, LinkBlockOptions } from './link-block';

describe('LinkBlock', () => {
  let linkBlock: LinkBlock;
  let mockPdfDoc: any;
  let mockJsPdf: any;
  const mockText = 'This is a sample link text that might span multiple lines';
  const mockUrl = 'https://example.com';
  const mockColor = '#0000FF';
  const mockFontOptions = { fontSize: 12, fontStyle: 'normal' };

  beforeEach(() => {
    mockJsPdf = {
      getTextColor: jest.fn().mockReturnValue('#000000'),
      setTextColor: jest.fn(),
      getDrawColor: jest.fn().mockReturnValue('#000000'),
      setDrawColor: jest.fn(),
      getFont: jest
        .fn()
        .mockReturnValue({ fontName: 'Arial', fontStyle: 'normal' }),
      getFontSize: jest.fn().mockReturnValue(12),
      setFontSize: jest.fn(),
      setFont: jest.fn(),
      getLineHeightFactor: jest.fn().mockReturnValue(1.2),
      getTextDimensions: jest.fn().mockReturnValue({ w: 50, h: 10 }),
      splitTextToSize: jest.fn().mockReturnValue(['Line 1', 'Line 2']),
      textWithLink: jest.fn(),
      line: jest.fn(),
      internal: {
        scaleFactor: 1.33,
      },
    };

    mockPdfDoc = {
      reset: jest.fn(),
      pdfDoc: mockJsPdf,
    };
  });

  describe('constructor with default options', () => {
    beforeEach(() => {
      linkBlock = new LinkBlock(mockText, mockUrl, mockFontOptions, mockColor);
      linkBlock.setDocument(mockPdfDoc);
    });

    it('should create an instance with default options', () => {
      expect(linkBlock).toBeTruthy();
    });

    it('should enable underline by default', () => {
      const bounds = new Rect(0, 0, 200, 100);
      linkBlock.setBounds(bounds);

      jest
        .spyOn(linkBlock as any, 'temporaryFontStyle')
        .mockReturnValue(jest.fn());

      linkBlock.render();

      expect(mockJsPdf.line).toHaveBeenCalled();
    });
  });

  describe('constructor with custom options', () => {
    beforeEach(() => {
      const options: LinkBlockOptions = {
        showUnderline: false,
        extraSpacing: 10,
      };
      linkBlock = new LinkBlock(
        mockText,
        mockUrl,
        mockFontOptions,
        mockColor,
        options
      );
      linkBlock.setDocument(mockPdfDoc);
    });

    it('should disable underline when showUnderline is false', () => {
      const bounds = new Rect(0, 0, 200, 100);
      linkBlock.setBounds(bounds);

      linkBlock.render();

      expect(mockJsPdf.line).not.toHaveBeenCalled();
    });
  });

  describe('evaluate', () => {
    beforeEach(() => {
      linkBlock = new LinkBlock(mockText, mockUrl, mockFontOptions, mockColor);
      linkBlock.setDocument(mockPdfDoc);
    });

    it('should calculate height using getMultilineTextHeight method', () => {
      const bounds = new Rect(0, 0, 200, 100);

      jest
        .spyOn(linkBlock as any, 'getMultilineTextHeight')
        .mockReturnValue(25);

      const [fits, height] = linkBlock.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(25);
      expect(linkBlock['getMultilineTextHeight']).toHaveBeenCalledWith(
        mockText,
        bounds.width,
        mockFontOptions
      );
    });

    it('should include extra spacing in height calculation', () => {
      const options: LinkBlockOptions = { extraSpacing: 10 };
      linkBlock = new LinkBlock(
        mockText,
        mockUrl,
        mockFontOptions,
        mockColor,
        options
      );
      linkBlock.setDocument(mockPdfDoc);

      const bounds = new Rect(0, 0, 200, 100);

      jest
        .spyOn(linkBlock as any, 'getMultilineTextHeight')
        .mockReturnValue(25);

      const [fits, height] = linkBlock.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(35); // 25 + 10 extra spacing
    });
  });

  describe('render with underline', () => {
    beforeEach(() => {
      linkBlock = new LinkBlock(mockText, mockUrl, mockFontOptions, mockColor);
      linkBlock.setDocument(mockPdfDoc);
    });

    it('should render text with link and draw underlines for each line', () => {
      const bounds = new Rect(10, 20, 200, 100);
      linkBlock.setBounds(bounds);

      jest
        .spyOn(linkBlock as any, 'temporaryFontStyle')
        .mockReturnValue(jest.fn());

      linkBlock.render();

      expect(mockJsPdf.textWithLink).toHaveBeenCalledWith(
        'Line 1',
        bounds.x,
        expect.any(Number),
        { url: mockUrl }
      );
      expect(mockJsPdf.textWithLink).toHaveBeenCalledWith(
        'Line 2',
        bounds.x,
        expect.any(Number),
        { url: mockUrl }
      );

      expect(mockJsPdf.setTextColor).toHaveBeenCalledWith(mockColor);
      expect(mockJsPdf.setDrawColor).toHaveBeenCalledWith(mockColor);

      expect(mockJsPdf.line).toHaveBeenCalledTimes(2); // Two lines of text
      expect(mockJsPdf.splitTextToSize).toHaveBeenCalledWith(
        mockText,
        bounds.width
      );
    });

    it('should restore original colors after rendering', () => {
      const bounds = new Rect(0, 0, 200, 100);
      linkBlock.setBounds(bounds);

      jest
        .spyOn(linkBlock as any, 'temporaryFontStyle')
        .mockReturnValue(jest.fn());

      linkBlock.render();

      // Verify colors are restored
      expect(mockJsPdf.setTextColor).toHaveBeenCalledWith('#000000');
      expect(mockJsPdf.setDrawColor).toHaveBeenCalledWith('#000000');
    });
  });
});
