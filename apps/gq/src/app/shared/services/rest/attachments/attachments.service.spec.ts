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

import { of } from 'rxjs';

import { ApiVersion, QuotationAttachment } from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import * as saveAsMock from 'file-saver';

import { QuotationPaths } from '../quotation/models/quotation-paths.enum';
import { AttachmentsService } from './attachments.service';
import { Attachment } from './models/attachment.interface';
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));
describe('Service: Attachments', () => {
  let service: AttachmentsService;
  let spectator: SpectatorService<AttachmentsService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: AttachmentsService,
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

  describe('uploadQuotationFiles', () => {
    test('should call uploadFiles', () => {
      const files = [{ name: 'file-1' } as File, { name: 'file-2' } as File];
      const gqId = 4600;
      const returnValue: QuotationAttachment[] = [
        {
          fileName: 'filename',
          folderName: 'folderNAme',
          gqId,
          sapId: 'sapId',
          uploadedAt: '2020-01-01',
          uploadedBy: 'user',
        },
      ];
      service['uploadFiles'] = jest.fn().mockReturnValue(of(returnValue));
      service
        .uploadQuotationFiles(files, gqId)
        .subscribe((res) => expect(res).toEqual(returnValue));
    });
  });
  describe('uploadRfqSqvCheckApproval', () => {
    test('should call uploadFiles', () => {
      const files = [{ name: 'file-1' } as File, { name: 'file-2' } as File];
      const gqPositionId = '4600';
      const returnValue: Attachment[] = [
        {
          gqPositionId: '134',
          fileName: 'filename',
          gqId: 4600,
          uploadedAt: '2020-01-01',
          uploadedBy: 'user',
        },
      ];
      service['uploadFiles'] = jest.fn().mockReturnValue(of(returnValue));
      service
        .uploadRfqSqvCheckApproval(files, gqPositionId)
        .subscribe((res) => expect(res).toEqual(returnValue));
    });
  });
  describe('getAllAttachments', () => {
    test('should call GET', () => {
      const gqId = 4600;
      service
        .getAllAttachments(gqId)
        .subscribe((res) => expect(res).toEqual([]));
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}/${QuotationPaths.PATH_ATTACHMENTS}`
      );
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('downloadQuotationAttachment', () => {
    test('should call downloadAttachments', () => {
      const attachment: QuotationAttachment = {
        gqId: 4600,
        sapId: '456',
        folderName: 'folder',
        uploadedAt: '2020-01-01',
        uploadedBy: 'user',
        fileName: 'test.jpg',
      };
      service['downloadAttachments'] = jest
        .fn()
        .mockReturnValue(of('test.jpg'));
      service.downloadQuotationAttachment(attachment).subscribe((result) => {
        expect(result).toEqual('test.jpg');
      });
    });
  });

  describe('downloadRfqSqvCheckApprovalAttachments', () => {
    test('should call downloadAttachments', () => {
      const gqPositionId = '4600';
      service['downloadAttachments'] = jest
        .fn()
        .mockReturnValue(of('test.jpg'));
      service
        .downloadRfqSqvCheckApprovalAttachments(gqPositionId)
        .subscribe((result) => {
          expect(result).toEqual('test.jpg');
        });
    });
  });

  describe('delete attachment', () => {
    test('should call delete attachment', () => {
      const attachment: QuotationAttachment = {
        gqId: 4600,
        sapId: '456',
        folderName: 'folder',
        uploadedAt: '2020-01-01',
        uploadedBy: 'user',
        fileName: 'test.jpg',
      };

      service.deleteAttachment(attachment).subscribe((response) => {
        expect(response).toEqual([]);
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${attachment.gqId}/${QuotationPaths.PATH_ATTACHMENTS}?filename=${attachment.fileName}`
      );

      expect(req.request.method).toBe('DELETE');
      req.flush([]);
    });
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
        get: jest.fn().mockReturnValue('attachment; filename="test-file.txt"'),
      } as unknown as HttpHeaders;

      const fileName = service['getFileNameFromHeaders'](headers);

      expect(fileName).toBe('test-file.txt');
    });
  });
});
