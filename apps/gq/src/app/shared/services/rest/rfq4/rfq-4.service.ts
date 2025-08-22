import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, take } from 'rxjs';

import { RfqProcessHistory } from '@gq/core/store/rfq-4-process/model/process-history.model';
import { ApiVersion } from '@gq/shared/models';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';

import { FindCalculatorsResponse } from './models/find-calculators-response.interface';
import { Rfq4PathsEnum } from './models/rfq-4-paths.enum';
import { RfqProcessResponse } from './models/rfq-process-response.interface';
import { SupportContactResponse } from './models/support-contacts-response.interface';

@Injectable({
  providedIn: 'root',
})
export class Rfq4Service {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly featureToggleService: FeatureToggleConfigService = inject(
    FeatureToggleConfigService
  );

  findCalculators(gqPositionId: string): Observable<string[]> {
    let url = `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${gqPositionId}/${Rfq4PathsEnum.RFQ4_PATH_FIND_CALCULATORS}`;

    if (this.featureToggleService.isEnabled('findCalculatorsPlantMock')) {
      url += '/GET_CALCULATOR_PLANT';
    } else if (
      this.featureToggleService.isEnabled('findCalculatorsManagerMock')
    ) {
      url += '/GET_CALCULATOR_MANAGER';
    } else if (
      this.featureToggleService.isEnabled('findCalculatorsNotFoundMock')
    ) {
      url += '/CALCULATOR_NOT_FOUND';
    }

    return this.http.post<FindCalculatorsResponse>(url, {}).pipe(
      take(1),
      map(
        (response: FindCalculatorsResponse) =>
          response.processVariables.foundCalculators
      )
    );
  }

  getSapMaintainers(): Observable<SupportContactResponse> {
    return this.http.get<SupportContactResponse>(
      `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${Rfq4PathsEnum.RFQ4_PATH_GET_SAP_MAINTAINERS}`
    );
  }
  recalculateSqv(
    gqPositionId: string,
    message: string
  ): Observable<RfqProcessResponse> {
    return this.http.post<RfqProcessResponse>(
      `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${gqPositionId}/${Rfq4PathsEnum.RFQ4_PATH_RECALCULATE_SQV}`,
      { message }
    );
  }

  reopenRecalculation(gqPositionId: string): Observable<RfqProcessResponse> {
    return this.http.post<RfqProcessResponse>(
      `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${gqPositionId}/${Rfq4PathsEnum.RFQ4_PATH_REOPEN_RECALCULATION}`,
      {}
    );
  }
  cancelProcess(
    gqPositionId: string,
    reasonForCancellation: string,
    comment: string
  ): Observable<RfqProcessResponse> {
    return this.http.post<RfqProcessResponse>(
      `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${gqPositionId}/${Rfq4PathsEnum.RFQ4_PATH_CANCEL_PROCESS}`,
      {
        reasonForCancellation,
        comment,
      }
    );
  }

  getProcessHistory(gqPositionId: string): Observable<RfqProcessHistory> {
    return this.http.get<RfqProcessHistory>(
      `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${gqPositionId}/${Rfq4PathsEnum.RFQ4_PATH_PROCESS_HISTORY}`
    );
  }
}
