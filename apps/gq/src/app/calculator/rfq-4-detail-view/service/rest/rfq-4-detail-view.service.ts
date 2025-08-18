import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ApiVersion } from '@gq/shared/models';
import { FileService } from '@gq/shared/services/rest/file/file.service';
import { Rfq4PathsEnum } from '@gq/shared/services/rest/rfq4/models/rfq-4-paths.enum';

import { CalculatorAttachmentsResponse } from '../../models/calculator-attachments-response.interface';
import {
  CalculatorRfq4ProcessData,
  ConfirmRfqResponse,
  RfqDetailViewCalculationData,
  RfqDetailViewData,
} from '../../models/rfq-4-detail-view-data.interface';
import { RfqCalculatorAttachment } from '../../models/rfq-calculator-attachments.interface';
import { DetailViewPaths } from './rfq-4-detail-view-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class Rfq4DetailViewService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly fileService: FileService = inject(FileService);

  getRfq4DetailViewData(rfqId: string): Observable<RfqDetailViewData> {
    return this.http.get<RfqDetailViewData>(
      `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/${rfqId}/${DetailViewPaths.PATH_RFQ_4_DETAIL_VIEW}`
    );
  }

  assignRfq(rfqId: number): Observable<CalculatorRfq4ProcessData> {
    return this.http.post<CalculatorRfq4ProcessData>(
      `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/${rfqId}/${DetailViewPaths.PATH_CLAIM_CALCULATION}`,
      {}
    );
  }

  saveRfq4CalculationData(
    rfqId: number,
    requestBody: RfqDetailViewCalculationData
  ): Observable<RfqDetailViewCalculationData> {
    return this.http.post<RfqDetailViewCalculationData>(
      `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/${rfqId}/${DetailViewPaths.PATH_RFQ4_RECALCULATE_DETAIL_VIEW_SAVE}`,
      requestBody
    );
  }

  confirmRfq4CalculationData(
    rfqId: number,
    requestBody: RfqDetailViewCalculationData
  ): Observable<ConfirmRfqResponse> {
    return this.http.post<ConfirmRfqResponse>(
      `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/${rfqId}/${DetailViewPaths.PATH_RFQ4_RECALCULATE_DETAIL_VIEW_CONFIRM}`,
      requestBody
    );
  }

  uploadCalculatorAttachments(
    files: File[],
    rfqId: number
  ): Observable<RfqCalculatorAttachment[]> {
    const url = `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${rfqId}/${DetailViewPaths.PATH_RFQ4_ATTACHMENTS}`;

    return this.fileService
      .uploadFiles<CalculatorAttachmentsResponse>(files, url)
      .pipe(
        map((response: CalculatorAttachmentsResponse) => response.attachments)
      );
  }

  getCalculatorAttachments(
    rfqId: number
  ): Observable<RfqCalculatorAttachment[]> {
    return this.http
      .get<CalculatorAttachmentsResponse>(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${rfqId}/${DetailViewPaths.PATH_RFQ4_ATTACHMENTS}`
      )
      .pipe(
        map((response: CalculatorAttachmentsResponse) => response.attachments)
      );
  }
}
