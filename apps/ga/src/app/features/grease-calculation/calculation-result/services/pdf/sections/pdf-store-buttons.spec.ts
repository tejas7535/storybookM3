import { Rect } from '@schaeffler/pdf-generator';

import { PDFStoreButtonComponent } from './pdf-store-buttons';

describe('PDFStoreButtonComponent', () => {
  let component: PDFStoreButtonComponent;

  const mockProps = {
    buttons: [
      {
        store: 'AppStore' as const,
        qrImageData: 'mock-app-store-qr-data',
      },
      {
        store: 'PlayStore' as const,
        qrImageData: 'mock-play-store-qr-data',
      },
    ],
  };

  const mockBounds = {
    x: 10,
    y: 10,
    width: 200,
    height: 100,
    TopLeft: { x: 10, y: 10 },
    BottomRight: { x: 210, y: 110 },
    isWithin: jest.fn(),
  };

  beforeEach(() => {
    component = new PDFStoreButtonComponent(mockProps);
    component.setBounds(mockBounds as Rect);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be created with correct props', () => {
    expect((component as any).props).toEqual(mockProps);
  });

  describe('constructor', () => {
    it('should initialize with provided props', () => {
      const testProps = {
        buttons: [
          {
            store: 'AppStore' as const,
            qrImageData: 'test-qr-data',
          },
        ],
      };

      const testComponent = new PDFStoreButtonComponent(testProps);

      expect((testComponent as any).props).toEqual(testProps);
    });

    it('should handle empty buttons array', () => {
      const emptyProps: {
        buttons: { store: 'AppStore' | 'PlayStore'; qrImageData: string }[];
      } = { buttons: [] };
      const testComponent = new PDFStoreButtonComponent(emptyProps);

      expect((testComponent as any).props.buttons).toHaveLength(0);
    });
  });

  describe('evaluate', () => {
    it('should not fit when bounds height is less than or equal to IMAGE_HEIGHT', () => {
      const smallBounds = {
        ...mockBounds,
        height: 14, // Equal to IMAGE_HEIGHT
      };

      const result = component.evaluate(smallBounds as any);

      expect(result[0]).toBe(false); // doesn't fit
      expect(result[1]).toBe(4); // height - 10 = 14 - 10 = 4
      expect(result[2]).toBe(component); // component that doesn't fit
    });

    it('should not fit when bounds height is less than IMAGE_HEIGHT', () => {
      const verySmallBounds = {
        ...mockBounds,
        height: 10, // Less than IMAGE_HEIGHT (14)
      };

      const result = component.evaluate(verySmallBounds as any);

      expect(result[0]).toBe(false); // doesn't fit
      expect(result[1]).toBe(0); // height - 10 = 10 - 10 = 0
      expect(result[2]).toBe(component); // component that doesn't fit
    });

    it('should return [true, height-10, undefined, undefined] when bounds height is greater than IMAGE_HEIGHT', () => {
      const largeBounds = {
        ...mockBounds,
        height: 50, // Greater than IMAGE_HEIGHT (14)
      };

      const result = component.evaluate(largeBounds as any);

      expect(result[0]).toBe(true); // fits
      expect(result[1]).toBe(40); // height - 10 = 50 - 10 = 40
      expect(result[2]).toBeUndefined(); // no fitting component
      expect(result[3]).toBeUndefined(); // no remainder component
    });
  });

  describe('constants', () => {
    it('should have correct constant values', () => {
      const QR_HEIGHT = 16;
      const IMAGE_HEIGHT = 14;
      const QR_SPACING = 4;
      const STORE_SPACING = 6;
      expect(QR_HEIGHT).toBe(16);
      expect(IMAGE_HEIGHT).toBe(14);
      expect(QR_SPACING).toBe(4);
      expect(STORE_SPACING).toBe(6);
    });
  });

  describe('render', () => {
    it('should call super.render and draw images for each button', () => {
      const superRenderSpy = jest.spyOn(
        PDFStoreButtonComponent.prototype,
        'render'
      );

      const imageSpy = jest
        .spyOn(component as any, 'image')
        .mockImplementation(() => {});
      const scaleImageSpy = jest
        .spyOn(component as any, 'scaleImage')
        .mockReturnValue([10]);

      component.render();

      expect(superRenderSpy).toHaveBeenCalled();
      expect(imageSpy).toHaveBeenCalled();
      expect(scaleImageSpy).toHaveBeenCalled();

      expect(imageSpy).toHaveBeenCalledTimes(mockProps.buttons.length * 2);

      imageSpy.mockRestore();
      scaleImageSpy.mockRestore();
      superRenderSpy.mockRestore();
    });
  });
});
