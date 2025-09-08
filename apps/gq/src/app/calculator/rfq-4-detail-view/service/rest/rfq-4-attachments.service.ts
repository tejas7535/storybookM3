import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, OperatorFunction } from 'rxjs';

import { ApiVersion } from '@gq/shared/models';
import { FileService } from '@gq/shared/services/rest/file/file.service';
import { Rfq4PathsEnum } from '@gq/shared/services/rest/rfq4/models/rfq-4-paths.enum';

import { CalculatorAttachmentsResponse } from '../../models/calculator-attachments-response.interface';
import {
  FileAccessUpdate,
  RfqCalculatorAttachment,
} from '../../models/rfq-calculator-attachments.interface';
import { DetailViewPaths } from './rfq-4-detail-view-paths.enum';

export function mapToAttachments(): OperatorFunction<
  CalculatorAttachmentsResponse,
  RfqCalculatorAttachment[]
> {
  return map((response: CalculatorAttachmentsResponse) => response.attachments);
}

@Injectable({
  providedIn: 'root',
})
export class Rfq4AttachmentsService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly fileService: FileService = inject(FileService);

  uploadCalculatorAttachments(
    files: File[],
    rfqId: number
  ): Observable<RfqCalculatorAttachment[]> {
    const url = `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${rfqId}/${DetailViewPaths.PATH_RFQ4_ATTACHMENTS}`;

    return this.fileService
      .uploadFiles<CalculatorAttachmentsResponse>(files, url)
      .pipe(mapToAttachments());
  }

  downloadCalculatorAttachment(
    attachment: RfqCalculatorAttachment
  ): Observable<string> {
    const params = new HttpParams().set('filename', attachment.fileName);
    const url = `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${attachment.rfqId}/${DetailViewPaths.PATH_RFQ4_ATTACHMENTS}/download`;

    return this.fileService
      .downloadAttachments(url, params)
      .pipe(map((response) => this.fileService.saveDownloadFile(response)));
  }

  getCalculatorAttachments(
    rfqId: number
  ): Observable<RfqCalculatorAttachment[]> {
    return this.http
      .get<CalculatorAttachmentsResponse>(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${rfqId}/${DetailViewPaths.PATH_RFQ4_ATTACHMENTS}`
      )
      .pipe(mapToAttachments());
  }
  deleteCalculatorAttachment(
    attachment: RfqCalculatorAttachment
  ): Observable<RfqCalculatorAttachment[]> {
    const params = new HttpParams().set('filename', attachment.fileName);

    return this.http
      .delete<CalculatorAttachmentsResponse>(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${attachment.rfqId}/${DetailViewPaths.PATH_RFQ4_ATTACHMENTS}`,
        { params }
      )
      .pipe(mapToAttachments());
  }

  updateCalculatorAttachmentsAccess(
    rfqId: number,
    filesToUpdate: FileAccessUpdate[]
  ) {
    return this.http
      .patch<CalculatorAttachmentsResponse>(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${rfqId}/${DetailViewPaths.PATH_RFQ4_ATTACHMENTS}`,
        filesToUpdate
      )
      .pipe(mapToAttachments());
  }
}
