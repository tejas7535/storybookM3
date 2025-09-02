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
});
