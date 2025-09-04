import { Colors, Component, Rect } from '@schaeffler/pdf-generator';

import { PaddedRow } from './padded-row';

// Test constants
const DEFAULT_CONTENT_HEIGHT = 50;
const DEFAULT_PADDING_VERTICAL = 2;
const DEFAULT_PADDING_HORIZONTAL = 2;
const DEFAULT_MARGIN_VERTICAL = 0;
const DEFAULT_MARGIN_HORIZONTAL = 0;
const DEFAULT_BORDER_RADIUS = 0;

const CUSTOM_PADDING_VERTICAL = 10;
const CUSTOM_PADDING_HORIZONTAL = 15;
const CUSTOM_MARGIN_VERTICAL = 5;
const CUSTOM_MARGIN_HORIZONTAL = 8;
const CUSTOM_BORDER_RADIUS = 12;

const TEST_BOUNDS_X = 10;
const TEST_BOUNDS_Y = 20;
const TEST_BOUNDS_HEIGHT = 100;
const TEST_BOUNDS_WIDTH = 200;

// Additional constants for render tests
const RENDER_TEST_PADDING_V = 8;
const RENDER_TEST_PADDING_H = 12;
const RENDER_TEST_MARGIN_V = 4;
const RENDER_TEST_MARGIN_H = 6;
const RENDER_TEST_BORDER_RADIUS = 8;
const NEGATIVE_MARGIN_H = -5;
const NEGATIVE_MARGIN_V = -3;

class MockComponent extends Component {
  private mockHeight = DEFAULT_CONTENT_HEIGHT;

  constructor(height = DEFAULT_CONTENT_HEIGHT) {
    super();
    this.mockHeight = height;
  }

  public override evaluate(_bounds?: Rect): [boolean, number] {
    return [true, this.mockHeight];
  }

  public override render(): void {
    // Mock render implementation
  }

  public setMockHeight(height: number): void {
    this.mockHeight = height;
  }
}

