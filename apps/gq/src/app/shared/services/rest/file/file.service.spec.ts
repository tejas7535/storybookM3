import {
  HttpHeaders,
  HttpParams,
  HttpResponse,
  provideHttpClient,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import * as saveAsMock from 'file-saver';

import { FileService } from './file.service';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));
describe('FileService', () => {
  let service: FileService;
  let spectator: SpectatorService<FileService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: FileService,
    imports: [],
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('uploadFiles', () => {
    test('should call POST', () => {
      const files = [{ name: 'file-1' } as File, { name: 'file-2' } as File];
      const url = 'test';
      service['uploadFiles'](files, url).subscribe((res) =>
        expect(res).toEqual([])
      );
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush([]);
    });
  });

  describe('downloadAttachments', () => {
    test('should call the GET method with params', () => {
      const url = 'test';
      const params = new HttpParams().set('filename', 'test.jpg');
      service['downloadAttachments'](url, params).subscribe((result) => {
        expect(result instanceof Blob).toBeTruthy();
      });

      const req = httpMock.expectOne(`${url}?filename=test.jpg`);

      const blob = new Blob(['file content'], {
        type: 'application/octet-stream',
      });
      expect(req.request.method).toBe('GET');
      req.flush(blob);
    });

    test('should call the GET method without params', () => {
      const url = 'test';
      service['downloadAttachments'](url).subscribe((result) => {
        expect(result instanceof Blob).toBeTruthy();
      });

      const req = httpMock.expectOne(url);

      const blob = new Blob(['file content'], {
        type: 'application/octet-stream',
      });
      expect(req.request.method).toBe('GET');
      req.flush(blob);
    });
  });

  describe('saveDownloadFile', () => {
    test('should extract the filename from headers and call saveAs', () => {
      global.URL.createObjectURL = jest.fn();
      service['getFileNameFromHeaders'] = jest
        .fn()
        .mockReturnValue('test-file.txt');
      const response = {
        headers: {
          get: jest
            .fn()
            .mockReturnValue('attachment; filename="test-file.txt"'),
        },
        body: new Blob(['file content'], { type: 'text/plain' }),
      } as unknown as HttpResponse<Blob>;

      const fileName = service['saveDownloadFile'](response);

      expect(service['getFileNameFromHeaders']).toHaveBeenCalledWith(
        response.headers
      );
      expect(saveAsMock.saveAs).toHaveBeenCalled();
      expect(fileName).toBe('test-file.txt');
    });
  });

  describe('getFileNameFromHeaders', () => {
    test('should extract the filename from headers', () => {
      const headers = {
        get: jest
          .fn()
          .mockReturnValue('attachment; filename*=UTF-8"test-file.txt"'),
      } as unknown as HttpHeaders;

      const fileName = service['getFileNameFromHeaders'](headers);

      expect(fileName).toBe('test-file.txt');
    });
  });
});
