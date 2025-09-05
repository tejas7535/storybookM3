/* eslint-disable unicorn/number-literal-case */
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { firstValueFrom } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ImageResolverService } from './image-resolver.service';

describe('ImageResolverService', () => {
  let spectator: SpectatorService<ImageResolverService>;
  let service: ImageResolverService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: ImageResolverService,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  // Helper function to create a proper FileReader mock
  const _createFileReaderMock = (result: string) => {
    const eventListeners: { [key: string]: ((event: any) => void)[] } = {};

    return {
      readAsDataURL: jest.fn(),
      result,
      addEventListener: jest.fn(
        (eventType: string, handler: (event: any) => void) => {
          if (!eventListeners[eventType]) {
            eventListeners[eventType] = [];
          }
          eventListeners[eventType].push(handler);
        }
      ),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      // Helper method to trigger events
      _triggerEvent: (eventType: string, event: any = {}) => {
        const handlers = eventListeners[eventType] || [];
        handlers.forEach((handler) =>
          handler({ ...event, target: { result } })
        );
      },
    };
  };

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchImageObject', () => {
    it('should fetch image and convert to base64', async () => {
      const mockData = { id: 1, imageUrl: 'https://example.com/image.jpg' };
      const mockBlob = new Blob(['mock image data'], { type: 'image/jpeg' });
      const mockBase64 = 'data:image/jpeg;base64,bW9jayBpbWFnZSBkYXRh';

      // Mock FileReader with proper event handling
      const mockFileReader = _createFileReaderMock(mockBase64);

      const fileReaderSpy = jest
        .spyOn(window, 'FileReader')
        .mockImplementation(() => mockFileReader as any);

      const promise = firstValueFrom(
        service.fetchImageObject(mockData, 'imageUrl')
      );

      // Simulate HTTP response
      const req = httpMock.expectOne('https://example.com/image.jpg');
      expect(req.request.responseType).toBe('blob');
      req.flush(mockBlob);

      // Trigger the loadend event after a small delay
      setTimeout(() => {
        (mockFileReader as any)._triggerEvent('loadend');
      }, 0);

      const result = await promise;

      expect(result).toEqual({
        ...mockData,
        imageUrl: mockBase64,
      });
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockBlob);

      fileReaderSpy.mockRestore();
    });

    it('should handle different property keys', async () => {
      const mockData = { id: 1, logoSrc: 'https://example.com/logo.png' };
      const mockBlob = new Blob(['mock logo data'], { type: 'image/png' });
      const mockBase64 = 'data:image/png;base64,bW9jayBsb2dvIGRhdGE=';

      const mockFileReader = _createFileReaderMock(mockBase64);
      const fileReaderSpy = jest
        .spyOn(window, 'FileReader')
        .mockImplementation(() => mockFileReader as any);

      const promise = firstValueFrom(
        service.fetchImageObject(mockData, 'logoSrc')
      );

      const req = httpMock.expectOne('https://example.com/logo.png');
      req.flush(mockBlob);

      // Trigger the loadend event
      setTimeout(() => {
        (mockFileReader as any)._triggerEvent('loadend');
      }, 0);

      const result = await promise;

      expect(result.logoSrc).toBe(mockBase64);

      fileReaderSpy.mockRestore();
    });
  });

  describe('fetchImages', () => {
    it('should fetch multiple images and convert to base64', async () => {
      const mockData = [
        { id: 1, imageUrl: 'https://example.com/image1.jpg' },
        { id: 2, imageUrl: 'https://example.com/image2.jpg' },
      ];
      const mockBlob1 = new Blob(['mock image 1'], { type: 'image/jpeg' });
      const mockBlob2 = new Blob(['mock image 2'], { type: 'image/jpeg' });
      const mockBase64_1 = 'data:image/jpeg;base64,bW9jayBpbWFnZSAx';
      const mockBase64_2 = 'data:image/jpeg;base64,bW9jayBpbWFnZSAy';

      let callCount = 0;
      const fileReaderSpy = jest
        .spyOn(window, 'FileReader')
        .mockImplementation(() => {
          const isFirstCall = callCount === 0;
          callCount += 1;
          const result = isFirstCall ? mockBase64_1 : mockBase64_2;

          return _createFileReaderMock(result) as any;
        });

      const promise = firstValueFrom(service.fetchImages(mockData, 'imageUrl'));

      // Handle first request (concatMap processes sequentially)
      const req1 = httpMock.expectOne('https://example.com/image1.jpg');
      req1.flush(mockBlob1);

      // Trigger first FileReader
      setTimeout(() => {
        const firstReader = fileReaderSpy.mock.results[0].value;
        (firstReader as any)._triggerEvent('loadend');
      }, 0);

      // Wait a bit then handle second request
      setTimeout(() => {
        const req2 = httpMock.expectOne('https://example.com/image2.jpg');
        req2.flush(mockBlob2);

        // Trigger second FileReader
        setTimeout(() => {
          const secondReader = fileReaderSpy.mock.results[1].value;
          (secondReader as any)._triggerEvent('loadend');
        }, 0);
      }, 10);

      const result = await promise;

      expect(result).toHaveLength(2);
      expect(result[0].imageUrl).toBe(mockBase64_1);
      expect(result[1].imageUrl).toBe(mockBase64_2);

      fileReaderSpy.mockRestore();
    });
  });

  describe('readImageFromAssets', () => {
    it('should load asset image and convert to base64', async () => {
      const assetPath = '/assets/images/logo.png';
      const mockBlob = new Blob(['mock asset data'], { type: 'image/png' });
      const mockBase64 = 'data:image/png;base64,bW9jayBhc3NldCBkYXRh';

      const mockFileReader = {
        readAsDataURL: jest.fn(),
        result: mockBase64,
        onloadend: undefined as any,
        addEventListener: jest.fn(),
      };
      jest
        .spyOn(window, 'FileReader')
        .mockImplementation(() => mockFileReader as any);

      const promise = firstValueFrom(service.readImageFromAssets(assetPath));

      const req = httpMock.expectOne(assetPath);
      expect(req.request.responseType).toBe('blob');
      req.flush(mockBlob);

      // Simulate FileReader loadend event
      setTimeout(() => {
        if (mockFileReader.onloadend) {
          mockFileReader.onloadend({} as any);
        }
      }, 0);

      const result = await promise;

      expect(result).toBe(mockBase64);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockBlob);
    });

    it('should handle HTTP errors', async () => {
      const assetPath = '/assets/images/nonexistent.png';

      const promise = firstValueFrom(service.readImageFromAssets(assetPath));

      const req = httpMock.expectOne(assetPath);
      req.error(new ProgressEvent('error'), {
        status: 404,
        statusText: 'Not Found',
      });

      await expect(promise).rejects.toBeTruthy();
    });
  });

  describe('readBlob (private method)', () => {
    it('should convert blob to base64 via readBlob method', async () => {
      const mockBlob = new Blob(['test data'], { type: 'text/plain' });
      const mockBase64 = 'data:text/plain;base64,dGVzdCBkYXRh';

      const mockFileReader = {
        readAsDataURL: jest.fn(),
        result: mockBase64,
        onloadend: undefined as any,
        addEventListener: jest.fn(),
      };
      jest
        .spyOn(window, 'FileReader')
        .mockImplementation(() => mockFileReader as any);

      // Access private method for testing
      const readBlobMethod = (service as any).readBlob.bind(service);
      const promise = firstValueFrom(readBlobMethod(mockBlob));

      // Simulate FileReader loadend event
      setTimeout(() => {
        if (mockFileReader.onloadend) {
          mockFileReader.onloadend({} as any);
        }
      }, 0);

      const result = await promise;

      expect(result).toBe(mockBase64);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockBlob);
      expect(mockFileReader.addEventListener).toHaveBeenCalledWith(
        'error',
        expect.any(Function)
      );
    });

    it('should handle FileReader errors', async () => {
      const mockBlob = new Blob(['test data'], { type: 'text/plain' });
      const mockError = new Error('FileReader error');

      const mockFileReader = {
        readAsDataURL: jest.fn(),
        result: undefined,
        onloadend: undefined as any,
        addEventListener: jest.fn(),
      };
      jest
        .spyOn(window, 'FileReader')
        .mockImplementation(() => mockFileReader as any);

      const readBlobMethod = (service as any).readBlob.bind(service);
      const promise = firstValueFrom(readBlobMethod(mockBlob));

      // Simulate FileReader error event
      setTimeout(() => {
        const errorCallback = mockFileReader.addEventListener.mock.calls.find(
          (call) => call[0] === 'error'
        )?.[1];
        if (errorCallback) {
          errorCallback(mockError);
        }
      }, 0);

      await expect(promise).rejects.toBe(mockError);
    });

    it('should handle empty result', async () => {
      const mockBlob = new Blob([''], { type: 'text/plain' });

      const mockFileReader = {
        readAsDataURL: jest.fn(),
        result: undefined,
        onloadend: undefined as any,
        addEventListener: jest.fn(),
      };
      jest
        .spyOn(window, 'FileReader')
        .mockImplementation(() => mockFileReader as any);

      const readBlobMethod = (service as any).readBlob.bind(service);
      const promise = firstValueFrom(readBlobMethod(mockBlob));

      // Simulate FileReader loadend event with null result
      setTimeout(() => {
        if (mockFileReader.onloadend) {
          mockFileReader.onloadend({} as any);
        }
      }, 0);

      const result = await promise;

      expect(result).toBe('');
    });
  });

  describe('16-bit PNG handling', () => {
    // Mock 16-bit PNG header data (simplified for testing)
    const create16BitPngBase64 = (): string => {
      // PNG signature + IHDR chunk with 16-bit depth
      const bytes = new Uint8Array([
        0x89,
        0x50,
        0x4e,
        0x47,
        0x0d,
        0x0a,
        0x1a,
        0x0a, // PNG signature
        0x00,
        0x00,
        0x00,
        0x0d, // IHDR length
        0x49,
        0x48,
        0x44,
        0x52, // IHDR
        0x00,
        0x00,
        0x00,
        0x10, // width (16)
        0x00,
        0x00,
        0x00,
        0x10, // height (16)
        0x10, // bit depth (16)
        0x02, // color type
        0x00,
        0x00,
        0x00, // compression, filter, interlace
      ]);

      const binaryString = Array.from(bytes, (byte) =>
        String.fromCodePoint(byte)
      ).join('');

      return `data:image/png;base64,${btoa(binaryString)}`;
    };

    const create8BitPngBase64 = (): string => {
      // PNG signature + IHDR chunk with 8-bit depth
      const bytes = new Uint8Array([
        0x89,
        0x50,
        0x4e,
        0x47,
        0x0d,
        0x0a,
        0x1a,
        0x0a, // PNG signature
        0x00,
        0x00,
        0x00,
        0x0d, // IHDR length
        0x49,
        0x48,
        0x44,
        0x52, // IHDR
        0x00,
        0x00,
        0x00,
        0x10, // width (16)
        0x00,
        0x00,
        0x00,
        0x10, // height (16)
        0x08, // bit depth (8)
        0x02, // color type
        0x00,
        0x00,
        0x00, // compression, filter, interlace
      ]);

      const binaryString = Array.from(bytes, (byte) =>
        String.fromCodePoint(byte)
      ).join('');

      return `data:image/png;base64,${btoa(binaryString)}`;
    };

    describe('is16BitPng (private method)', () => {
      it('should detect 16-bit PNG', () => {
        const mock16BitPng = create16BitPngBase64();
        const is16BitPngMethod = (service as any).is16BitPng.bind(service);

        const result = is16BitPngMethod(mock16BitPng);

        expect(result).toBe(true);
      });

      it('should detect 8-bit PNG as not 16-bit', () => {
        const mock8BitPng = create8BitPngBase64();
        const is16BitPngMethod = (service as any).is16BitPng.bind(service);

        const result = is16BitPngMethod(mock8BitPng);

        expect(result).toBe(false);
      });

      it('should return false for non-PNG images', () => {
        const jpegBase64 = 'data:image/jpeg;base64,somedata';
        const is16BitPngMethod = (service as any).is16BitPng.bind(service);

        const result = is16BitPngMethod(jpegBase64);

        expect(result).toBe(false);
      });

      it('should handle malformed data gracefully', () => {
        const malformedData = 'data:image/png;base64,invaliddata';
        const is16BitPngMethod = (service as any).is16BitPng.bind(service);

        const result = is16BitPngMethod(malformedData);

        expect(result).toBe(false);
      });
    });

    describe('convertTo8BitPng (private method)', () => {
      it('should convert 16-bit PNG to 8-bit using canvas', async () => {
        const mock16BitPng = create16BitPngBase64();
        const mockConvertedPng = create8BitPngBase64();

        // Mock canvas and image
        const mockCanvas = {
          width: 0,
          height: 0,
          toDataURL: jest.fn().mockReturnValue(mockConvertedPng),
          getContext: jest.fn().mockReturnValue({
            drawImage: jest.fn(),
          }),
        };

        const mockImage = {
          width: 16,
          height: 16,
          src: '',
          addEventListener: jest.fn(),
        };

        jest
          .spyOn(document, 'createElement')
          .mockReturnValue(mockCanvas as any);
        jest.spyOn(window, 'Image').mockImplementation(() => mockImage as any);

        const convertTo8BitPngMethod = (service as any).convertTo8BitPng.bind(
          service
        );
        const promise = convertTo8BitPngMethod(mock16BitPng);

        // Simulate image load
        setTimeout(() => {
          const loadCallback = mockImage.addEventListener.mock.calls.find(
            (call) => call[0] === 'load'
          )?.[1];
          if (loadCallback) {
            loadCallback();
          }
        }, 0);

        const result = await promise;

        expect(result).toBe(mockConvertedPng);
        expect(mockCanvas.width).toBe(16);
        expect(mockCanvas.height).toBe(16);
        expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
      });

      it('should handle canvas context creation failure', async () => {
        const mock16BitPng = create16BitPngBase64();

        const mockCanvas = {
          // eslint-disable-next-line unicorn/no-null
          getContext: jest.fn().mockReturnValue(null),
        };

        const mockImage = {
          addEventListener: jest.fn(),
        };

        jest
          .spyOn(document, 'createElement')
          .mockReturnValue(mockCanvas as any);
        jest.spyOn(window, 'Image').mockImplementation(() => mockImage as any);

        const convertTo8BitPngMethod = (service as any).convertTo8BitPng.bind(
          service
        );
        const promise = convertTo8BitPngMethod(mock16BitPng);

        // Simulate image load
        setTimeout(() => {
          const loadCallback = mockImage.addEventListener.mock.calls.find(
            (call) => call[0] === 'load'
          )?.[1];
          if (loadCallback) {
            loadCallback();
          }
        }, 0);

        await expect(promise).rejects.toThrow('Could not get canvas context');
      });

      it('should handle image load error', async () => {
        const mock16BitPng = create16BitPngBase64();

        const mockImage = {
          addEventListener: jest.fn(),
        };

        jest.spyOn(window, 'Image').mockImplementation(() => mockImage as any);

        const convertTo8BitPngMethod = (service as any).convertTo8BitPng.bind(
          service
        );
        const promise = convertTo8BitPngMethod(mock16BitPng);

        // Simulate image error
        setTimeout(() => {
          const errorCallback = mockImage.addEventListener.mock.calls.find(
            (call) => call[0] === 'error'
          )?.[1];
          if (errorCallback) {
            errorCallback();
          }
        }, 0);

        await expect(promise).rejects.toThrow(
          'Failed to load image for conversion'
        );
      });
    });

    describe('processImageData (private method)', () => {
      it('should process 16-bit PNG and convert to 8-bit', async () => {
        const mock16BitPng = create16BitPngBase64();
        const mockConvertedPng = create8BitPngBase64();

        // Mock the conversion method
        const convertTo8BitPngSpy = jest
          .spyOn(service as any, 'convertTo8BitPng')
          .mockResolvedValue(mockConvertedPng);

        const processImageDataMethod = (service as any).processImageData.bind(
          service
        );
        const promise = firstValueFrom(processImageDataMethod(mock16BitPng));

        const result = await promise;

        expect(result).toBe(mockConvertedPng);
        expect(convertTo8BitPngSpy).toHaveBeenCalledWith(mock16BitPng);

        convertTo8BitPngSpy.mockRestore();
      });

      it('should pass through 8-bit PNG without conversion', async () => {
        const mock8BitPng = create8BitPngBase64();

        const convertTo8BitPngSpy = jest
          .spyOn(service as any, 'convertTo8BitPng')
          .mockResolvedValue('should not be called');

        const processImageDataMethod = (service as any).processImageData.bind(
          service
        );
        const promise = firstValueFrom(processImageDataMethod(mock8BitPng));

        const result = await promise;

        expect(result).toBe(mock8BitPng);
        expect(convertTo8BitPngSpy).not.toHaveBeenCalled();

        convertTo8BitPngSpy.mockRestore();
      });

      it('should pass through non-PNG images without processing', async () => {
        const jpegBase64 = 'data:image/jpeg;base64,somedata';

        const convertTo8BitPngSpy = jest
          .spyOn(service as any, 'convertTo8BitPng')
          .mockResolvedValue('should not be called');

        const processImageDataMethod = (service as any).processImageData.bind(
          service
        );
        const promise = firstValueFrom(processImageDataMethod(jpegBase64));

        const result = await promise;

        expect(result).toBe(jpegBase64);
        expect(convertTo8BitPngSpy).not.toHaveBeenCalled();

        convertTo8BitPngSpy.mockRestore();
      });

      it('should fallback to original data if conversion fails', async () => {
        const mock16BitPng = create16BitPngBase64();

        const convertTo8BitPngSpy = jest
          .spyOn(service as any, 'convertTo8BitPng')
          .mockRejectedValue(new Error('Conversion failed'));

        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

        const processImageDataMethod = (service as any).processImageData.bind(
          service
        );
        const promise = firstValueFrom(processImageDataMethod(mock16BitPng));

        const result = await promise;

        expect(result).toBe(mock16BitPng);
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Failed to convert 16-bit PNG to 8-bit, using original:',
          expect.any(Error)
        );

        convertTo8BitPngSpy.mockRestore();
        consoleWarnSpy.mockRestore();
      });
    });
  });
});
