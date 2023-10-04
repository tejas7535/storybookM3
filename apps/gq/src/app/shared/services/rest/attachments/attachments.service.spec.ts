import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ApiVersion, QuotationAttachment } from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { QuotationPaths } from '../quotation/models/quotation-paths.enum';
import { AttachmentsService } from './attachments.service';

describe('Service: Attachments', () => {
  let service: AttachmentsService;
  let spectator: SpectatorService<AttachmentsService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: AttachmentsService,
    imports: [HttpClientTestingModule],
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
      const gqId = 4600;
      service
        .uploadFiles(files, gqId)
        .subscribe((res) => expect(res).toEqual([]));
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}/${QuotationPaths.PATH_ATTACHMENTS}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(files);
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

  describe('downloadAttachment', () => {
    test('should call downloadAttachment', () => {
      const attachment: QuotationAttachment = {
        gqId: 4600,
        sapId: '456',
        folderName: 'folder',
        uploadedAt: '2020-01-01',
        uploadedBy: 'user',
        fileName: 'test.jpg',
      };

      service.downloadAttachment(attachment).subscribe((result) => {
        expect(result instanceof Blob).toBeTruthy();
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${attachment.gqId}/${QuotationPaths.PATH_ATTACHMENTS}/${QuotationPaths.PATH_ATTACHMENT_DOWNLOAD}?filename=${attachment.fileName}`
      );

      const blob = new Blob(['file content'], {
        type: 'application/octet-stream',
      });
      expect(req.request.method).toBe('GET');
      req.flush(blob);
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
});
