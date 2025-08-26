import { Component, Rect } from '../../core';
import { TwoColumnPageLayout } from './two-columns-page-layout';

class MockComponent extends Component {
  public override evaluate = jest.fn().mockReturnValue([true, 50]);
  public override render = jest.fn();
  public override setDocument = jest.fn();
  public override setBounds = jest.fn();
}

describe('TwoColumnPageLayout', () => {
  let pageLayout: TwoColumnPageLayout;
  let mockPdfDoc: any;
  let mockLeftComponent: MockComponent;
  let mockRightComponent: MockComponent;
  let bounds: Rect;

  beforeEach(() => {
    const mockJsPdf = {
      setDrawColor: jest.fn(),
      setLineWidth: jest.fn(),
      line: jest.fn(),
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

    mockLeftComponent = new MockComponent();
    mockRightComponent = new MockComponent();

    pageLayout = new TwoColumnPageLayout({
      leftComponent: mockLeftComponent,
      rightComponent: mockRightComponent,
      columnGap: 10,
      leftColumnWidth: 0.5,
    });

    pageLayout.setDocument(mockPdfDoc);
    bounds = new Rect(10, 10, 300, 500);
  });

  it('should create an instance', () => {
    expect(pageLayout).toBeTruthy();
  });

  describe('evaluate', () => {
    it('should evaluate all components and return correct values when all components fit', () => {
      mockLeftComponent.evaluate.mockReturnValue([true, 30]);
      mockRightComponent.evaluate.mockReturnValue([true, 40]);

      const [fits, height] = pageLayout.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(40);

      expect(mockLeftComponent.evaluate).toHaveBeenCalled();
      expect(mockLeftComponent.setDocument).toHaveBeenCalledWith(mockPdfDoc);
      expect(mockRightComponent.evaluate).toHaveBeenCalled();
      expect(mockRightComponent.setDocument).toHaveBeenCalledWith(mockPdfDoc);
    });

    it('should handle components that do not fit and return appropriate values', () => {
      mockLeftComponent.evaluate.mockReturnValue([false, 0]);

      const [fits, height, _fittingLayout, continuation] =
        pageLayout.evaluate(bounds);

      expect(fits).toBe(false);
      expect(height).toBe(0);
      expect(continuation).toBe(pageLayout);
    });

    it('should handle when right component does not fit', () => {
      mockLeftComponent.evaluate.mockReturnValue([true, 30]);
      mockRightComponent.evaluate.mockReturnValue([false, 0]);

      const [fits, height, _fittingLayout, continuation] =
        pageLayout.evaluate(bounds);

      expect(fits).toBe(false);
      expect(height).toBe(0);
      expect(continuation).toBe(pageLayout);
    });

    it('should calculate correct column widths based on leftColumnWidth percentage', () => {
      const customLeftColumnWidth = 0.3;
      const customPageLayout = new TwoColumnPageLayout({
        leftComponent: mockLeftComponent,
        rightComponent: mockRightComponent,
        columnGap: 10,
        leftColumnWidth: customLeftColumnWidth,
      });

      customPageLayout.setDocument(mockPdfDoc);
      customPageLayout.evaluate(bounds);

      const totalWidth = bounds.width;
      const expectedLeftColumnWidth = (totalWidth - 10) * customLeftColumnWidth;
      const expectedRightColumnWidth =
        totalWidth - expectedLeftColumnWidth - 10;

      const leftComponentCall = mockLeftComponent.evaluate.mock.calls[0][0];
      const rightComponentCall = mockRightComponent.evaluate.mock.calls[0][0];

      expect(leftComponentCall.width).toBeCloseTo(expectedLeftColumnWidth);
      expect(rightComponentCall.width).toBeCloseTo(expectedRightColumnWidth);
      expect(rightComponentCall.x).toBeCloseTo(
        bounds.x + expectedLeftColumnWidth + 10
      );
    });
  });

  describe('render', () => {
    it('should render all components', () => {
      pageLayout.evaluate(bounds);
      pageLayout.setBounds(bounds);
      pageLayout.render();

      expect(mockLeftComponent.render).toHaveBeenCalled();
      expect(mockRightComponent.render).toHaveBeenCalled();
    });
  });

  describe('constructing with defaults', () => {
    it('should use default values when not provided', () => {
      const defaultPageLayout = new TwoColumnPageLayout({
        leftComponent: mockLeftComponent,
        rightComponent: mockRightComponent,
      });

      defaultPageLayout.setDocument(mockPdfDoc);
      defaultPageLayout.evaluate(bounds);

      const totalWidth = bounds.width;
      const expectedLeftColumnWidth = (totalWidth - 10) * 0.5;
      const expectedRightColumnWidth =
        totalWidth - expectedLeftColumnWidth - 10;

      const leftComponentCall = mockLeftComponent.evaluate.mock.calls[0][0];
      const rightComponentCall = mockRightComponent.evaluate.mock.calls[0][0];

      expect(leftComponentCall.width).toBeCloseTo(expectedLeftColumnWidth);
      expect(rightComponentCall.width).toBeCloseTo(expectedRightColumnWidth);
      expect(rightComponentCall.x).toBeCloseTo(
        bounds.x + expectedLeftColumnWidth + 10
      );

      const emptyPageLayout = new TwoColumnPageLayout({});
      expect(emptyPageLayout).toBeTruthy();
      expect(emptyPageLayout['leftComponent']).toBeUndefined();
      expect(emptyPageLayout['rightComponent']).toBeUndefined();
    });
  });
});
