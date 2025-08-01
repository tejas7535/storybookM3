import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable, take } from 'rxjs';

import { ApiVersion } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { FeatureToggleConfigService } from '@gq/shared/services/feature-toggle/feature-toggle-config.service';

import { FindCalculatorsResponse } from './models/find-calculators-response.interface';
import { RecalculateSqvResponse } from './models/recalculate-sqv.response.interface';
import { Rfq4PathsEnum } from './models/rfq-4-paths.enum';
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
  ): Observable<Rfq4Status> {
    return this.http
      .post<RecalculateSqvResponse>(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${gqPositionId}/${Rfq4PathsEnum.RFQ4_PATH_RECALCULATE_SQV}`,
        { message }
      )
      .pipe(
        map(
          (response: RecalculateSqvResponse) =>
            response.processVariables.rfq4Status
        )
      );
  }
  cancelProcess(
    gqPositionId: string,
    reasonForCancellation: string,
    comment: string
  ): Observable<Rfq4Status> {
    return this.http
      .post<RecalculateSqvResponse>(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${gqPositionId}/${Rfq4PathsEnum.RFQ4_PATH_CANCEL_PROCESS}`,
        {
          reasonForCancellation,
          comment,
        }
      )
      .pipe(
        map(
          (response: RecalculateSqvResponse) =>
            response.processVariables.rfq4Status
        )
      );
  }
}
