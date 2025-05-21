import { Colors, Component, Rect } from '@schaeffler/pdf-generator';

import { Link } from '../base-components/base-component';
import { BadgeConfig } from '../building-blocks';
import {
  MountingToolBadgePosition,
  MountingToolCardContent,
} from './mounting-tool-card-content';

class MockComponent extends Component {
  evaluate = jest.fn().mockReturnValue([true, 100]);
  render = jest.fn();
  setDocument = jest.fn();
  setBounds = jest.fn();
}

jest.mock('../building-blocks', () => ({
  BadgeBlock: jest.fn().mockImplementation(() => new MockComponent()),
  ImageBlock: jest.fn().mockImplementation(() => new MockComponent()),
  TextBlock: jest.fn().mockImplementation(() => new MockComponent()),
  LinkBlock: jest.fn().mockImplementation(() => new MockComponent()),
  QrCodeLinkBlock: jest.fn().mockImplementation(() => new MockComponent()),
}));

jest.mock('../layout/layout-components', () => ({
  ColumnLayout: jest.fn().mockImplementation(() => new MockComponent()),
  TwoColumnLayout: jest.fn().mockImplementation(() => new MockComponent()),
  RowLayout: jest.fn().mockImplementation(() => new MockComponent()),
}));

describe('MountingToolCardContent', () => {
  let cardContent: MountingToolCardContent;
  let mockPdfDoc: any;
  let mockBounds: Rect;

  const defaultTitle = 'Test Title';
  const defaultDescription = 'Test Description';
  const defaultLink: Link = {
    text: 'View Product',
    url: 'https://example.com',
    qrCodeBase64: 'base64qrcode',
  };
  const defaultImageData = 'base64image';
  const defaultBadge: BadgeConfig = {
    textValue: 'Recommended',
    style: 'recommended',
    position: 'top-right',
  };

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
    // Define variables to hold mocked modules
    let BadgeBlock: jest.Mock;
    let RowLayout: jest.Mock;

    beforeEach(() => {
      // Get fresh instances of mocks before each test
      BadgeBlock = jest.requireMock('../building-blocks').BadgeBlock;
      RowLayout = jest.requireMock('../layout/layout-components').RowLayout;

      // Clear any previous calls
      jest.clearAllMocks();
    });

    it('should create with required parameters', () => {
      cardContent = new MountingToolCardContent(
        defaultTitle,
        defaultDescription,
        defaultLink
      );

      expect(cardContent).toBeTruthy();
    });

    it('should create with all parameters', () => {
      cardContent = new MountingToolCardContent(
        defaultTitle,
        defaultDescription,
        defaultLink,
        defaultImageData,
        defaultBadge,
        {
          leftColumnWidth: 0.25,
          imageWidth: 30,
          dividerColor: Colors.Primary,
          dividerGap: 10,
        }
      );

      expect(cardContent).toBeTruthy();
    });

    it('should handle badge with top-right position (default)', () => {
      cardContent = new MountingToolCardContent(
        defaultTitle,
        defaultDescription,
        defaultLink,
        defaultImageData,
        defaultBadge
      );

      expect(BadgeBlock).toHaveBeenCalledWith(defaultBadge);
      expect(RowLayout).toHaveBeenCalled();
    });

    it('should handle badge with above-title position', () => {
      const aboveTitleBadge: BadgeConfig = {
        ...defaultBadge,
        position: 'above-title' as MountingToolBadgePosition,
      };

      cardContent = new MountingToolCardContent(
        defaultTitle,
        defaultDescription,
        defaultLink,
        defaultImageData,
        aboveTitleBadge
      );

      expect(BadgeBlock).toHaveBeenCalledWith(aboveTitleBadge);
      // RowLayout should not be used for above-title badge
      expect(RowLayout).not.toHaveBeenCalled();
    });

    it('should handle no badge', () => {
      cardContent = new MountingToolCardContent(
        defaultTitle,
        defaultDescription,
        defaultLink,
        defaultImageData
      );

      expect(BadgeBlock).not.toHaveBeenCalled();
    });
  });

  describe('evaluate', () => {
    beforeEach(() => {
      cardContent = new MountingToolCardContent(
        defaultTitle,
        defaultDescription,
        defaultLink,
        defaultImageData
      );

      cardContent.setDocument(mockPdfDoc);
    });

    it('should calculate height and return correct values', () => {
      const [success, height] = cardContent.evaluate(mockBounds);

      expect(success).toBe(true);
      expect(height).toBeGreaterThan(0);
    });
  });

  describe('render', () => {
    beforeEach(() => {
      cardContent = new MountingToolCardContent(
        defaultTitle,
        defaultDescription,
        defaultLink,
        defaultImageData
      );

      cardContent.setDocument(mockPdfDoc);

      cardContent.evaluate(mockBounds);
      cardContent.setBounds(mockBounds);
    });

    it('should call render on the content component', () => {
      cardContent.render();

      // @ts-expect-error - accessing private property for testing
      expect(cardContent.content.setBounds).toHaveBeenCalled();
      // @ts-expect-error - accessing private property for testing
      expect(cardContent.content.render).toHaveBeenCalled();
    });
  });
});
