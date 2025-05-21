import { Rect } from '@schaeffler/pdf-generator';

import { LinkBlock } from './link-block';

describe('LinkBlock', () => {
  let linkBlock: LinkBlock;
  let mockPdfDoc: any;
  const mockText = 'Link Text';
  const mockUrl = 'https://example.com';
  const mockColor = '#0000FF';
  const mockFontOptions = { fontSize: 12, fontStyle: 'normal' };

  beforeEach(() => {
    const mockJsPdf = {
      getTextColor: jest.fn().mockReturnValue('#000000'),
      setTextColor: jest.fn(),
      getFont: jest
        .fn()
        .mockReturnValue({ fontName: 'Arial', fontStyle: 'normal' }),
      getFontSize: jest.fn().mockReturnValue(12),
      getLineHeightFactor: jest.fn().mockReturnValue(1.2),
      getTextDimensions: jest.fn().mockReturnValue({ w: 50, h: 10 }),
    };

    mockPdfDoc = {
      reset: jest.fn(),
      pdfDoc: mockJsPdf,
    };

    linkBlock = new LinkBlock(mockText, mockUrl, mockFontOptions, mockColor);
    linkBlock.setDocument(mockPdfDoc);

    jest.spyOn(linkBlock as any, 'getMultilineTextHeight').mockReturnValue(20);
    jest.spyOn(linkBlock as any, 'text').mockImplementation(() => {});
    jest
      .spyOn(linkBlock as any, 'assertDoc')
      .mockReturnValue(mockPdfDoc.pdfDoc);

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with all parameters', () => {
      expect(linkBlock).toBeTruthy();
    });
  });

  describe('evaluate', () => {
    it('should calculate height based on text dimensions', () => {
      const bounds = new Rect(0, 0, 200, 100);
      const [fits, height] = linkBlock.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(20);
      expect(linkBlock['getMultilineTextHeight']).toHaveBeenCalledWith(
        mockText,
        bounds.width,
        mockFontOptions
      );
    });
  });

  describe('render', () => {
    it('should render the link with the correct color and restore original color', () => {
      const bounds = new Rect(0, 0, 200, 100);
      linkBlock.setBounds(bounds);
      linkBlock.render();

      const mockJsPdf = mockPdfDoc.pdfDoc;

      expect(mockJsPdf.getTextColor).toHaveBeenCalled();
      expect(mockJsPdf.setTextColor).toHaveBeenCalledWith(mockColor);
      expect(linkBlock['text']).toHaveBeenCalledWith(
        bounds.x,
        bounds.y,
        mockText,
        {
          fontOptions: mockFontOptions,
          textOptions: { maxWidth: bounds.width },
          link: mockUrl,
        }
      );
      expect(mockJsPdf.setTextColor).toHaveBeenCalledWith('#000000');
    });
  });
});
