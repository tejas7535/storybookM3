import { Colors } from '../../constants';
import { Rect } from '../../core';
import { TextBlock } from './text-block';

describe('TextBlock', () => {
  let textBlock: TextBlock;
  let mockPdfDoc: any;
  const mockText = 'Sample Text';
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

    textBlock = new TextBlock(mockText, mockFontOptions);
    textBlock.setDocument(mockPdfDoc);

    jest.spyOn(textBlock as any, 'getMultilineTextHeight').mockReturnValue(15);
    jest.spyOn(textBlock as any, 'text').mockImplementation(() => {});
    jest
      .spyOn(textBlock as any, 'assertDoc')
      .mockReturnValue(mockPdfDoc.pdfDoc);
    jest.spyOn(textBlock as any, 'setTextColor').mockReturnValue(jest.fn());

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with default extra spacing', () => {
      expect(textBlock).toBeTruthy();
      expect((textBlock as any).extraSpacing).toBe(0);
    });

    it('should create an instance with custom extra spacing', () => {
      const extraSpacing = 5;
      textBlock = new TextBlock(mockText, mockFontOptions, extraSpacing);
      expect((textBlock as any).extraSpacing).toBe(extraSpacing);
    });
  });

  describe('setExtraSpacing', () => {
    it('should set extra spacing and return the instance', () => {
      const extraSpacing = 8;
      const result = textBlock.setExtraSpacing(extraSpacing);

      expect((textBlock as any).extraSpacing).toBe(extraSpacing);
      expect(result).toBe(textBlock);
    });
  });

  describe('evaluate', () => {
    it('should calculate height based on text dimensions and extra spacing', () => {
      const bounds = new Rect(0, 0, 200, 100);
      const [fits, height] = textBlock.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(15); // 15 + 0 (default extraSpacing)
      expect(textBlock['getMultilineTextHeight']).toHaveBeenCalledWith(
        mockText,
        bounds.width,
        mockFontOptions
      );
    });

    it('should include extra spacing in height calculation', () => {
      const extraSpacing = 10;
      textBlock.setExtraSpacing(extraSpacing);

      const bounds = new Rect(0, 0, 200, 100);
      const [fits, height] = textBlock.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(15 + extraSpacing);
    });
  });

  describe('render', () => {
    it('should render the text with the correct color', () => {
      const bounds = new Rect(0, 0, 200, 100);
      textBlock.setBounds(bounds);
      textBlock.render();

      expect(textBlock['setTextColor']).toHaveBeenCalledWith(
        Colors.DarkGreyVariant
      );
      expect(textBlock['text']).toHaveBeenCalledWith(
        bounds.x,
        bounds.y,
        mockText,
        {
          fontOptions: mockFontOptions,
          textOptions: { maxWidth: bounds.width },
        }
      );
    });
  });
});
