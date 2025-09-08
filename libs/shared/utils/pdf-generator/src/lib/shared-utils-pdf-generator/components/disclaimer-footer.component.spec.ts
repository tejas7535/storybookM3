import { FontOptions } from '../core/format';
import { Rect } from '../core/rect';
import { DisclaimerFooter } from './disclaimer-footer.component';

describe('DisclaimerFooter', () => {
  let component: DisclaimerFooter;
  let mockPdfDoc: any;
  const disclaimerText =
    'This is a test disclaimer message for testing purposes.';

  beforeEach(() => {
    const mockJsPdf = {
      setFillColor: jest.fn(),
      setDrawColor: jest.fn(),
      setLineWidth: jest.fn(),
      roundedRect: jest.fn(),
      getFont: jest
        .fn()
        .mockReturnValue({ fontName: 'Noto', fontStyle: 'normal' }),
      getFontSize: jest.fn().mockReturnValue(12),
      getLineHeightFactor: jest.fn().mockReturnValue(1.2),
      getTextDimensions: jest.fn().mockReturnValue({ w: 50, h: 10 }),
      getTextWidth: jest.fn().mockReturnValue(50),
      internal: {
        pageSize: {
          getWidth: jest.fn().mockReturnValue(595),
          getHeight: jest.fn().mockReturnValue(842),
        },
      },
    };

    mockPdfDoc = {
      reset: jest.fn(),
      pdfDoc: mockJsPdf,
      pageNumber: 2,
      totalPages: 5,
    };

    component = new DisclaimerFooter({
      disclaimerText,
    });

    component.setDocument(mockPdfDoc);

    jest
      .spyOn(component as any, 'getTextDimensions')
      .mockReturnValue({ w: 50, h: 10 });
    jest.spyOn(component as any, 'getMultilineTextHeight').mockReturnValue(15);
    jest.spyOn(component as any, 'text').mockImplementation(() => {});
    jest
      .spyOn(component as any, 'assertDoc')
      .mockReturnValue(mockPdfDoc.pdfDoc);
    jest
      .spyOn(component as any, 'assertPageContext')
      .mockReturnValue(mockPdfDoc);
  });

  describe('constructor', () => {
    it('should create an instance with default properties', () => {
      expect(component).toBeTruthy();
      expect((component as any).disclaimerText).toBe(disclaimerText);
      expect((component as any).textGap).toBe(0);
    });

    it('should create an instance with custom properties', () => {
      const customFormatFn = (current: number, total: number) =>
        `Page ${current} of ${total}`;
      const customDisclaimerFont: FontOptions = {
        fontFamily: 'Arial',
        fontSize: 8,
        fontStyle: 'italic',
      };
      const customPageCounterFont: FontOptions = {
        fontFamily: 'Helvetica',
        fontSize: 14,
        fontStyle: 'bold',
      };
      const customTextGap = 10;

      const customComponent = new DisclaimerFooter({
        disclaimerText: 'Custom disclaimer',
        formatFn: customFormatFn,
        disclaimerFontFormat: customDisclaimerFont,
        pageCounterFontFormat: customPageCounterFont,
        textGap: customTextGap,
      });

      expect((customComponent as any).disclaimerText).toBe('Custom disclaimer');
      expect((customComponent as any).pageFormatFn).toBe(customFormatFn);
      expect((customComponent as any).disclaimerTextFormat.fontFamily).toBe(
        'Arial'
      );
      expect((customComponent as any).disclaimerTextFormat.fontSize).toBe(8);
      expect((customComponent as any).disclaimerTextFormat.fontStyle).toBe(
        'italic'
      );
      expect((customComponent as any).pageCounterFormat.fontFamily).toBe(
        'Helvetica'
      );
      expect((customComponent as any).pageCounterFormat.fontSize).toBe(14);
      expect((customComponent as any).pageCounterFormat.fontStyle).toBe('bold');
      expect((customComponent as any).textGap).toBe(customTextGap);
    });

    it('should use default format function when none provided', () => {
      const result = (component as any).pageFormatFn(3, 10);
      expect(result).toBe('3 / 10');
    });
  });

  describe('evaluate', () => {
    it('should return true when disclaimer fits in the bounds', () => {
      const bounds = new Rect(0, 0, 300, 200);

      const [fits, height] = component.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(15);
      expect((component as any).disclaimerSpace).toBe(150);
    });

    it('should return false when disclaimer does not fit in the bounds', () => {
      const testComponent = new DisclaimerFooter({ disclaimerText });
      testComponent.setDocument(mockPdfDoc);

      jest
        .spyOn(testComponent as any, 'getTextDimensions')
        .mockReturnValue({ w: 50, h: 10 });
      jest
        .spyOn(testComponent as any, 'getMultilineTextHeight')
        .mockReturnValue(20);
      jest
        .spyOn(testComponent as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      const bounds = new Rect(0, 0, 300, 10);
      const [fits, height] = testComponent.evaluate(bounds);

      expect(fits).toBe(height <= bounds.height);
      expect(height).toBe(20);
    });

    it('should calculate disclaimer space correctly with text gap', () => {
      const componentWithGap = new DisclaimerFooter({
        disclaimerText,
        textGap: 20,
      });
      componentWithGap.setDocument(mockPdfDoc);

      jest
        .spyOn(componentWithGap as any, 'getTextDimensions')
        .mockReturnValue({ w: 60, h: 12 });
      jest
        .spyOn(componentWithGap as any, 'getMultilineTextHeight')
        .mockReturnValue(20);

      const bounds = new Rect(0, 0, 400, 50);
      componentWithGap.evaluate(bounds);

      expect((componentWithGap as any).disclaimerSpace).toBe(-30);
    });
  });
  describe('render', () => {
    beforeEach(() => {
      const bounds = new Rect(10, 20, 300, 100);
      component.setBounds(bounds);
      component.evaluate(bounds);
    });

    it('should render disclaimer text and page counter', () => {
      component.render();

      expect((component as any).text).toHaveBeenCalledWith(
        10,
        20,
        disclaimerText,
        {
          textOptions: {
            maxWidth: 50,
          },
          fontOptions: {
            fontFamily: 'Noto',
            fontSize: 6,
          },
        }
      );

      expect((component as any).text).toHaveBeenCalledWith(64, 310, '2 / 5', {
        fontOptions: {
          fontFamily: 'Noto',
          fontSize: 10,
          fontStyle: 'bold',
        },
      });
    });

    it('should use custom format function for page counter', () => {
      const customFormatFn = jest.fn().mockReturnValue('Custom 2 of 5');
      const customComponent = new DisclaimerFooter({
        disclaimerText,
        formatFn: customFormatFn,
      });
      customComponent.setDocument(mockPdfDoc);

      jest
        .spyOn(customComponent as any, 'getTextDimensions')
        .mockReturnValue({ w: 50, h: 10 });
      jest
        .spyOn(customComponent as any, 'getMultilineTextHeight')
        .mockReturnValue(15);
      jest.spyOn(customComponent as any, 'text').mockImplementation(() => {});
      jest
        .spyOn(customComponent as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);
      jest
        .spyOn(customComponent as any, 'assertPageContext')
        .mockReturnValue(mockPdfDoc);

      const bounds = new Rect(10, 20, 300, 100);
      customComponent.setBounds(bounds);
      customComponent.evaluate(bounds);
      customComponent.render();

      expect(customFormatFn).toHaveBeenCalledWith(2, 5);
      expect((customComponent as any).text).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'Custom 2 of 5',
        expect.any(Object)
      );
    });

    it('should handle different page contexts', () => {
      const differentPageContext = {
        pageNumber: 1,
        totalPages: 1,
      };

      jest
        .spyOn(component as any, 'assertPageContext')
        .mockReturnValue(differentPageContext);

      component.render();

      expect((component as any).text).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        '1 / 1',
        expect.any(Object)
      );
    });
  });

  describe('font merging and defaults', () => {
    it('should merge custom font options with defaults', () => {
      const partialDisclaimerFont: Partial<FontOptions> = { fontSize: 8 };
      const partialPageCounterFont: Partial<FontOptions> = {
        fontStyle: 'italic',
      };

      const customComponent = new DisclaimerFooter({
        disclaimerText,
        disclaimerFontFormat: partialDisclaimerFont,
        pageCounterFontFormat: partialPageCounterFont,
      });

      expect((customComponent as any).disclaimerTextFormat).toEqual({
        fontFamily: 'Noto',
        fontSize: 8,
      });

      expect((customComponent as any).pageCounterFormat).toEqual({
        fontFamily: 'Noto',
        fontSize: 10,
        fontStyle: 'italic',
      });
    });
  });
});
