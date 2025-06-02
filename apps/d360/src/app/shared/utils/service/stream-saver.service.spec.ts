import { HttpResponse } from '@angular/common/http';

import { Stub } from '../../test/stub.class';
import { HttpError } from '../http-client';
import { StreamSaverService } from './stream-saver.service';

// Mock streamSaver module
jest.mock('streamsaver', () => ({
  __esModule: true,
  ...jest.requireActual('streamsaver'),
  default: {
    mitm: '',
    createWriteStream: jest.fn(),
    WritableStream: jest.fn(),
  },
}));

describe('StreamSaverService', () => {
  let service: StreamSaverService;
  let streamSaver: any;

  beforeEach(() => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, unicorn/prefer-module
    streamSaver = require('streamsaver').default;

    service = Stub.get<StreamSaverService>({
      component: StreamSaverService,
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('should call initializeStreamSaver', () => {
      const spy = jest.spyOn(service as any, 'initializeStreamSaver');
      service.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('streamResponseToFile', () => {
    it('should throw HttpError if response is not ok', async () => {
      const mockResponse = new HttpResponse({
        body: new Blob(['error']),
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(
        service.streamResponseToFile('test.txt', mockResponse)
      ).rejects.toThrow(HttpError);
    });

    it('should not stream when response body is empty', async () => {
      const mockResponse = new HttpResponse({
        body: null,
        status: 200,
        statusText: 'OK',
      });
      Object.defineProperty(mockResponse, 'ok', { value: true });

      const mockFileStream = { getWriter: jest.fn() };
      streamSaver.createWriteStream.mockReturnValue(mockFileStream);

      await service.streamResponseToFile('test.txt', mockResponse);

      expect(mockFileStream.getWriter).not.toHaveBeenCalled();
    });
  });
});
