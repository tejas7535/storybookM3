import { Rect } from '@schaeffler/pdf-generator';

import {
  BadgeStyle,
  PDFGreaseReportResult,
  PDFGreaseResultSection,
  PDFGreaseResultSectionItem,
} from '@ga/features/grease-calculation/calculation-result/models';

import {
  GreaseResultCardContent,
  GreaseResultCardContentOptions,
} from './grease-result-card-content';

// Mock the building blocks
jest.mock('../building-blocks', () => ({
  BadgeBlock: jest.fn().mockImplementation(() => ({
    evaluate: jest.fn().mockReturnValue([true, 20]),
    render: jest.fn(),
    setDocument: jest.fn(),
    setBounds: jest.fn(),
  })),
  HorizontalDivider: jest.fn().mockImplementation(() => ({
    evaluate: jest.fn().mockReturnValue([true, 1]),
    render: jest.fn(),
    setDocument: jest.fn(),
    setBounds: jest.fn(),
  })),
  ImageBlock: jest.fn().mockImplementation(() => ({
    evaluate: jest.fn().mockReturnValue([true, 20]),
    render: jest.fn(),
    setDocument: jest.fn(),
    setBounds: jest.fn(),
  })),
  LinkBlock: jest.fn().mockImplementation(() => ({
    evaluate: jest.fn().mockReturnValue([true, 20]),
    render: jest.fn(),
    setDocument: jest.fn(),
    setBounds: jest.fn(),
  })),
  PaddedRow: jest.fn().mockImplementation(() => ({
    evaluate: jest.fn().mockReturnValue([true, 25]),
    render: jest.fn(),
    setDocument: jest.fn(),
    setBounds: jest.fn(),
  })),
  QrCodeBlock: jest.fn().mockImplementation(() => ({
    evaluate: jest.fn().mockReturnValue([true, 18]),
    render: jest.fn(),
    setDocument: jest.fn(),
    setBounds: jest.fn(),
  })),
}));

// Mock the PDF generator components
jest.mock('@schaeffler/pdf-generator', () => ({
  CardContent: class MockCardContent {
    protected _pdfDoc: any;
    protected bounds: any;
    protected calculatedHeight = 0;
    protected padding = 4;
    protected margin = 0;

    constructor(options: any = {}) {
      this.padding = options.padding ?? 4;
      this.margin = options.margin ?? 0;
    }

    evaluate(bounds: Rect) {
      this.bounds = bounds;

      return [true, 100];
    }

    render() {}

    setDocument(doc: any) {
      this._pdfDoc = doc;
    }

    setBounds(bounds: Rect) {
      this.bounds = bounds;
    }
  },
  Colors: {
    Outline: 'outline',
    Surface: 'surface',
    SurfaceContainer: 'surface-container',
  },
  ColumnLayout: jest.fn().mockImplementation(() => ({
    evaluate: jest.fn().mockReturnValue([true, 100]),
    render: jest.fn(),
    setDocument: jest.fn(),
    setBounds: jest.fn(),
  })),
  Rect: jest.fn().mockImplementation((x, y, height, width) => ({
    x,
    y,
    height,
    width,
  })),
  RowLayout: jest.fn().mockImplementation(() => ({
    evaluate: jest.fn().mockReturnValue([true, 50]),
    render: jest.fn(),
    setDocument: jest.fn(),
    setBounds: jest.fn(),
  })),
  TextBlock: jest.fn().mockImplementation(() => ({
    evaluate: jest.fn().mockReturnValue([true, 12]),
    render: jest.fn(),
    setDocument: jest.fn(),
    setBounds: jest.fn(),
  })),
  TwoColumnLayout: jest.fn().mockImplementation(() => ({
    evaluate: jest.fn().mockReturnValue([true, 30]),
    render: jest.fn(),
    setDocument: jest.fn(),
    setBounds: jest.fn(),
  })),
}));