describe('PaddedRow', () => {
  let paddedRow: PaddedRow;
  let mockContent: MockComponent;
  let mockPdfDoc: any;

  beforeEach(() => {
    const mockJsPdf = {
      setFillColor: jest.fn(),
      rect: jest.fn(),
      roundedRect: jest.fn(),
    };

    mockPdfDoc = {
      reset: jest.fn(),
      pdfDoc: mockJsPdf,
    };

    mockContent = new MockComponent();
    jest.spyOn(mockContent, 'setDocument');
    jest.spyOn(mockContent, 'setBounds');
    jest
      .spyOn(mockContent, 'evaluate')
      .mockReturnValue([true, DEFAULT_CONTENT_HEIGHT]);
    jest.spyOn(mockContent, 'render');

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create with content, background color and default options', () => {
      paddedRow = new PaddedRow(mockContent, Colors.Surface);

      expect(paddedRow).toBeDefined();
    });

    it('should create with content, background color and custom options', () => {
      const options = {
        paddingVertical: CUSTOM_PADDING_VERTICAL,
        paddingHorizontal: CUSTOM_PADDING_HORIZONTAL,
        marginVertical: CUSTOM_MARGIN_VERTICAL,
        marginHorizontal: CUSTOM_MARGIN_HORIZONTAL,
        borderRadius: CUSTOM_BORDER_RADIUS,
      };

      paddedRow = new PaddedRow(mockContent, Colors.Primary, options);

      expect(paddedRow).toBeDefined();
    });
  });

  describe('getter properties', () => {
    beforeEach(() => {
      paddedRow = new PaddedRow(mockContent, Colors.Surface);
    });

    it('should use default values when no options provided', () => {
      expect(paddedRow['paddingVertical']).toBe(DEFAULT_PADDING_VERTICAL);
      expect(paddedRow['paddingHorizontal']).toBe(DEFAULT_PADDING_HORIZONTAL);
      expect(paddedRow['marginVertical']).toBe(DEFAULT_MARGIN_VERTICAL);
      expect(paddedRow['marginHorizontal']).toBe(DEFAULT_MARGIN_HORIZONTAL);
      expect(paddedRow['borderRadius']).toBe(DEFAULT_BORDER_RADIUS);
    });

    it('should use custom values when options provided', () => {
      const options = {
        paddingVertical: CUSTOM_PADDING_VERTICAL,
        paddingHorizontal: CUSTOM_PADDING_HORIZONTAL,
        marginVertical: CUSTOM_MARGIN_VERTICAL,
        marginHorizontal: CUSTOM_MARGIN_HORIZONTAL,
        borderRadius: CUSTOM_BORDER_RADIUS,
      };

      paddedRow = new PaddedRow(mockContent, Colors.Primary, options);

      expect(paddedRow['paddingVertical']).toBe(CUSTOM_PADDING_VERTICAL);
      expect(paddedRow['paddingHorizontal']).toBe(CUSTOM_PADDING_HORIZONTAL);
      expect(paddedRow['marginVertical']).toBe(CUSTOM_MARGIN_VERTICAL);
      expect(paddedRow['marginHorizontal']).toBe(CUSTOM_MARGIN_HORIZONTAL);
      expect(paddedRow['borderRadius']).toBe(CUSTOM_BORDER_RADIUS);
    });
  });

  describe('evaluate', () => {
    beforeEach(() => {
      paddedRow = new PaddedRow(mockContent, Colors.Surface);
      paddedRow.setDocument(mockPdfDoc);
    });

    it('should evaluate content with correct bounds', () => {
      const bounds = new Rect(
        TEST_BOUNDS_X,
        TEST_BOUNDS_Y,
        TEST_BOUNDS_HEIGHT,
        TEST_BOUNDS_WIDTH
      );
      const [success] = paddedRow.evaluate(bounds);

      expect(success).toBe(true);
      expect(mockContent.setDocument).toHaveBeenCalledWith(mockPdfDoc);
      expect(mockContent.evaluate).toHaveBeenCalled();

      const evaluateSpy = mockContent.evaluate as jest.MockedFunction<
        typeof mockContent.evaluate
      >;
      const contentBounds = evaluateSpy.mock.calls[0][0];
      const expectedContentX =
        TEST_BOUNDS_X + DEFAULT_MARGIN_HORIZONTAL + DEFAULT_PADDING_HORIZONTAL;
      const expectedContentY =
        TEST_BOUNDS_Y + DEFAULT_MARGIN_VERTICAL + DEFAULT_PADDING_VERTICAL;
      const expectedContentWidth =
        TEST_BOUNDS_WIDTH -
        (DEFAULT_MARGIN_HORIZONTAL + DEFAULT_PADDING_HORIZONTAL) * 2;
      const expectedContentHeight =
        TEST_BOUNDS_HEIGHT -
        (DEFAULT_MARGIN_VERTICAL + DEFAULT_PADDING_VERTICAL) * 2;

      expect(contentBounds.x).toBe(expectedContentX);
      expect(contentBounds.y).toBe(expectedContentY);
      expect(contentBounds.width).toBe(expectedContentWidth);
      expect(contentBounds.height).toBe(expectedContentHeight);
    });

    it('should calculate total height including padding and margins', () => {
      const evaluateBoundsX = 0;
      const evaluateBoundsY = 0;
      const evaluateBoundsHeight = 100;
      const evaluateBoundsWidth = 200;
      const bounds = new Rect(
        evaluateBoundsX,
        evaluateBoundsY,
        evaluateBoundsHeight,
        evaluateBoundsWidth
      );
      const [success, height] = paddedRow.evaluate(bounds);

      expect(success).toBe(true);
      const expectedTotalHeight =
        DEFAULT_CONTENT_HEIGHT +
        (DEFAULT_PADDING_VERTICAL + DEFAULT_MARGIN_VERTICAL) * 2;
      expect(height).toBe(expectedTotalHeight);
    });

    it('should evaluate with custom padding and margins', () => {
      const options = {
        paddingVertical: CUSTOM_PADDING_VERTICAL,
        paddingHorizontal: CUSTOM_PADDING_HORIZONTAL,
        marginVertical: CUSTOM_MARGIN_VERTICAL,
        marginHorizontal: CUSTOM_MARGIN_HORIZONTAL,
      };

      paddedRow = new PaddedRow(mockContent, Colors.Primary, options);
      paddedRow.setDocument(mockPdfDoc);

      const bounds = new Rect(
        TEST_BOUNDS_X,
        TEST_BOUNDS_Y,
        TEST_BOUNDS_HEIGHT,
        TEST_BOUNDS_WIDTH
      );
      const [success, height] = paddedRow.evaluate(bounds);

      expect(success).toBe(true);

      // Verify content bounds with custom values
      const evaluateSpy = mockContent.evaluate as jest.MockedFunction<
        typeof mockContent.evaluate
      >;
      const contentBounds = evaluateSpy.mock.calls[0][0];
      const expectedContentX =
        TEST_BOUNDS_X + CUSTOM_MARGIN_HORIZONTAL + CUSTOM_PADDING_HORIZONTAL;
      const expectedContentY =
        TEST_BOUNDS_Y + CUSTOM_MARGIN_VERTICAL + CUSTOM_PADDING_VERTICAL;
      const expectedContentWidth =
        TEST_BOUNDS_WIDTH -
        (CUSTOM_MARGIN_HORIZONTAL + CUSTOM_PADDING_HORIZONTAL) * 2;
      const expectedContentHeight =
        TEST_BOUNDS_HEIGHT -
        (CUSTOM_MARGIN_VERTICAL + CUSTOM_PADDING_VERTICAL) * 2;

      expect(contentBounds.x).toBe(expectedContentX);
      expect(contentBounds.y).toBe(expectedContentY);
      expect(contentBounds.width).toBe(expectedContentWidth);
      expect(contentBounds.height).toBe(expectedContentHeight);

      const expectedTotalHeight =
        DEFAULT_CONTENT_HEIGHT +
        (CUSTOM_PADDING_VERTICAL + CUSTOM_MARGIN_VERTICAL) * 2;
      expect(height).toBe(expectedTotalHeight);
    });
  });

  describe('render', () => {
    beforeEach(() => {
      paddedRow = new PaddedRow(mockContent, Colors.Surface);
      paddedRow.setDocument(mockPdfDoc);
      jest
        .spyOn(paddedRow as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);
    });

    it('should render background without border radius', () => {
      const bounds = new Rect(
        TEST_BOUNDS_X,
        TEST_BOUNDS_Y,
        TEST_BOUNDS_HEIGHT,
        TEST_BOUNDS_WIDTH
      );
      paddedRow.setBounds(bounds);
      paddedRow.render();

      expect(mockPdfDoc.pdfDoc.setFillColor).toHaveBeenCalledWith(
        Colors.Surface
      );
      expect(mockPdfDoc.pdfDoc.rect).toHaveBeenCalledWith(
        TEST_BOUNDS_X + DEFAULT_MARGIN_HORIZONTAL,
        TEST_BOUNDS_Y + DEFAULT_MARGIN_VERTICAL,
        TEST_BOUNDS_WIDTH - DEFAULT_MARGIN_HORIZONTAL * 2,
        TEST_BOUNDS_HEIGHT - DEFAULT_MARGIN_VERTICAL * 2,
        'F'
      );
      expect(mockPdfDoc.pdfDoc.roundedRect).not.toHaveBeenCalled();
    });

    it('should render background with border radius', () => {
      const options = { borderRadius: RENDER_TEST_BORDER_RADIUS };
      paddedRow = new PaddedRow(mockContent, Colors.Primary, options);
      paddedRow.setDocument(mockPdfDoc);
      jest
        .spyOn(paddedRow as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);

      const borderRadiusBoundsX = 5;
      const borderRadiusBoundsY = 15;
      const borderRadiusBoundsHeight = 80;
      const borderRadiusBoundsWidth = 150;
      const bounds = new Rect(
        borderRadiusBoundsX,
        borderRadiusBoundsY,
        borderRadiusBoundsHeight,
        borderRadiusBoundsWidth
      );
      paddedRow.setBounds(bounds);
      paddedRow.render();

      expect(mockPdfDoc.pdfDoc.setFillColor).toHaveBeenCalledWith(
        Colors.Primary
      );
      expect(mockPdfDoc.pdfDoc.roundedRect).toHaveBeenCalledWith(
        borderRadiusBoundsX,
        borderRadiusBoundsY,
        borderRadiusBoundsWidth,
        borderRadiusBoundsHeight,
        RENDER_TEST_BORDER_RADIUS,
        RENDER_TEST_BORDER_RADIUS,
        'F'
      );
      expect(mockPdfDoc.pdfDoc.rect).not.toHaveBeenCalled();
    });

    it('should render content with correct bounds', () => {
      const bounds = new Rect(
        TEST_BOUNDS_X,
        TEST_BOUNDS_Y,
        TEST_BOUNDS_HEIGHT,
        TEST_BOUNDS_WIDTH
      );
      paddedRow.setBounds(bounds);
      paddedRow.render();

      expect(mockContent.setBounds).toHaveBeenCalled();
      expect(mockContent.render).toHaveBeenCalled();

      const setBoundsSpy = mockContent.setBounds as jest.MockedFunction<
        typeof mockContent.setBounds
      >;
      const contentBounds = setBoundsSpy.mock.calls[0][0];
      const expectedContentX =
        TEST_BOUNDS_X + DEFAULT_MARGIN_HORIZONTAL + DEFAULT_PADDING_HORIZONTAL;
      const expectedContentY =
        TEST_BOUNDS_Y + DEFAULT_MARGIN_VERTICAL + DEFAULT_PADDING_VERTICAL;
      const expectedContentWidth =
        TEST_BOUNDS_WIDTH -
        (DEFAULT_MARGIN_HORIZONTAL + DEFAULT_PADDING_HORIZONTAL) * 2;
      const expectedContentHeight =
        TEST_BOUNDS_HEIGHT -
        (DEFAULT_MARGIN_VERTICAL + DEFAULT_PADDING_VERTICAL) * 2;

      expect(contentBounds.x).toBe(expectedContentX);
      expect(contentBounds.y).toBe(expectedContentY);
      expect(contentBounds.width).toBe(expectedContentWidth);
      expect(contentBounds.height).toBe(expectedContentHeight);
    });

    it('should render with custom margins and padding', () => {
      const options = {
        paddingVertical: RENDER_TEST_PADDING_V,
        paddingHorizontal: RENDER_TEST_PADDING_H,
        marginVertical: RENDER_TEST_MARGIN_V,
        marginHorizontal: RENDER_TEST_MARGIN_H,
      };

      paddedRow = new PaddedRow(mockContent, Colors.ErrorContainer, options);
      paddedRow.setDocument(mockPdfDoc);
      jest
        .spyOn(paddedRow as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);

      const customBoundsX = 20;
      const customBoundsY = 30;
      const customBoundsHeight = 120;
      const customBoundsWidth = 180;
      const bounds = new Rect(
        customBoundsX,
        customBoundsY,
        customBoundsHeight,
        customBoundsWidth
      );
      paddedRow.setBounds(bounds);
      paddedRow.render();

      // Check background rendering with margins
      expect(mockPdfDoc.pdfDoc.setFillColor).toHaveBeenCalledWith(
        Colors.ErrorContainer
      );
      expect(mockPdfDoc.pdfDoc.rect).toHaveBeenCalledWith(
        customBoundsX + RENDER_TEST_MARGIN_H,
        customBoundsY + RENDER_TEST_MARGIN_V,
        customBoundsWidth - RENDER_TEST_MARGIN_H * 2,
        customBoundsHeight - RENDER_TEST_MARGIN_V * 2,
        'F'
      );

      // Check content bounds with margins and padding
      const setBoundsSpy = mockContent.setBounds as jest.MockedFunction<
        typeof mockContent.setBounds
      >;
      const contentBounds = setBoundsSpy.mock.calls[0][0];
      const expectedContentX =
        customBoundsX + RENDER_TEST_MARGIN_H + RENDER_TEST_PADDING_H;
      const expectedContentY =
        customBoundsY + RENDER_TEST_MARGIN_V + RENDER_TEST_PADDING_V;
      const expectedContentWidth =
        customBoundsWidth - (RENDER_TEST_MARGIN_H + RENDER_TEST_PADDING_H) * 2;
      const expectedContentHeight =
        customBoundsHeight - (RENDER_TEST_MARGIN_V + RENDER_TEST_PADDING_V) * 2;

      expect(contentBounds.x).toBe(expectedContentX);
      expect(contentBounds.y).toBe(expectedContentY);
      expect(contentBounds.width).toBe(expectedContentWidth);
      expect(contentBounds.height).toBe(expectedContentHeight);
    });

    it('should use negative margins correctly', () => {
      const options = {
        marginHorizontal: NEGATIVE_MARGIN_H,
        marginVertical: NEGATIVE_MARGIN_V,
      };

      paddedRow = new PaddedRow(mockContent, Colors.WarningContainer, options);
      paddedRow.setDocument(mockPdfDoc);
      jest
        .spyOn(paddedRow as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);

      const negativeBoundsX = 10;
      const negativeBoundsY = 20;
      const negativeBoundsHeight = 100;
      const negativeBoundsWidth = 150;
      const bounds = new Rect(
        negativeBoundsX,
        negativeBoundsY,
        negativeBoundsHeight,
        negativeBoundsWidth
      );
      paddedRow.setBounds(bounds);
      paddedRow.render();

      // Background should extend beyond bounds due to negative margins
      expect(mockPdfDoc.pdfDoc.rect).toHaveBeenCalledWith(
        negativeBoundsX + NEGATIVE_MARGIN_H,
        negativeBoundsY + NEGATIVE_MARGIN_V,
        negativeBoundsWidth - NEGATIVE_MARGIN_H * 2,
        negativeBoundsHeight - NEGATIVE_MARGIN_V * 2,
        'F'
      );

      // Content bounds should also be affected
      const setBoundsSpy = mockContent.setBounds as jest.MockedFunction<
        typeof mockContent.setBounds
      >;
      const contentBounds = setBoundsSpy.mock.calls[0][0];
      const expectedContentX =
        negativeBoundsX + NEGATIVE_MARGIN_H + DEFAULT_PADDING_HORIZONTAL;
      const expectedContentY =
        negativeBoundsY + NEGATIVE_MARGIN_V + DEFAULT_PADDING_VERTICAL;

      expect(contentBounds.x).toBe(expectedContentX);
      expect(contentBounds.y).toBe(expectedContentY);
    });

    it('should handle zero border radius correctly', () => {
      const options = { borderRadius: 0 };
      paddedRow = new PaddedRow(mockContent, Colors.Surface, options);
      paddedRow.setDocument(mockPdfDoc);
      jest
        .spyOn(paddedRow as any, 'assertDoc')
        .mockImplementation(() => mockPdfDoc.pdfDoc);

      const bounds = new Rect(0, 0, 100, 100);
      paddedRow.setBounds(bounds);
      paddedRow.render();

      expect(mockPdfDoc.pdfDoc.rect).toHaveBeenCalled();
      expect(mockPdfDoc.pdfDoc.roundedRect).not.toHaveBeenCalled();
    });
  });
});
