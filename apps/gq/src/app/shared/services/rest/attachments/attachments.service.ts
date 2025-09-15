import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ApiVersion, QuotationAttachment } from '@gq/shared/models';

import { FileService } from '../file/file.service';
import { QuotationPaths } from '../quotation/models/quotation-paths.enum';
import { Attachment } from './models/attachment.interface';
import { GetRfqApprovalAttachmentsResponse } from './models/get-rfq-approval-attachments-response.interface';
import { PositionAttachment } from './models/position-attachment.interface';
import { RfqSqvCheckPaths } from './models/rfq-sqv-check-paths.enum';
import { UploadRfqSqvCheckApprovalResponse } from './models/upload-rfq-sqv-approval-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AttachmentsService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly fileService: FileService = inject(FileService);

  uploadQuotationFiles(
    files: File[],
    gqId: number
  ): Observable<QuotationAttachment[]> {
    const url = `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}/${QuotationPaths.PATH_ATTACHMENTS}`;

    return this.fileService.uploadFiles<QuotationAttachment[]>(files, url);
  }

  uploadRfqSqvCheckApproval(
    files: File[],
    gqPositionId: string
  ): Observable<UploadRfqSqvCheckApprovalResponse> {
    const url = `${ApiVersion.V1}/${RfqSqvCheckPaths.RFQ4_PATH}/${gqPositionId}/${RfqSqvCheckPaths.APPROVAL_PATH}/${RfqSqvCheckPaths.ATTACHMENTS_PATH}`;

    return this.fileService.uploadFiles<UploadRfqSqvCheckApprovalResponse>(
      files,
      url
    );
  }

  getAllAttachments(gqId: number): Observable<QuotationAttachment[]> {
    return this.http.get<QuotationAttachment[]>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}/${QuotationPaths.PATH_ATTACHMENTS}`
    );
  }

  getRfqSqvCheckApprovalAttachments(
    gqPositionId: string
  ): Observable<PositionAttachment[]> {
    return this.http
      .get<GetRfqApprovalAttachmentsResponse>(
        `${ApiVersion.V1}/${RfqSqvCheckPaths.RFQ4_PATH}/${gqPositionId}/${RfqSqvCheckPaths.APPROVAL_PATH}/${RfqSqvCheckPaths.ATTACHMENTS_PATH}`
      )
      .pipe(map((response) => response.attachments));
  }

  downloadQuotationAttachment(
    attachment: QuotationAttachment
  ): Observable<string> {
    const params = new HttpParams().set('filename', attachment.fileName);
    const url = `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${attachment.gqId}/${QuotationPaths.PATH_ATTACHMENTS}/${QuotationPaths.PATH_ATTACHMENT_DOWNLOAD}`;

    return this.fileService
      .downloadAttachments(url, params)
      .pipe(map((response) => this.fileService.saveDownloadFile(response)));
  }

  downloadRfqSqvCheckApprovalAttachments(
    gqPositionId: string,
    file: Attachment = null
  ): Observable<string> {
    const params = file
      ? new HttpParams().set('filename', file.fileName)
      : null;
    const url = `${ApiVersion.V1}/${RfqSqvCheckPaths.RFQ4_PATH}/${gqPositionId}/${RfqSqvCheckPaths.APPROVAL_PATH}/${RfqSqvCheckPaths.ATTACHMENTS_PATH}/${RfqSqvCheckPaths.DOWNLOAD_PATH}`;

    return this.fileService
      .downloadAttachments(url, params)
      .pipe(map((response) => this.fileService.saveDownloadFile(response)));
  }

  deleteAttachment(
    attachment: QuotationAttachment
  ): Observable<QuotationAttachment[]> {
    const params = new HttpParams().set('filename', attachment.fileName);

    return this.http.delete<QuotationAttachment[]>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${attachment.gqId}/${QuotationPaths.PATH_ATTACHMENTS}`,
      { params }
    );
  }
}
