import { Component, Rect } from '../../core';
import { ColumnLayout, RowLayout, TwoColumnLayout } from './layout-components';

class MockComponent extends Component {
  public override evaluate = jest.fn().mockReturnValue([true, 50]);
  public override render = jest.fn();
  public override setDocument = jest.fn();
  public override setBounds = jest.fn();
}

describe('Layout Components', () => {
  let mockPdfDoc: any;

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

    jest.clearAllMocks();
  });

  describe('ColumnLayout', () => {
    let columnLayout: ColumnLayout;
    let mockComponents: MockComponent[];
    let bounds: Rect;

    beforeEach(() => {
      mockComponents = [new MockComponent(), new MockComponent()];
      columnLayout = new ColumnLayout(mockComponents);
      columnLayout.setDocument(mockPdfDoc);
      bounds = new Rect(10, 10, 300, 200);
    });

    it('should create an instance', () => {
      expect(columnLayout).toBeTruthy();
    });

    it('should evaluate all components and calculate total height', () => {
      // Mock component heights (first component + spacing + second component)
      mockComponents[0].evaluate.mockReturnValue([true, 40]);
      mockComponents[1].evaluate.mockReturnValue([true, 60]);

      const [fits, totalHeight] = columnLayout.evaluate(bounds);

      expect(fits).toBe(true);
      // First component (40) + spacing (4) + second component (60) = 104
      expect(totalHeight).toBe(104);

      // Verify components were properly evaluated
      expect(mockComponents[0].evaluate).toHaveBeenCalled();
      expect(mockComponents[1].evaluate).toHaveBeenCalled();
      expect(mockComponents[0].setDocument).toHaveBeenCalledWith(mockPdfDoc);
      expect(mockComponents[1].setDocument).toHaveBeenCalledWith(mockPdfDoc);
    });

    it('should respect custom spacing and top margin', () => {
      const customSpacing = 10;
      const topMargin = 15;
      columnLayout = new ColumnLayout(mockComponents, customSpacing, topMargin);
      columnLayout.setDocument(mockPdfDoc);

      mockComponents[0].evaluate.mockReturnValue([true, 40]);
      mockComponents[1].evaluate.mockReturnValue([true, 60]);

      const [fits, totalHeight] = columnLayout.evaluate(bounds);

      expect(fits).toBe(true);
      // Top margin (15) + first component (40) + spacing (10) + second component (60) = 125
      expect(totalHeight).toBe(125);
    });

    it('should render all components with appropriate bounds', () => {
      mockComponents[0].evaluate.mockReturnValue([true, 40]);
      mockComponents[1].evaluate.mockReturnValue([true, 60]);

      columnLayout.evaluate(bounds);
      columnLayout.setBounds(bounds);
      columnLayout.render();

      // Verify setBounds and render were called on all components
      expect(mockComponents[0].setBounds).toHaveBeenCalled();
      expect(mockComponents[1].setBounds).toHaveBeenCalled();
      expect(mockComponents[0].render).toHaveBeenCalled();
      expect(mockComponents[1].render).toHaveBeenCalled();

      // Verify Y position for second component is correct (firstY + firstHeight + spacing)
      const secondComponentBounds =
        mockComponents[1].setBounds.mock.calls[0][0];
      const firstComponentBounds = mockComponents[0].setBounds.mock.calls[0][0];

      expect(secondComponentBounds.y).toBe(firstComponentBounds.y + 40 + 4);
    });
  });

  describe('RowLayout', () => {
    let rowLayout: RowLayout;
    let mockComponents: MockComponent[];
    let bounds: Rect;

    beforeEach(() => {
      mockComponents = [new MockComponent(), new MockComponent()];
      rowLayout = new RowLayout(mockComponents);
      rowLayout.setDocument(mockPdfDoc);
      bounds = new Rect(10, 10, 200, 300);
    });

    it('should create an instance', () => {
      expect(rowLayout).toBeTruthy();
    });

    it('should evaluate all components and calculate max height', () => {
      mockComponents[0].evaluate.mockReturnValue([true, 40]);
      mockComponents[1].evaluate.mockReturnValue([true, 60]);

      const [fits, maxHeight] = rowLayout.evaluate(bounds);

      expect(fits).toBe(true);
      // Max of component heights (40, 60) = 60
      expect(maxHeight).toBe(60);

      // Verify components were properly evaluated
      expect(mockComponents[0].evaluate).toHaveBeenCalled();
      expect(mockComponents[1].evaluate).toHaveBeenCalled();
      expect(mockComponents[0].setDocument).toHaveBeenCalledWith(mockPdfDoc);
      expect(mockComponents[1].setDocument).toHaveBeenCalledWith(mockPdfDoc);
    });

    it('should respect custom spacing', () => {
      const customSpacing = 20;
      rowLayout = new RowLayout(mockComponents, customSpacing);
      rowLayout.setDocument(mockPdfDoc);

      const [success, height] = rowLayout.evaluate(bounds);

      // Verify the evaluation was successful
      expect(success).toBe(true);
      expect(height).toBeGreaterThan(0);

      // Verify equal width calculation accounts for spacing
      // Width should be (totalWidth - (n-1)*spacing) / n
      const equalWidth = (bounds.width - customSpacing) / 2;

      // Check if the evaluated bounds for components use the correct width
      const evaluatedBounds = mockComponents[0].evaluate.mock.calls[0][0];
      expect(evaluatedBounds.width).toBeCloseTo(equalWidth);
    });

    it('should render all components with appropriate bounds', () => {
      mockComponents[0].evaluate.mockReturnValue([true, 40]);
      mockComponents[1].evaluate.mockReturnValue([true, 60]);

      rowLayout.evaluate(bounds);
      rowLayout.setBounds(bounds);
      rowLayout.render();

      // Verify setBounds and render were called on all components
      expect(mockComponents[0].setBounds).toHaveBeenCalled();
      expect(mockComponents[1].setBounds).toHaveBeenCalled();
      expect(mockComponents[0].render).toHaveBeenCalled();
      expect(mockComponents[1].render).toHaveBeenCalled();

      // Verify X position for second component is correct (firstX + firstWidth + spacing)
      const secondComponentBounds =
        mockComponents[1].setBounds.mock.calls[0][0];
      const firstComponentBounds = mockComponents[0].setBounds.mock.calls[0][0];

      expect(secondComponentBounds.x).toBe(
        firstComponentBounds.x + firstComponentBounds.width + 4
      );
    });
  });

  describe('TwoColumnLayout', () => {
    let twoColumnLayout: TwoColumnLayout;
    let leftColumn: MockComponent;
    let rightColumn: MockComponent;
    let bounds: Rect;

    beforeEach(() => {
      leftColumn = new MockComponent();
      rightColumn = new MockComponent();
      twoColumnLayout = new TwoColumnLayout(leftColumn, rightColumn);
      twoColumnLayout.setDocument(mockPdfDoc);
      bounds = new Rect(10, 10, 200, 300);
    });

    it('should create an instance', () => {
      expect(twoColumnLayout).toBeTruthy();
    });

    it('should evaluate both columns and return max height', () => {
      leftColumn.evaluate.mockReturnValue([true, 70]);
      rightColumn.evaluate.mockReturnValue([true, 50]);

      const [fits, maxHeight] = twoColumnLayout.evaluate(bounds);

      expect(fits).toBe(true);
      // Max of column heights (70, 50) = 70
      expect(maxHeight).toBe(70);

      // Verify columns were properly evaluated
      expect(leftColumn.evaluate).toHaveBeenCalled();
      expect(rightColumn.evaluate).toHaveBeenCalled();
      expect(leftColumn.setDocument).toHaveBeenCalledWith(mockPdfDoc);
      expect(rightColumn.setDocument).toHaveBeenCalledWith(mockPdfDoc);
    });

    it('should respect custom column width ratio, gap, and divider settings', () => {
      const leftColumnWidth = 0.3; // 30% for left column
      const columnGap = 15;
      const drawDivider = true;
      const dividerColor = '#FF0000';

      twoColumnLayout = new TwoColumnLayout(
        leftColumn,
        rightColumn,
        leftColumnWidth,
        columnGap,
        drawDivider,
        dividerColor
      );
      twoColumnLayout.setDocument(mockPdfDoc);

      twoColumnLayout.evaluate(bounds);
      twoColumnLayout.setBounds(bounds);
      twoColumnLayout.render();

      // Verify left column bounds use the correct width ratio
      const leftBounds = leftColumn.setBounds.mock.calls[0][0];
      expect(leftBounds.width).toBeCloseTo(bounds.width * leftColumnWidth);

      // Verify right column bounds are positioned correctly
      const rightBounds = rightColumn.setBounds.mock.calls[0][0];
      expect(rightBounds.x).toBeCloseTo(
        bounds.x + bounds.width * leftColumnWidth + columnGap
      );

      // Verify divider was drawn with correct settings
      expect(mockPdfDoc.pdfDoc.setDrawColor).toHaveBeenCalledWith(dividerColor);
      expect(mockPdfDoc.pdfDoc.setLineWidth).toHaveBeenCalledWith(0.5);
      expect(mockPdfDoc.pdfDoc.line).toHaveBeenCalled();
    });

    it('should not draw divider when disabled', () => {
      twoColumnLayout = new TwoColumnLayout(
        leftColumn,
        rightColumn,
        0.5,
        8,
        false
      );
      twoColumnLayout.setDocument(mockPdfDoc);

      twoColumnLayout.evaluate(bounds);
      twoColumnLayout.setBounds(bounds);
      twoColumnLayout.render();

      // Verify divider was not drawn
      expect(mockPdfDoc.pdfDoc.line).not.toHaveBeenCalled();
    });
  });
});
