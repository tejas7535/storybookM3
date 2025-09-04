import { Rect } from '@schaeffler/pdf-generator';

import { QrCodeBlock } from './qr-code-block';

describe('QrCodeBlock', () => {
  const mockQrCodeBase64 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

  describe('constructor', () => {
    it('should create with default values', () => {
      const block = new QrCodeBlock(mockQrCodeBase64);

      expect(block).toBeDefined();
    });

    it('should create with custom size and padding', () => {
      const block = new QrCodeBlock(mockQrCodeBase64, 30, 5);

      expect(block).toBeDefined();
    });
  });

  describe('evaluate', () => {
    it('should return correct height with default values', () => {
      const block = new QrCodeBlock(mockQrCodeBase64);
      const bounds = new Rect(0, 0, 100, 100);

      const [canFit, height] = block.evaluate(bounds);

      expect(canFit).toBe(true);
      expect(height).toBe(24); // 20 (default size) + 4 (2 * default padding)
    });

    it('should return correct height with custom values', () => {
      const block = new QrCodeBlock(mockQrCodeBase64, 30, 5);
      const bounds = new Rect(0, 0, 100, 100);

      const [canFit, height] = block.evaluate(bounds);

      expect(canFit).toBe(true);
      expect(height).toBe(40); // 30 (custom size) + 10 (2 * custom padding)
    });
  });

  describe('render', () => {
    let mockImage: jest.Mock;

    beforeEach(() => {
      mockImage = jest.fn();
    });

    it('should render QR code with default values', () => {
      const block = new QrCodeBlock(mockQrCodeBase64);
      (block as any).image = mockImage;
      (block as any).bounds = { x: 10, y: 20, width: 100, height: 100 };

      block.render();

      expect(mockImage).toHaveBeenCalledWith(
        mockQrCodeBase64,
        12, // x + padding (10 + 2)
        22, // y + padding (20 + 2)
        20, // default size
        20 // default size
      );
    });

    it('should render QR code with custom values', () => {
      const block = new QrCodeBlock(mockQrCodeBase64, 30, 5);
      (block as any).image = mockImage;
      (block as any).bounds = { x: 10, y: 20, width: 100, height: 100 };

      block.render();

      expect(mockImage).toHaveBeenCalledWith(
        mockQrCodeBase64,
        15, // x + padding (10 + 5)
        25, // y + padding (20 + 5)
        30, // custom size
        30 // custom size
      );
    });

    it('should handle empty QR code data gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const block = new QrCodeBlock('');
      (block as any).image = mockImage;
      (block as any).bounds = { x: 10, y: 20, width: 100, height: 100 };

      block.render();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'QR code data is empty, skipping render'
      );
      expect(mockImage).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should handle render errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const block = new QrCodeBlock(mockQrCodeBase64);
      (block as any).image = jest.fn().mockImplementation(() => {
        throw new Error('Render error');
      });
      (block as any).bounds = { x: 10, y: 20, width: 100, height: 100 };

      block.render();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error rendering QR code:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
