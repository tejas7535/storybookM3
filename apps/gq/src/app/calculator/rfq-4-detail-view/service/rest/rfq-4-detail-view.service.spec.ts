import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { of } from 'rxjs';

import { ApiVersion } from '@gq/shared/models';
import { FileService } from '@gq/shared/services/rest/file/file.service';
import { Rfq4PathsEnum } from '@gq/shared/services/rest/rfq4/models/rfq-4-paths.enum';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import {
  RFQ_CALCULATOR_ATTACHMENTS_MOCK,
  RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK,
} from '../../../../../testing/mocks/models/calculator/rfq-4-detail-view/rfq-4-detail-view-data.mock';
import { AccessibleByEnum } from '../../models/accessibly-by.enum';
import { CalculatorAttachmentsResponse } from '../../models/calculator-attachments-response.interface';
import { RfqCalculatorAttachment } from '../../models/rfq-calculator-attachments.interface';
import { Rfq4DetailViewService } from './rfq-4-detail-view.service';
import { DetailViewPaths } from './rfq-4-detail-view-paths.enum';

describe('Rfq4DetailViewService', () => {
  let service: Rfq4DetailViewService;
  let spectator: SpectatorService<Rfq4DetailViewService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: Rfq4DetailViewService,
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      mockProvider(FileService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getRfq4DetailViewData', () => {
    test('should call get with correct URL', () => {
      service.getRfq4DetailViewData('123').subscribe();

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/123/${DetailViewPaths.PATH_RFQ_4_DETAIL_VIEW}`
      );
      expect(req.request.method).toBe('GET');
    });
  });

  describe('assignRfq', () => {
    test('should call get with correct URL', () => {
      service.assignRfq(123).subscribe();
      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/123/${DetailViewPaths.PATH_CLAIM_CALCULATION}`
      );

      expect(req.request.method).toBe('POST');
    });
  });

  describe('saveRfq4CalculationData', () => {
    test('should call post with correct url and request body', () => {
      service
        .saveRfq4CalculationData(123, RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK)
        .subscribe();

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/123/${DetailViewPaths.PATH_RFQ4_RECALCULATE_DETAIL_VIEW_SAVE}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK);
    });
  });

  describe('confirmRfq4CalculationData', () => {
    test('should call post with correct url and request body', () => {
      service
        .confirmRfq4CalculationData(123, RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK)
        .subscribe();

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/123/${DetailViewPaths.PATH_RFQ4_RECALCULATE_DETAIL_VIEW_CONFIRM}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(RFQ_DETAIL_VIEW_CALCULATION_DATA_MOCK);
    });
  });

  describe('uploadCalculatorAttachments', () => {
    test('should call post with correct url and files', () => {
      const files: File[] = [new File([''], 'test.txt')];
      const returnValue: CalculatorAttachmentsResponse = {
        attachments: [
          {
            rfqId: 134,
            fileName: 'filename',
            gqId: 4600,
            uploadedAt: '2020-01-01',
            uploadedBy: 'user',
            accessibleBy: AccessibleByEnum.CALCULATOR,
          },
        ],
      };

      service['fileService'].uploadFiles = jest
        .fn()
        .mockReturnValue(of(returnValue));
      service.uploadCalculatorAttachments(files, 123).subscribe();

      expect(service['fileService'].uploadFiles).toHaveBeenCalledWith(
        files,
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/123/${DetailViewPaths.PATH_RFQ4_ATTACHMENTS}`
      );
    });
  });

  describe('getCalculatorAttachments', () => {
    test('should call get with correct URL', () => {
      service.getCalculatorAttachments(123).subscribe();

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/123/${DetailViewPaths.PATH_RFQ4_ATTACHMENTS}`
      );
      expect(req.request.method).toBe('GET');
    });
  });

  describe('deleteCalculatorAttachment', () => {
    test('should call delete with correct URL and params', () => {
      const attachment = {
        fileName: 'test.txt',
        gqId: 123,
        rfqId: 456,
      } as RfqCalculatorAttachment;

      service.deleteCalculatorAttachment(attachment).subscribe();

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/456/${DetailViewPaths.PATH_RFQ4_ATTACHMENTS}?filename=test.txt`
      );
      expect(req.request.method).toBe('DELETE');
      expect(req.request.params.get('filename')).toBe(attachment.fileName);
    });
  });
  describe('downloadCalculatorAttachment', () => {
    test('should call downloadAttachments with correct URL and params', () => {
      const attachment = RFQ_CALCULATOR_ATTACHMENTS_MOCK[0];

      service['fileService'].downloadAttachments = jest
        .fn()
        .mockReturnValue(of('test.jpg'));

      service.downloadCalculatorAttachment(attachment).subscribe((result) => {
        expect(result).toEqual('test.jpg');
      });
    });
  });
});
