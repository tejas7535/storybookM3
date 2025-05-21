import { Colors, Component, Rect } from '@schaeffler/pdf-generator';

import { PdfCardComponent } from './pdf-card';

class MockComponent extends Component {
  evaluate = jest.fn().mockReturnValue([true, 50]);
  render = jest.fn();
  setDocument = jest.fn();
  setBounds = jest.fn();
}

describe('PdfCardComponent', () => {
  let component: PdfCardComponent;
  let mockContent: MockComponent[];
  let mockPdfDoc: any;

  beforeEach(() => {
    const mockJsPdf = {
      setFillColor: jest.fn(),
      setDrawColor: jest.fn(),
      setLineWidth: jest.fn(),
      roundedRect: jest.fn(),
      getFont: jest
        .fn()
        .mockReturnValue({ fontName: 'Arial', fontStyle: 'normal' }),
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
    };

    mockContent = [new MockComponent(), new MockComponent()];

    component = new PdfCardComponent({
      content: mockContent,
    });

    component.setDocument(mockPdfDoc);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should evaluate and calculate height with default parameters', () => {
    const bounds = new Rect(10, 10, 300, 500);
    const [fits, height] = component.evaluate(bounds);

    expect(fits).toBe(true);
    expect(height).toBe(132);

    mockContent.forEach((c) => {
      expect(c.setDocument).toHaveBeenCalledWith(mockPdfDoc);
    });
  });

  it('should render all content components', () => {
    const bounds = new Rect(10, 10, 300, 500);
    component.evaluate(bounds);
    component.setBounds(bounds);
    component.render();

    expect(mockPdfDoc.pdfDoc.setFillColor).toHaveBeenCalledWith(Colors.Surface);
    expect(mockPdfDoc.pdfDoc.roundedRect).toHaveBeenCalledWith(
      bounds.x,
      bounds.y,
      bounds.width,
      expect.any(Number),
      8,
      8,
      'F'
    );

    expect(mockPdfDoc.pdfDoc.setDrawColor).toHaveBeenCalledWith(Colors.Outline);
    expect(mockPdfDoc.pdfDoc.setLineWidth).toHaveBeenCalledWith(0.5);
    expect(mockPdfDoc.pdfDoc.roundedRect).toHaveBeenCalledWith(
      bounds.x,
      bounds.y,
      bounds.width,
      expect.any(Number),
      8,
      8,
      'S'
    );

    mockContent.forEach((c) => {
      expect(c.render).toHaveBeenCalled();
    });
  });

  it('should handle custom parameters', () => {
    const customPadding = 20;
    const customMargin = 10;
    const customBorderRadius = 12;
    const customBackgroundColor = '#CCCCCC';
    const customBorderColor = '#999999';
    const customBorderWidth = 1.5;

    component = new PdfCardComponent({
      content: mockContent,
      padding: customPadding,
      margin: customMargin,
      borderRadius: customBorderRadius,
      backgroundColor: customBackgroundColor,
      borderColor: customBorderColor,
      borderWidth: customBorderWidth,
    });

    component.setDocument(mockPdfDoc);
    const bounds = new Rect(10, 10, 300, 500);
    const [fits, height] = component.evaluate(bounds);

    expect(fits).toBe(true);
    expect(height).toBe(150);

    component.setBounds(bounds);
    component.render();

    // Should use custom values for drawing
    expect(mockPdfDoc.pdfDoc.setFillColor).toHaveBeenCalledWith(
      customBackgroundColor
    );
    expect(mockPdfDoc.pdfDoc.roundedRect).toHaveBeenCalledWith(
      bounds.x,
      bounds.y,
      bounds.width,
      expect.any(Number),
      customBorderRadius,
      customBorderRadius,
      'F'
    );

    expect(mockPdfDoc.pdfDoc.setDrawColor).toHaveBeenCalledWith(
      customBorderColor
    );
    expect(mockPdfDoc.pdfDoc.setLineWidth).toHaveBeenCalledWith(
      customBorderWidth
    );
  });

  it('should handle child component overflow correctly', () => {
    const mockOverflowComponent = new MockComponent();
    mockOverflowComponent.evaluate.mockReturnValue([
      false,
      50,
      'fittingPart' as any,
      'overflowPart' as any,
    ]);

    component = new PdfCardComponent({
      content: [mockOverflowComponent],
    });

    component.setDocument(mockPdfDoc);
    const bounds = new Rect(10, 10, 300, 500);
    const [fits, height, fittingPart, overflowPart] =
      component.evaluate(bounds);

    expect(fits).toBe(false);
    expect(height).toBe(82);
    expect(fittingPart).toBeDefined();
    expect(overflowPart).toBeDefined();
  });

  it('should respect keepTogether parameter', () => {
    const mockLargeComponents = Array.from({ length: 10 })
      // eslint-disable-next-line unicorn/no-null
      .fill(null)
      .map(() => {
        const comp = new MockComponent();

        comp.evaluate.mockReturnValue([true, 100]);

        return comp;
      });

    component = new PdfCardComponent({
      content: mockLargeComponents,
      keepTogether: true,
    });

    component.setDocument(mockPdfDoc);
    const bounds = new Rect(10, 10, 300, 200);
    const [fits, height, fittingPart, overflowPart] =
      component.evaluate(bounds);

    expect(fits).toBe(false);
    expect(height).toBe(0);
    expect(fittingPart).toBeUndefined();
    expect(overflowPart).toBeDefined();
  });

  it('should handle empty content', () => {
    component = new PdfCardComponent({
      content: [],
    });

    component.setDocument(mockPdfDoc);
    const bounds = new Rect(10, 10, 300, 500);
    const [fits, height] = component.evaluate(bounds);

    expect(fits).toBe(true);
    expect(height).toBe(32);
  });

  it('should not re-evaluate if bounds have not changed', () => {
    const bounds = new Rect(10, 10, 300, 500);

    component.evaluate(bounds);

    mockContent.forEach((c) => c.evaluate.mockClear());

    component.evaluate(bounds);

    mockContent.forEach((c) => {
      expect(c.evaluate).not.toHaveBeenCalled();
    });
  });

  it('should re-evaluate if bounds have changed', () => {
    const bounds1 = new Rect(10, 10, 300, 500);
    const bounds2 = new Rect(10, 10, 200, 500);

    component.evaluate(bounds1);

    // @ts-expect-error - accessing private property for testing
    component.evaluated = false;

    mockContent.forEach((c) => c.evaluate.mockClear());

    component.evaluate(bounds2);

    mockContent.forEach((c) => {
      expect(c.evaluate).toHaveBeenCalled();
    });
  });
});
