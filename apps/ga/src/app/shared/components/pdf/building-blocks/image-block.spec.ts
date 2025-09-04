import { Rect } from '@schaeffler/pdf-generator';

import { ImageBlock } from './image-block';

describe('ImageBlock', () => {
  let imageBlock: ImageBlock;
  let mockPdfDoc: any;
  const mockImageData = 'base64encodedimagedata';
  const mockWidth = 100;
  const mockHeight = 50;
  const topPadding = 2;

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

    it('should create an instance with custom options', () => {
      const options = {
        topPadding: 10,
        leftPadding: 5,
        rightPadding: 15,
        centered: true,
      };
      imageBlock = new ImageBlock(
        mockImageData,
        mockWidth,
        mockHeight,
        options
      );
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
      expect(height).toBe(mockHeight + topPadding);
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
      expect(height).toBe(mockHeight * 2 + topPadding);
    });

    it('should use custom top padding when provided', () => {
      const customTopPadding = 10;
      imageBlock = new ImageBlock(mockImageData, mockWidth, mockHeight, {
        topPadding: customTopPadding,
      });
      imageBlock.setDocument(mockPdfDoc);
      jest
        .spyOn(imageBlock as any, 'scaleImage')
        .mockReturnValue([mockWidth, mockHeight]);

      const bounds = new Rect(0, 0, 200, 200);
      const [fits, height] = imageBlock.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(mockHeight + customTopPadding);
    });

    it('should handle errors when scaling image', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(imageBlock as any, 'scaleImage').mockImplementation(() => {
        throw new Error('Error scaling image');
      });

      const bounds = new Rect(0, 0, 200, 200);
      const [fits, height] = imageBlock.evaluate(bounds);

      expect(fits).toBe(true);
      expect(height).toBe(mockHeight + topPadding);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('render', () => {
    beforeEach(() => {
      imageBlock = new ImageBlock(mockImageData, mockWidth, mockHeight);
      imageBlock.setDocument(mockPdfDoc);
      jest.spyOn(imageBlock as any, 'image').mockImplementation(() => {});
    });

    it('should render the image with default positioning', () => {
      const bounds = new Rect(0, 0, 200, 200);
      imageBlock.setBounds(bounds);
      imageBlock.render();

      expect(imageBlock['image']).toHaveBeenCalledWith(
        mockImageData,
        bounds.x,
        bounds.y + topPadding,
        mockWidth
      );
    });

    it('should render the image with left padding', () => {
      const leftPadding = 10;
      imageBlock = new ImageBlock(mockImageData, mockWidth, mockHeight, {
        leftPadding,
      });
      imageBlock.setDocument(mockPdfDoc);
      jest.spyOn(imageBlock as any, 'image').mockImplementation(() => {});

      const bounds = new Rect(0, 0, 200, 200);
      imageBlock.setBounds(bounds);
      imageBlock.render();

      expect(imageBlock['image']).toHaveBeenCalledWith(
        mockImageData,
        bounds.x + leftPadding,
        bounds.y + topPadding,
        mockWidth
      );
    });

    it('should render the image centered when centered option is true', () => {
      const leftPadding = 10;
      const rightPadding = 15;
      imageBlock = new ImageBlock(mockImageData, mockWidth, mockHeight, {
        leftPadding,
        rightPadding,
        centered: true,
      });
      imageBlock.setDocument(mockPdfDoc);
      jest.spyOn(imageBlock as any, 'image').mockImplementation(() => {});

      const bounds = new Rect(0, 0, 200, 200);
      imageBlock.setBounds(bounds);
      imageBlock.render();

      // Calculate expected centered position
      const availableWidth = bounds.width - leftPadding - rightPadding;
      const imageXOffset = (availableWidth - mockWidth) / 2;
      const expectedXPosition = bounds.x + leftPadding + imageXOffset;

      expect(imageBlock['image']).toHaveBeenCalledWith(
        mockImageData,
        expectedXPosition,
        bounds.y + topPadding,
        mockWidth
      );
    });

    it('should render the image centered without padding when centered option is true', () => {
      imageBlock = new ImageBlock(mockImageData, mockWidth, mockHeight, {
        centered: true,
      });
      imageBlock.setDocument(mockPdfDoc);
      jest.spyOn(imageBlock as any, 'image').mockImplementation(() => {});

      const bounds = new Rect(0, 0, 200, 200);
      imageBlock.setBounds(bounds);
      imageBlock.render();

      // Calculate expected centered position with no padding
      const availableWidth = bounds.width - 0 - 0; // no left/right padding
      const imageXOffset = (availableWidth - mockWidth) / 2;
      const expectedXPosition = bounds.x + 0 + imageXOffset;

      expect(imageBlock['image']).toHaveBeenCalledWith(
        mockImageData,
        expectedXPosition,
        bounds.y + topPadding,
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
