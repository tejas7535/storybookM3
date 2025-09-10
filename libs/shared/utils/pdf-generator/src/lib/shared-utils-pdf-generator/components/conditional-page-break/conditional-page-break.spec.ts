import { PDFDocument, Rect } from '../../core';
import { ConditionalPageBreak } from './conditional-page-break';

describe('ConditionalPageBreak', () => {
  let component: ConditionalPageBreak;
  let mockPdfDoc: Partial<PDFDocument>;
  let mockJsPdf: any;

  beforeEach(() => {
    mockJsPdf = {
      internal: {
        pageSize: {
          getHeight: jest.fn().mockReturnValue(800),
        },
      },
    };

    mockPdfDoc = {
      pdfDoc: mockJsPdf,
      insets: jest.fn().mockReturnValue(50),
      reset: jest.fn(),
    };

    component = new ConditionalPageBreak();

    component['_pdfDoc'] = mockPdfDoc as PDFDocument;
    component['_doc'] = mockJsPdf;

    component['assertDoc'] = jest.fn().mockReturnValue(mockJsPdf);
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('should have a minRemainingHeight property with a default value', () => {
    expect(component['minRemainingHeight']).toBe(100);
  });

  it('should accept a custom minRemainingHeight value', () => {
    const customHeight = 200;
    const customComponent = new ConditionalPageBreak(customHeight);
    expect(customComponent['minRemainingHeight']).toBe(customHeight);
  });

  describe('evaluate method', () => {
    it('should return [true, 0] when remaining height is sufficient', () => {
      const bounds = new Rect(0, 600, 100, 500);

      const result = component.evaluate(bounds);

      expect(result).toEqual([true, 0]);
      expect(mockPdfDoc.insets).toHaveBeenCalledWith('bottom');
    });

    it('should return [false, 0, undefined, this] when remaining height is insufficient', () => {
      const bounds = new Rect(0, 700, 100, 500);

      const result = component.evaluate(bounds);

      expect(result).toEqual([false, 0, undefined, component]);
    });

    it('should return [true, 0] when _pdfDoc is undefined', () => {
      component['_pdfDoc'] = undefined;
      const bounds = new Rect(0, 0, 100, 100);

      const result = component.evaluate(bounds);

      expect(result).toEqual([true, 0]);
    });
  });

  describe('render method', () => {
    it('should call super.render without errors', () => {
      const bounds = new Rect(0, 0, 100, 100);
      component.setBounds(bounds);

      expect(() => component.render()).not.toThrow();
    });
  });
});
