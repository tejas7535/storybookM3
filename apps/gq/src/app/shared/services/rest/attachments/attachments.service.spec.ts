import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { of } from 'rxjs';

import { ApiVersion, QuotationAttachment } from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { QuotationPaths } from '../quotation/models/quotation-paths.enum';
import { AttachmentsService } from './attachments.service';
import { PositionAttachment } from './models/position-attachment.interface';

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
      service['fileService'].uploadFiles = jest
        .fn()
        .mockReturnValue(of(returnValue));
      service
        .uploadQuotationFiles(files, gqId)
        .subscribe((res) => expect(res).toEqual(returnValue));
    });
  });
  describe('uploadRfqSqvCheckApproval', () => {
    test('should call uploadFiles', () => {
      const files = [{ name: 'file-1' } as File, { name: 'file-2' } as File];
      const gqPositionId = '4600';
      const returnValue: PositionAttachment[] = [
        {
          gqPositionId: '134',
          fileName: 'filename',
          gqId: 4600,
          uploadedAt: '2020-01-01',
          uploadedBy: 'user',
        },
      ];
      service['fileService'].uploadFiles = jest
        .fn()
        .mockReturnValue(of(returnValue));
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
      service['fileService'].downloadAttachments = jest
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
      service['fileService'].downloadAttachments = jest
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
});
