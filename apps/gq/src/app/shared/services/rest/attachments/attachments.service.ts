import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ApiVersion, QuotationAttachment } from '@gq/shared/models';
import { saveAs } from 'file-saver';

import { QuotationPaths } from '../quotation/models/quotation-paths.enum';
import { RfqSqvCheckPaths } from './models/rfq-sqv-check-paths.enum';
import { UploadRfqSqvCheckApprovalResponse } from './models/upload-rfq-sqv-approval-response.interface';

// Define a generic type for response model
type UploadResponse<T> = T;
@Injectable({
  providedIn: 'root',
})
export class AttachmentsService {
  private readonly http: HttpClient = inject(HttpClient);

  uploadQuotationFiles(
    files: File[],
    gqId: number
  ): Observable<QuotationAttachment[]> {
    const url = `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}/${QuotationPaths.PATH_ATTACHMENTS}`;

    return this.uploadFiles<QuotationAttachment[]>(files, url);
  }

  uploadRfqSqvCheckApproval(
    files: File[],
    gqPositionId: string
  ): Observable<UploadRfqSqvCheckApprovalResponse> {
    const url = `${ApiVersion.V1}/${RfqSqvCheckPaths.RFQ4_PATH}/${gqPositionId}/${RfqSqvCheckPaths.UPLOAD_APPROVAL_PATH}`;

    return this.uploadFiles<UploadRfqSqvCheckApprovalResponse>(files, url);
  }

  getAllAttachments(gqId: number): Observable<QuotationAttachment[]> {
    return this.http.get<QuotationAttachment[]>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}/${QuotationPaths.PATH_ATTACHMENTS}`
    );
  }

  downloadQuotationAttachment(
    attachment: QuotationAttachment
  ): Observable<string> {
    const params = new HttpParams().set('filename', attachment.fileName);
    const url = `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${attachment.gqId}/${QuotationPaths.PATH_ATTACHMENTS}/${QuotationPaths.PATH_ATTACHMENT_DOWNLOAD}`;

    return this.downloadAttachments(url, params).pipe(
      map((response) => this.saveDownloadFile(response))
    );
  }

  downloadRfqSqvCheckApprovalAttachments(
    gqPositionId: string
  ): Observable<string> {
    const url = `${ApiVersion.V1}/${RfqSqvCheckPaths.RFQ4_PATH}/${gqPositionId}/${RfqSqvCheckPaths.DOWNLOAD_APPROVAL_PATH}`;

    return this.downloadAttachments(url).pipe(
      map((response) => this.saveDownloadFile(response))
    );
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

  private uploadFiles<T>(
    files: File[],
    url: string
  ): Observable<UploadResponse<T>> {
    const formData: FormData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    return this.http.post<UploadResponse<T>>(url, formData, {
      reportProgress: true,
      responseType: 'json',
    });
  }

  private downloadAttachments(
    url: string,
    params?: HttpParams
  ): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders({
      responseType: 'blob',
      Accept: '*/*',
      observe: 'response',
    });

    return this.http.get(url, {
      params,
      headers,
      responseType: 'blob',
      observe: 'response',
    });
  }

  private saveDownloadFile(response: HttpResponse<Blob>): string {
    const fileName = this.getFileNameFromHeaders(response.headers);
    saveAs(response.body, fileName);

    return fileName;
  }

  private getFileNameFromHeaders(headers: HttpHeaders): string {
    return headers
      .get('content-disposition')
      .split('filename=')[1]
      .replaceAll('"', '');
  }
}
