import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiVersion, QuotationAttachment } from '@gq/shared/models';

import { QuotationPaths } from '../quotation/models/quotation-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class AttachmentsService {
  constructor(private readonly http: HttpClient) {}

  public uploadFiles(
    files: File[],
    gqId: number
  ): Observable<QuotationAttachment[]> {
    const formData: FormData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    return this.http.post<QuotationAttachment[]>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}/${QuotationPaths.PATH_ATTACHMENTS}`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );
  }

  public getAllAttachments(gqId: number): Observable<QuotationAttachment[]> {
    return this.http.get<QuotationAttachment[]>(
      `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${gqId}/${QuotationPaths.PATH_ATTACHMENTS}`
    );
  }

  public downloadAttachment(attachment: QuotationAttachment): Observable<Blob> {
    const params = new HttpParams().set('filename', attachment.fileName);

    const headers = new HttpHeaders({
      responseType: 'blob',
      Accept: '*/*',
      observe: 'response',
    });

    const url = `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/${attachment.gqId}/${QuotationPaths.PATH_ATTACHMENTS}/${QuotationPaths.PATH_ATTACHMENT_DOWNLOAD}`;

    return this.http.get(url, {
      params,
      headers,
      responseType: 'blob',
    });
  }
}
