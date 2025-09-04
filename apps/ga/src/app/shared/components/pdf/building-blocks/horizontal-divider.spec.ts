import { Colors, Rect } from '@schaeffler/pdf-generator';

import { HorizontalDivider } from './horizontal-divider';

describe('HorizontalDivider', () => {
  let divider: HorizontalDivider;
  let mockPdfDoc: any;

  // Test constants
  const DEFAULT_THICKNESS = 0.5;
  const DEFAULT_SPACING = 0.1;
  const CUSTOM_THICKNESS = 2;
  const THICK_LINE_THICKNESS = 5;
  const TEST_BOUNDS_X = 10;
  const TEST_BOUNDS_Y = 20;
  const TEST_BOUNDS_HEIGHT = 80;
  const TEST_BOUNDS_WIDTH = 100;
  const CUSTOM_COLOR = '#FF0000';

  beforeEach(() => {
    const mockJsPdf = {
      setDrawColor: jest.fn(),
      setLineWidth: jest.fn(),
      line: jest.fn(),
    };

    mockPdfDoc = {
      reset: jest.fn(),
      pdfDoc: mockJsPdf,
    };

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create with default values', () => {
      divider = new HorizontalDivider();

      expect(divider).toBeDefined();
    });

    it('should create with custom color and thickness', () => {
      divider = new HorizontalDivider(CUSTOM_COLOR, CUSTOM_THICKNESS);

      expect(divider).toBeDefined();
    });
  });

  describe('evaluate', () => {
    it('should return correct height with default thickness', () => {
      divider = new HorizontalDivider();

      const [canFit, height] = divider.evaluate();

      expect(canFit).toBe(true);
      expect(height).toBe(DEFAULT_THICKNESS + DEFAULT_SPACING);
    });

    it('should return correct height with custom thickness', () => {
      divider = new HorizontalDivider(Colors.Primary, CUSTOM_THICKNESS);

      const [canFit, height] = divider.evaluate();

      expect(canFit).toBe(true);
      expect(height).toBe(CUSTOM_THICKNESS + DEFAULT_SPACING);
    });
  });

  describe('render', () => {
    beforeEach(() => {
      divider = new HorizontalDivider();
      divider.setDocument(mockPdfDoc);
      jest
        .spyOn(divider as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);
    });

    it('should render divider with default settings', () => {
      const bounds = new Rect(
        TEST_BOUNDS_X,
        TEST_BOUNDS_Y,
        TEST_BOUNDS_HEIGHT,
        TEST_BOUNDS_WIDTH
      );
      divider.setBounds(bounds);
      divider.render();

      expect(mockPdfDoc.pdfDoc.setDrawColor).toHaveBeenCalledWith(
        Colors.Outline
      );
      expect(mockPdfDoc.pdfDoc.setLineWidth).toHaveBeenCalledWith(
        DEFAULT_THICKNESS
      );
      expect(mockPdfDoc.pdfDoc.line).toHaveBeenCalledWith(
        bounds.x,
        bounds.y + DEFAULT_SPACING,
        bounds.x + bounds.width,
        bounds.y + DEFAULT_SPACING
      );
    });

    it('should render divider with custom color and thickness', () => {
      divider = new HorizontalDivider(CUSTOM_COLOR, CUSTOM_THICKNESS);
      divider.setDocument(mockPdfDoc);
      jest
        .spyOn(divider as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);

      const customBoundsX = 5;
      const customBoundsY = 15;
      const customBoundsHeight = 200;
      const customBoundsWidth = 100;
      const bounds = new Rect(
        customBoundsX,
        customBoundsY,
        customBoundsHeight,
        customBoundsWidth
      );
      divider.setBounds(bounds);
      divider.render();

      expect(mockPdfDoc.pdfDoc.setDrawColor).toHaveBeenCalledWith(CUSTOM_COLOR);
      expect(mockPdfDoc.pdfDoc.setLineWidth).toHaveBeenCalledWith(
        CUSTOM_THICKNESS
      );
      expect(mockPdfDoc.pdfDoc.line).toHaveBeenCalledWith(
        bounds.x,
        bounds.y + DEFAULT_SPACING,
        bounds.x + bounds.width,
        bounds.y + DEFAULT_SPACING
      );
    });

    it('should render line spanning the full width of bounds', () => {
      const lineBoundsX = 25;
      const lineBoundsY = 35;
      const lineBoundsHeight = 75;
      const lineBoundsWidth = 150;
      const bounds = new Rect(
        lineBoundsX,
        lineBoundsY,
        lineBoundsHeight,
        lineBoundsWidth
      );
      divider.setBounds(bounds);
      divider.render();

      const expectedStartX = lineBoundsX;
      const expectedY = lineBoundsY + DEFAULT_SPACING;
      const expectedEndX = lineBoundsX + lineBoundsWidth;

      expect(mockPdfDoc.pdfDoc.line).toHaveBeenCalledWith(
        expectedStartX,
        expectedY,
        expectedEndX,
        expectedY
      );
    });

    it('should render with primary color when specified', () => {
      divider = new HorizontalDivider(Colors.Primary);
      divider.setDocument(mockPdfDoc);
      jest
        .spyOn(divider as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);

      const primaryColorBoundsX = 0;
      const primaryColorBoundsY = 0;
      const primaryColorBoundsHeight = 100;
      const primaryColorBoundsWidth = 50;
      const bounds = new Rect(
        primaryColorBoundsX,
        primaryColorBoundsY,
        primaryColorBoundsHeight,
        primaryColorBoundsWidth
      );
      divider.setBounds(bounds);
      divider.render();

      expect(mockPdfDoc.pdfDoc.setDrawColor).toHaveBeenCalledWith(
        Colors.Primary
      );
    });

    it('should render with thick line when specified', () => {
      divider = new HorizontalDivider(Colors.Outline, THICK_LINE_THICKNESS);
      divider.setDocument(mockPdfDoc);
      jest
        .spyOn(divider as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);

      const thickLineBoundsX = 0;
      const thickLineBoundsY = 0;
      const thickLineBoundsHeight = 100;
      const thickLineBoundsWidth = 50;
      const bounds = new Rect(
        thickLineBoundsX,
        thickLineBoundsY,
        thickLineBoundsHeight,
        thickLineBoundsWidth
      );
      divider.setBounds(bounds);
      divider.render();

      expect(mockPdfDoc.pdfDoc.setLineWidth).toHaveBeenCalledWith(
        THICK_LINE_THICKNESS
      );
    });
  });
});
