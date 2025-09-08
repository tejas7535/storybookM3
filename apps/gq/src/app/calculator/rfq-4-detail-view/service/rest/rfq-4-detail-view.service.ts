import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiVersion } from '@gq/shared/models';
import { Rfq4PathsEnum } from '@gq/shared/services/rest/rfq4/models/rfq-4-paths.enum';

import {
  CalculatorRfq4ProcessData,
  ConfirmRfqResponse,
  RfqDetailViewCalculationData,
  RfqDetailViewData,
} from '../../models/rfq-4-detail-view-data.interface';
import { DetailViewPaths } from './rfq-4-detail-view-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class Rfq4DetailViewService {
  private readonly http: HttpClient = inject(HttpClient);

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
}
