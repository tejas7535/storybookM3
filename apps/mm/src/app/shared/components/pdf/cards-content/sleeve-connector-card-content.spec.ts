import { Component } from '@schaeffler/pdf-generator';

import { Link } from '../base-components/base-component';
import { SleeveConnectorCardContent } from './sleeve-connector-card-content';

class MockComponent extends Component {
  evaluate = jest.fn().mockReturnValue([true, 100]);
  render = jest.fn();
  setDocument = jest.fn();
  setBounds = jest.fn();
}

jest.mock('../building-blocks', () => ({
  TextBlock: jest.fn().mockImplementation(() => new MockComponent()),
  QrCodeLinkBlock: jest.fn().mockImplementation(() => new MockComponent()),
}));

jest.mock('../layout/layout-components', () => ({
  ColumnLayout: jest.fn().mockImplementation(() => new MockComponent()),
  TwoColumnLayout: jest.fn().mockImplementation(() => new MockComponent()),
}));

describe('SleeveConnectorCardContent', () => {
  let component: SleeveConnectorCardContent;
  let mockPdfDoc: any;

  const defaultLink: Link = {
    text: 'Link Text',
    url: 'https://example.com',
    qrCodeBase64: 'data:image/png;base64,mockQrCodeData',
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

    component = new SleeveConnectorCardContent(
      'Title',
      'Description',
      'Right Title',
      'Right Description',
      defaultLink,
      {}
    );

    component.setDocument(mockPdfDoc);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should evaluate and calculate height', () => {
    const bounds = { x: 0, y: 0, width: 100, height: 200 };
    const [success, height] = component.evaluate(bounds as any);

    expect(success).toBe(true);
    expect(height).toBeGreaterThan(0);
  });

  it('should render content', () => {
    const bounds = { x: 0, y: 0, width: 100, height: 200 };
    component.evaluate(bounds as any);
    component.setBounds(bounds as any);

    component.render();

    // @ts-expect-error - accessing private property for testing
    expect(component.content.setBounds).toHaveBeenCalled();
    // @ts-expect-error - accessing private property for testing
    expect(component.content.render).toHaveBeenCalled();
  });

  it('should use QrCodeLinkBlock with the QR code data', () => {
    jest.clearAllMocks();

    new SleeveConnectorCardContent(
      'Title',
      'Description',
      'Right Title',
      'Right Description',
      defaultLink,
      {}
    );

    const { QrCodeLinkBlock } = jest.requireMock('../building-blocks');
    expect(QrCodeLinkBlock).toHaveBeenCalledWith(
      defaultLink.qrCodeBase64,
      defaultLink.text,
      defaultLink.url,
      expect.anything(), // linkFontOptions
      expect.anything() // Colors.Primary
    );
  });

  it('should handle links without QR code data', () => {
    jest.clearAllMocks();

    const linkWithoutQR: Link = {
      text: 'Link without QR',
      url: 'https://example.com',
    };

    new SleeveConnectorCardContent(
      'Title',
      'Description',
      'Right Title',
      'Right Description',
      linkWithoutQR,
      {}
    );

    const { QrCodeLinkBlock } = jest.requireMock('../building-blocks');
    expect(QrCodeLinkBlock).toHaveBeenCalledWith(
      undefined,
      linkWithoutQR.text,
      linkWithoutQR.url,
      expect.anything(), // linkFontOptions
      expect.anything() // Colors.Primary
    );
  });

  it('should apply custom options when provided', () => {
    jest.clearAllMocks();

    const customOptions = {
      leftColumnWidth: 0.4,
      dividerColor: '#FF0000',
      dividerGap: 10,
      padding: 15,
      margin: 5,
    };

    new SleeveConnectorCardContent(
      'Title',
      'Description',
      'Right Title',
      'Right Description',
      defaultLink,
      customOptions
    );

    const { TwoColumnLayout } = jest.requireMock('../layout/layout-components');
    expect(TwoColumnLayout).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      customOptions.leftColumnWidth,
      customOptions.dividerGap,
      true,
      customOptions.dividerColor
    );
  });
});
