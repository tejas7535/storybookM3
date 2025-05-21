import { Colors, FontOptions, Rect } from '@schaeffler/pdf-generator';

import { QrCodeLinkBlock } from './qr-code-link-block';

describe('QrCodeLinkBlock', () => {
  let component: QrCodeLinkBlock;
  let mockPdfDoc: any;

  const mockQrCodeBase64 = 'data:image/png;base64,mockBase64Data';
  const mockLinkText = 'Visit our website';
  const mockUrl = 'https://example.com';
  const mockFontOptions: FontOptions = { fontSize: 12 };
  const mockLinkColor = Colors.Primary;
  const mockQrCodeSize = 19;
  const mockSpacing = 2;
  const mockArrowSize = 4;

  beforeEach(() => {
    const mockJsPdf = {
      getTextColor: jest.fn().mockReturnValue('#000000'),
      setTextColor: jest.fn(),
      setFontSize: jest.fn(),
      getFont: jest
        .fn()
        .mockReturnValue({ fontName: 'Arial', fontStyle: 'normal' }),
      getFontSize: jest.fn().mockReturnValue(12),
      getLineHeightFactor: jest.fn().mockReturnValue(1.2),
      getTextDimensions: jest.fn().mockReturnValue({ w: 50, h: 10 }),
      getTextWidth: jest.fn().mockReturnValue(50),
      setFont: jest.fn(),
      getImageProperties: jest.fn(),
      addImage: jest.fn(),
    };

    mockPdfDoc = {
      reset: jest.fn(),
      pdfDoc: mockJsPdf,
    };

    component = new QrCodeLinkBlock(
      mockQrCodeBase64,
      mockLinkText,
      mockUrl,
      mockFontOptions
    );

    component.setDocument(mockPdfDoc);

    // Standard spies
    jest.spyOn(component as any, 'getMultilineTextHeight').mockReturnValue(15);
    jest.spyOn(component as any, 'text').mockImplementation(() => {});
    jest.spyOn(component as any, 'image').mockImplementation(() => {});
    jest.spyOn(component as any, 'setTextColor').mockReturnValue(() => {});

    // Set up getTextDimensions to return a specific value
    jest
      .spyOn(component as any, 'getTextDimensions')
      .mockReturnValue({ w: 50, h: 10 });

    // Ensure assertDoc returns the mock PDF doc
    jest
      .spyOn(component as any, 'assertDoc')
      .mockReturnValue(mockPdfDoc.pdfDoc);
  });

  describe('constructor', () => {
    it('should create an instance with default parameters', () => {
      expect(component).toBeTruthy();
      expect(component['qrCodeBase64']).toBe(mockQrCodeBase64);
      expect(component['linkText']).toBe(mockLinkText);
      expect(component['url']).toBe(mockUrl);
      expect(component['fontOptions']).toBe(mockFontOptions);
      expect(component['linkColor']).toBe(Colors.Primary);
      expect(component['qrCodeSize']).toBe(19);
      expect(component['spacing']).toBe(2);
    });

    it('should set hasQrCode to true when qrCodeBase64 is provided', () => {
      expect(component['hasQrCode']).toBe(true);
    });

    it('should set hasQrCode to false when qrCodeBase64 is not provided', () => {
      const componentWithoutQrCode = new QrCodeLinkBlock(
        undefined,
        mockLinkText,
        mockUrl,
        mockFontOptions
      );
      expect(componentWithoutQrCode['hasQrCode']).toBe(false);
    });

    it('should create an instance with custom parameters', () => {
      const customLinkColor = '#FF0000';
      const customQrCodeSize = 25;
      const customSpacing = 5;
      const customArrowSize = 6;

      const customComponent = new QrCodeLinkBlock(
        mockQrCodeBase64,
        mockLinkText,
        mockUrl,
        mockFontOptions,
        customLinkColor,
        customQrCodeSize,
        customSpacing,
        customArrowSize
      );

      expect(customComponent['linkColor']).toBe(customLinkColor);
      expect(customComponent['qrCodeSize']).toBe(customQrCodeSize);
      expect(customComponent['spacing']).toBe(customSpacing);
      expect(customComponent['arrowSize']).toBe(customArrowSize);
    });
  });

  describe('evaluate', () => {
    it('should calculate correct height with QR code present', () => {
      const bounds = new Rect(0, 0, 200, 100);

      const [fits, height] = component.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(19); // Should be the maximum of qrCodeSize (default 19) and text height (mocked 15)
      expect(component['getMultilineTextHeight']).toHaveBeenCalledWith(
        mockLinkText,
        bounds.width -
          mockQrCodeSize -
          mockSpacing -
          Math.max(1, mockSpacing - 1) -
          mockArrowSize,
        mockFontOptions
      );
    });

    it('should calculate correct height without QR code', () => {
      const componentWithoutQrCode = new QrCodeLinkBlock(
        undefined,
        mockLinkText,
        mockUrl,
        mockFontOptions
      );

      jest
        .spyOn(componentWithoutQrCode as any, 'getMultilineTextHeight')
        .mockReturnValue(15);
      componentWithoutQrCode.setDocument(mockPdfDoc);

      const bounds = new Rect(0, 0, 200, 100);

      const [fits, height] = componentWithoutQrCode.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(15); // Should be just the text height
      expect(
        componentWithoutQrCode['getMultilineTextHeight']
      ).toHaveBeenCalledWith(
        mockLinkText,
        bounds.width - Math.max(1, mockSpacing - 1) - mockArrowSize,
        mockFontOptions
      );
    });

    it('should handle text height taller than QR code', () => {
      jest
        .spyOn(component as any, 'getMultilineTextHeight')
        .mockReturnValue(25);

      const bounds = new Rect(0, 0, 200, 100);

      const [fits, height] = component.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(25); // Should use the taller text height
    });
  });

  describe('render', () => {
    beforeEach(() => {
      const bounds = new Rect(10, 20, 200, 100);
      component.setBounds(bounds);
      component.evaluate(bounds);
    });

    it('should set the text color to the linkColor', () => {
      component.render();

      expect(component['setTextColor']).toHaveBeenCalledWith(mockLinkColor);
    });

    it('should render QR code when available', () => {
      component.render();

      expect(component['image']).toHaveBeenCalledWith(
        mockQrCodeBase64,
        10, // bounds.x
        20, // bounds.y
        mockQrCodeSize,
        mockQrCodeSize
      );
    });

    it('should not render QR code when not available', () => {
      const componentWithoutQrCode = new QrCodeLinkBlock(
        undefined,
        mockLinkText,
        mockUrl,
        mockFontOptions
      );

      jest
        .spyOn(componentWithoutQrCode as any, 'text')
        .mockImplementation(() => {});
      jest
        .spyOn(componentWithoutQrCode as any, 'image')
        .mockImplementation(() => {});
      jest
        .spyOn(componentWithoutQrCode as any, 'setTextColor')
        .mockReturnValue(() => {});
      jest
        .spyOn(componentWithoutQrCode as any, 'getMultilineTextHeight')
        .mockReturnValue(15);
      jest
        .spyOn(componentWithoutQrCode as any, 'getTextDimensions')
        .mockReturnValue({ w: 50, h: 10 });
      jest
        .spyOn(componentWithoutQrCode as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      componentWithoutQrCode.setDocument(mockPdfDoc);

      const bounds = new Rect(10, 20, 200, 100);
      componentWithoutQrCode.setBounds(bounds);
      componentWithoutQrCode.evaluate(bounds);

      componentWithoutQrCode.render();

      // Check that the image method is never called with QR code data
      expect(componentWithoutQrCode['image']).not.toHaveBeenCalledWith(
        mockQrCodeBase64,
        expect.any(Number),
        expect.any(Number),
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should render text at the correct position with QR code present', () => {
      component.render();

      expect(component['text']).toHaveBeenCalledWith(
        10 + mockQrCodeSize + mockSpacing, // textX
        expect.any(Number), // textY (calculated based on centering)
        mockLinkText,
        {
          fontOptions: mockFontOptions,
          textOptions: { maxWidth: expect.any(Number) },
          link: mockUrl,
        }
      );
    });

    it('should render text at the correct position without QR code', () => {
      const componentWithoutQrCode = new QrCodeLinkBlock(
        undefined,
        mockLinkText,
        mockUrl,
        mockFontOptions
      );

      jest
        .spyOn(componentWithoutQrCode as any, 'text')
        .mockImplementation(() => {});
      jest
        .spyOn(componentWithoutQrCode as any, 'image')
        .mockImplementation(() => {});
      jest
        .spyOn(componentWithoutQrCode as any, 'setTextColor')
        .mockReturnValue(() => {});
      jest
        .spyOn(componentWithoutQrCode as any, 'getMultilineTextHeight')
        .mockReturnValue(15);
      jest
        .spyOn(componentWithoutQrCode as any, 'getTextDimensions')
        .mockReturnValue({ w: 50, h: 10 });
      jest
        .spyOn(componentWithoutQrCode as any, 'assertDoc')
        .mockReturnValue(mockPdfDoc.pdfDoc);

      componentWithoutQrCode.setDocument(mockPdfDoc);

      const bounds = new Rect(10, 20, 200, 100);
      componentWithoutQrCode.setBounds(bounds);
      componentWithoutQrCode.evaluate(bounds);

      componentWithoutQrCode.render();

      expect(componentWithoutQrCode['text']).toHaveBeenCalledWith(
        10, // bounds.x
        20, // bounds.y
        mockLinkText,
        {
          fontOptions: mockFontOptions,
          textOptions: { maxWidth: expect.any(Number) },
          link: mockUrl,
        }
      );
    });
  });
});
