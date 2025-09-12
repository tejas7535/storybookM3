import { Component, Rect } from '@schaeffler/pdf-generator';

import { TemperatureCardContent } from './temperature-card-content';

class MockComponent extends Component {
  evaluate = jest.fn().mockReturnValue([true, 100]);
  render = jest.fn();
  setDocument = jest.fn();
  setBounds = jest.fn();
}

jest.mock('@schaeffler/pdf-generator', () => {
  const originalModule = jest.requireActual('@schaeffler/pdf-generator');

  return {
    ...originalModule,
    TextBlock: jest.fn().mockImplementation(() => new MockComponent()),
    ColumnLayout: jest.fn().mockImplementation(() => new MockComponent()),
  };
});

describe('TemperatureCardContent', () => {
  let cardContent: TemperatureCardContent;
  let mockPdfDoc: any;
  let mockBounds: Rect;

  const defaultTemperatures = [
    { value: '25.5', unit: '°C', label: 'Heating temperature' },
    { value: '30.0', unit: '°C', label: 'Target temperature' },
  ];

  beforeEach(() => {
    const mockJsPdf = {
      rect: jest.fn(),
      setFillColor: jest.fn(),
      getFont: jest
        .fn()
        .mockReturnValue({ fontName: 'Arial', fontStyle: 'normal' }),
      getFontSize: jest.fn().mockReturnValue(12),
      getLineHeightFactor: jest.fn().mockReturnValue(1.2),
      getTextDimensions: jest.fn().mockReturnValue({ w: 50, h: 10 }),
      getTextWidth: jest.fn().mockReturnValue(50),
    };

    mockPdfDoc = {
      reset: jest.fn(),
      pdfDoc: mockJsPdf,
    };
    mockBounds = new Rect(0, 0, 100, 200);

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    let TextBlock: jest.Mock;
    let ColumnLayout: jest.Mock;

    beforeEach(() => {
      TextBlock = jest.requireMock('@schaeffler/pdf-generator').TextBlock;
      ColumnLayout = jest.requireMock('@schaeffler/pdf-generator').ColumnLayout;

      jest.clearAllMocks();
    });

    it('should create with required parameters', () => {
      cardContent = new TemperatureCardContent(defaultTemperatures);

      expect(cardContent).toBeTruthy();
    });

    it('should create with options', () => {
      const options = {
        valueFontOptions: { fontSize: 14, fontStyle: 'bold' },
        labelFontOptions: { fontSize: 10 },
      };

      cardContent = new TemperatureCardContent(defaultTemperatures, options);

      expect(cardContent).toBeTruthy();
    });

    it('should create TextBlocks for each temperature value and label', () => {
      cardContent = new TemperatureCardContent(defaultTemperatures);

      expect(TextBlock).toHaveBeenCalledTimes(4); // 2 temperatures * 2 blocks each (value + label)
      expect(TextBlock).toHaveBeenCalledWith('25.5 °C', expect.any(Object));
      expect(TextBlock).toHaveBeenCalledWith(
        'Heating temperature',
        expect.any(Object)
      );
      expect(TextBlock).toHaveBeenCalledWith('30.0 °C', expect.any(Object));
      expect(TextBlock).toHaveBeenCalledWith(
        'Target temperature',
        expect.any(Object)
      );
    });

    it('should create ColumnLayouts for temperature items', () => {
      cardContent = new TemperatureCardContent(defaultTemperatures);

      expect(ColumnLayout).toHaveBeenCalledTimes(3); // 2 temperature columns + 1 main column
    });

    it('should handle empty temperatures array', () => {
      cardContent = new TemperatureCardContent([]);

      expect(cardContent).toBeTruthy();
      expect(ColumnLayout).toHaveBeenCalledTimes(1); // Only main column
    });

    it('should handle single temperature', () => {
      const singleTemp = [{ value: '25.5', unit: '°C', label: 'Temperature' }];
      cardContent = new TemperatureCardContent(singleTemp);

      expect(cardContent).toBeTruthy();
      expect(TextBlock).toHaveBeenCalledTimes(2); // 1 value + 1 label
      expect(ColumnLayout).toHaveBeenCalledTimes(2); // 1 temperature column + 1 main column
    });
  });

  describe('evaluate', () => {
    beforeEach(() => {
      cardContent = new TemperatureCardContent(defaultTemperatures);
      cardContent.setDocument(mockPdfDoc);
    });

    it('should evaluate and return correct height', () => {
      const [canFit, height] = cardContent.evaluate(mockBounds);

      expect(canFit).toBe(true);
      expect(height).toBeGreaterThan(0);
      expect(cardContent['calculatedHeight']).toBeGreaterThan(0);
    });

    it('should call setDocument on content', () => {
      const mockContent = cardContent['content'];
      cardContent.evaluate(mockBounds);

      expect(mockContent.setDocument).toHaveBeenCalledWith(mockPdfDoc);
    });

    it('should call evaluate on content with correct bounds', () => {
      const expectedPadding = 4; // SPACING.STANDARD
      const mockContent = cardContent['content'];

      cardContent.evaluate(mockBounds);

      expect(mockContent.evaluate).toHaveBeenCalledWith(
        expect.objectContaining({
          x: expectedPadding,
          y: expectedPadding,
          height: mockBounds.height - expectedPadding * 2,
          width: mockBounds.width - expectedPadding * 2,
        })
      );
    });
  });

  describe('render', () => {
    beforeEach(() => {
      cardContent = new TemperatureCardContent(defaultTemperatures);
      cardContent.setDocument(mockPdfDoc);
      cardContent.setBounds(mockBounds);
      cardContent.evaluate(mockBounds);
    });

    it('should render the content', () => {
      const mockContent = cardContent['content'];

      cardContent.render();

      expect(mockContent.setBounds).toHaveBeenCalled();
      expect(mockContent.render).toHaveBeenCalled();
    });

    it('should set correct bounds on content', () => {
      const expectedPadding = 4; // SPACING.STANDARD
      const mockContent = cardContent['content'];

      cardContent.render();

      expect(mockContent.setBounds).toHaveBeenCalledWith(
        expect.objectContaining({
          x: mockBounds.x + expectedPadding,
          y: mockBounds.y + expectedPadding,
          width: mockBounds.width - expectedPadding * 2,
        })
      );
    });
  });
});
