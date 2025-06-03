import { HttpResponse } from '@angular/common/http';

import streamSaver from 'streamsaver';

import { HttpError } from '../http-client';
import { StreamSaverService } from './stream-saver.service';

jest.mock('streamsaver', () => ({
  __esModule: true,
  default: {
    createWriteStream: jest.fn(),
    mitm: '',
    WritableStream: undefined as any,
  },
}));

describe('StreamSaverService', () => {
  let service: StreamSaverService;

  beforeEach(() => {
    jest.resetModules();
    service = new StreamSaverService();
  });

  describe('init', () => {
    it('should call initializeStreamSaver', async () => {
      const spy = jest
        .spyOn<any, any>(service as any, 'initializeStreamSaver')
        .mockResolvedValue(undefined as any);
      await service.init();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('initializeStreamSaver', () => {
    it('should set mitm and not polyfill if WritableStream exists', async () => {
      (global as any).window = { WritableStream: () => {} };
      await (service as any).initializeStreamSaver();
      expect(streamSaver.mitm).toBe('/mitm.html');
    });

    it('should polyfill WritableStream if not present', async () => {
      (global as any).window = {};
      const mockWritableStream = () => {};
      jest.mock(
        'web-streams-polyfill/es5',
        () => ({
          WritableStream: mockWritableStream,
        }),
        { virtual: true }
      );
      await (service as any).initializeStreamSaver();
      expect(streamSaver.mitm).toBe('/mitm.html');
    });
  });

  describe('streamResponseToFile', () => {
    it('should throw HttpError if response is not ok', async () => {
      const response = new HttpResponse({
        body: 'err',
        status: 400,
        statusText: 'Bad Request',
      }) as any;
      response.ok = false;
      await expect(
        service.streamResponseToFile('file.txt', response)
      ).rejects.toBeInstanceOf(HttpError);
    });

    it('should write stream to file', async () => {
      const mockWriter = {
        write: jest.fn().mockResolvedValue(undefined as any),
        close: jest.fn(),
      };
      const mockReader = {
        read: jest
          .fn()
          .mockResolvedValueOnce({
            done: false,
            value: new Uint8Array([1, 2, 3]),
          })
          .mockResolvedValueOnce({ done: true }),
      };
      const mockStream = {
        getReader: () => mockReader,
      };
      const mockBlob = {
        stream: () => mockStream,
      };
      jest.spyOn(streamSaver, 'createWriteStream').mockReturnValue({
        getWriter: () => mockWriter,
      } as any);
      const response = new HttpResponse({
        body: mockBlob as any,
        status: 200,
        statusText: 'OK',
      }) as any;
      response.ok = true;
      await service.streamResponseToFile('file.txt', response);
      expect(mockWriter.write).toHaveBeenCalledWith(new Uint8Array([1, 2, 3]));
      expect(mockWriter.close).toHaveBeenCalled();
    });

    it('should do nothing if response body is undefined', async () => {
      jest.spyOn(streamSaver, 'createWriteStream').mockReturnValue({
        getWriter: () => jest.fn(),
      } as any);
      const response = new HttpResponse({
        body: undefined,
        status: 200,
        statusText: 'OK',
      }) as any;
      response.ok = true;
      await expect(
        service.streamResponseToFile('file.txt', response)
      ).resolves.toBeUndefined();
    });
  });
});
