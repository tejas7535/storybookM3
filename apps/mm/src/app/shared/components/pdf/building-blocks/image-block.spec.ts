import { Rect } from '@schaeffler/pdf-generator';

import { ImageBlock } from './image-block';

describe('ImageBlock', () => {
  let imageBlock: ImageBlock;
  let mockPdfDoc: any;
  const mockImageData = 'base64encodedimagedata';
  const mockWidth = 100;
  const mockHeight = 50;

  beforeEach(() => {
    const mockJsPdf = {
      addImage: jest.fn(),
      getImageProperties: jest
        .fn()
        .mockReturnValue({ width: 200, height: 100 }),
    };

    mockPdfDoc = {
      reset: jest.fn(),
      pdfDoc: mockJsPdf,
    };

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with width and no height', () => {
      imageBlock = new ImageBlock(mockImageData, mockWidth);
      expect(imageBlock).toBeTruthy();
    });

    it('should create an instance with width and height', () => {
      imageBlock = new ImageBlock(mockImageData, mockWidth, mockHeight);
      expect(imageBlock).toBeTruthy();
    });
  });

  describe('evaluate', () => {
    beforeEach(() => {
      imageBlock = new ImageBlock(mockImageData, mockWidth, mockHeight);
      imageBlock.setDocument(mockPdfDoc);
      jest
        .spyOn(imageBlock as any, 'scaleImage')
        .mockReturnValue([mockWidth, mockHeight * 2]);
    });

    it('should use provided height when available', () => {
      const bounds = new Rect(0, 0, 200, 200);
      const [fits, height] = imageBlock.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(mockHeight + 7); // Account for topPadding
    });

    it('should use calculated height when no height provided', () => {
      imageBlock = new ImageBlock(mockImageData, mockWidth);
      imageBlock.setDocument(mockPdfDoc);
      jest
        .spyOn(imageBlock as any, 'scaleImage')
        .mockReturnValue([mockWidth, mockHeight * 2]);

      const bounds = new Rect(0, 0, 200, 200);
      const [fits, height] = imageBlock.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(mockHeight * 2 + 7); // Account for topPadding
    });

    it('should handle errors when scaling image', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(imageBlock as any, 'scaleImage').mockImplementation(() => {
        throw new Error('Error scaling image');
      });

      const bounds = new Rect(0, 0, 200, 200);
      const [fits, height] = imageBlock.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(mockHeight + 7); // Account for topPadding
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('render', () => {
    beforeEach(() => {
      imageBlock = new ImageBlock(mockImageData, mockWidth, mockHeight);
      imageBlock.setDocument(mockPdfDoc);
      jest.spyOn(imageBlock as any, 'image').mockImplementation(() => {});
    });

    it('should render the image', () => {
      const bounds = new Rect(0, 0, 200, 200);
      imageBlock.setBounds(bounds);
      imageBlock.render();

      expect(imageBlock['image']).toHaveBeenCalledWith(
        mockImageData,
        bounds.x,
        bounds.y + 7, // Account for topPadding
        mockWidth
      );
    });

    it('should handle errors when rendering image', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(imageBlock as any, 'image').mockImplementation(() => {
        throw new Error('Error rendering image');
      });

      const bounds = new Rect(0, 0, 200, 200);
      imageBlock.setBounds(bounds);
      imageBlock.render();

      expect(console.error).toHaveBeenCalled();
    });
  });
});