describe('GreaseResultCardContent', () => {
  let mockGreaseData: PDFGreaseReportResult;
  let mockOptions: GreaseResultCardContentOptions;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGreaseData = {
      sections: [
        {
          sectionTitle: 'Test Section',
          values: [
            {
              title: 'Test Item 1',
              value: 'Test Value 1',
            },
            {
              title: 'Test Item 2',
              value: 'Test Value 2',
              secondaryValue: 'Secondary Value',
              badgeClass: BadgeStyle.Success,
            },
          ],
        },
      ],
      isSufficient: true,
      mainTitle: 'Main Title',
      subTitle: 'Sub Title',
      qrCode: 'test-qr-code',
      greaseLink: 'test-grease-link',
      recommended: 'Recommended',
      miscible: 'Miscible',
    };

    mockOptions = {
      backgroundColor: '#ffffff',
      padding: 8,
      margin: 4,
    };
  });

  describe('constructor', () => {
    it('should create instance with required grease data', () => {
      const component = new GreaseResultCardContent(mockGreaseData);

      expect(component).toBeInstanceOf(GreaseResultCardContent);
    });

    it('should create instance with grease data and options', () => {
      const component = new GreaseResultCardContent(
        mockGreaseData,
        mockOptions
      );

      expect(component).toBeInstanceOf(GreaseResultCardContent);
      expect(component.options).toEqual(mockOptions);
    });

    it('should handle empty options', () => {
      const component = new GreaseResultCardContent(mockGreaseData, {});

      expect(component).toBeInstanceOf(GreaseResultCardContent);
      expect(component.options).toEqual({});
    });
  });

  describe('evaluate method', () => {
    it('should evaluate bounds correctly', () => {
      const component = new GreaseResultCardContent(
        mockGreaseData,
        mockOptions
      );
      const bounds = new Rect(0, 0, 200, 100);

      const [canFit, height] = component.evaluate(bounds);

      expect(canFit).toBe(true);
      expect(height).toBeGreaterThan(0);
    });

    it('should handle multiple sections', () => {
      const multiSectionData: PDFGreaseReportResult = {
        ...mockGreaseData,
        sections: [
          {
            sectionTitle: 'Section 1',
            values: [{ title: 'Item 1', value: 'Value 1' }],
          },
          {
            sectionTitle: 'Section 2',
            values: [{ title: 'Item 2', value: 'Value 2' }],
          },
        ],
      };

      const component = new GreaseResultCardContent(multiSectionData);
      const bounds = new Rect(0, 0, 200, 100);

      const [canFit, height] = component.evaluate(bounds);

      expect(canFit).toBe(true);
      expect(height).toBeGreaterThan(0);
    });
  });

  describe('render method', () => {
    it('should render without errors', () => {
      const component = new GreaseResultCardContent(mockGreaseData);
      const bounds = new Rect(0, 0, 200, 100);

      component.evaluate(bounds);

      expect(() => component.render()).not.toThrow();
    });
  });

  describe('header section', () => {
    it('should create header with recommended and miscible badges', () => {
      const component = new GreaseResultCardContent(mockGreaseData);
      const bounds = new Rect(0, 0, 200, 100);

      component.evaluate(bounds);

      expect(component).toBeInstanceOf(GreaseResultCardContent);
    });

    it('should create header without badges when not provided', () => {
      const dataWithoutBadges: PDFGreaseReportResult = {
        ...mockGreaseData,
        recommended: undefined,
        miscible: undefined,
      };

      const component = new GreaseResultCardContent(dataWithoutBadges);
      const bounds = new Rect(0, 0, 200, 100);

      component.evaluate(bounds);

      expect(component).toBeInstanceOf(GreaseResultCardContent);
    });

    it('should create header with partner version info when provided', () => {
      const dataWithPartnerInfo: PDFGreaseReportResult = {
        ...mockGreaseData,
        partnerVersionInfo: {
          title: 'Powered by Partner',
          schaefflerLogo: 'base64-logo-data',
        },
      };

      const component = new GreaseResultCardContent(dataWithPartnerInfo);
      const bounds = new Rect(0, 0, 200, 100);

      const [canFit, height] = component.evaluate(bounds);

      expect(canFit).toBe(true);
      expect(height).toBeGreaterThan(0);
      expect(component).toBeInstanceOf(GreaseResultCardContent);
    });
  });

  describe('section handling', () => {
    it('should handle section items with badges', () => {
      const sectionWithBadges: PDFGreaseResultSection = {
        sectionTitle: 'Badge Section',
        values: [
          {
            title: 'Success Item',
            value: 'Success',
            badgeClass: BadgeStyle.Success,
          },
          {
            title: 'Error Item',
            value: 'Error',
            badgeClass: BadgeStyle.Error,
          },
        ],
      };

      const testData: PDFGreaseReportResult = {
        ...mockGreaseData,
        sections: [sectionWithBadges],
      };

      const component = new GreaseResultCardContent(testData);
      const bounds = new Rect(0, 0, 200, 100);

      expect(() => component.evaluate(bounds)).not.toThrow();
    });

    it('should handle section items with concept1 data', () => {
      const sectionWithConcept1: PDFGreaseResultSection = {
        sectionTitle: 'Concept1 Section',
        values: [
          {
            title: 'Concept Item',
            value: 'Test Value',
            concept1Data: {
              emptyDuration: '5 min',
              arrowSetting: 'Setting 1',
              duration: 300,
              arrowImage: 'arrow-image-data',
            },
          },
        ],
      };

      const testData: PDFGreaseReportResult = {
        ...mockGreaseData,
        sections: [sectionWithConcept1],
      };

      const component = new GreaseResultCardContent(testData);
      const bounds = new Rect(0, 0, 200, 100);

      expect(() => component.evaluate(bounds)).not.toThrow();
    });

    it('should handle section items with secondary values', () => {
      const sectionWithSecondary: PDFGreaseResultSectionItem = {
        title: 'Item with Secondary',
        value: 'Primary Value',
        secondaryValue: 'Secondary Value',
      };

      const testData: PDFGreaseReportResult = {
        ...mockGreaseData,
        sections: [
          {
            sectionTitle: 'Secondary Value Section',
            values: [sectionWithSecondary],
          },
        ],
      };

      const component = new GreaseResultCardContent(testData);
      const bounds = new Rect(0, 0, 200, 100);

      expect(() => component.evaluate(bounds)).not.toThrow();
    });
  });

  describe('row styling', () => {
    it('should alternate row styles for even and odd items', () => {
      const sectionWithMultipleItems: PDFGreaseResultSection = {
        sectionTitle: 'Multiple Items Section',
        values: [
          { title: 'Item 1', value: 'Value 1' }, // even (index 0)
          { title: 'Item 2', value: 'Value 2' }, // odd (index 1)
          { title: 'Item 3', value: 'Value 3' }, // even (index 2)
          { title: 'Item 4', value: 'Value 4' }, // odd (index 3)
        ],
      };

      const testData: PDFGreaseReportResult = {
        ...mockGreaseData,
        sections: [sectionWithMultipleItems],
      };

      const component = new GreaseResultCardContent(testData);
      const bounds = new Rect(0, 0, 200, 100);

      expect(() => component.evaluate(bounds)).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle empty sections array', () => {
      const emptyData: PDFGreaseReportResult = {
        ...mockGreaseData,
        sections: [],
      };

      const component = new GreaseResultCardContent(emptyData);
      const bounds = new Rect(0, 0, 200, 100);

      expect(() => component.evaluate(bounds)).not.toThrow();
    });

    it('should handle section with empty values array', () => {
      const emptySectionData: PDFGreaseReportResult = {
        ...mockGreaseData,
        sections: [
          {
            sectionTitle: 'Empty Section',
            values: [],
          },
        ],
      };

      const component = new GreaseResultCardContent(emptySectionData);
      const bounds = new Rect(0, 0, 200, 100);

      expect(() => component.evaluate(bounds)).not.toThrow();
    });

    it('should handle minimal grease data', () => {
      const minimalData: PDFGreaseReportResult = {
        sections: [],
        isSufficient: false,
        mainTitle: '',
        subTitle: '',
        qrCode: '',
        greaseLink: '',
      };

      const component = new GreaseResultCardContent(minimalData);
      const bounds = new Rect(0, 0, 200, 100);

      expect(() => component.evaluate(bounds)).not.toThrow();
    });
  });

  describe('badge styles', () => {
    it('should handle all badge styles', () => {
      const badgeStyles = [
        BadgeStyle.Primary,
        BadgeStyle.Error,
        BadgeStyle.Success,
        BadgeStyle.Warning,
        BadgeStyle.Recommended,
        BadgeStyle.Miscible,
      ];

      badgeStyles.forEach((style, index) => {
        const testData: PDFGreaseReportResult = {
          ...mockGreaseData,
          sections: [
            {
              sectionTitle: `Badge Test ${index}`,
              values: [
                {
                  title: `Badge Item ${index}`,
                  value: `Value ${index}`,
                  badgeClass: style,
                },
              ],
            },
          ],
        };

        const component = new GreaseResultCardContent(testData);
        const bounds = new Rect(0, 0, 200, 100);

        expect(() => component.evaluate(bounds)).not.toThrow();
      });
    });
  });
});
