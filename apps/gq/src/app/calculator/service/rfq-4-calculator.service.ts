import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { ApiVersion } from '@gq/shared/models/api-version.enum';
import { Rfq4PathsEnum } from '@gq/shared/services/rest/rfq4/models/rfq-4-paths.enum';
import { Rfq4Service } from '@gq/shared/services/rest/rfq4/rfq-4.service';

import { CalculatorTab } from '../rfq-4-overview-view/models/calculator-tab.enum';
import { Rfq4OverviewTabCounts } from '../rfq-4-overview-view/store/rfq-4-overview.store';
import { GetRfqRequestsCountResponse } from './models/get-rfq-requests-count-response.interface';
import {
  GetRfqRequestsResponse,
  RfqRequest,
} from './models/get-rfq-requests-response.interface';
import { Rfq4CalculatorPaths } from './rfq-4-calculator-paths.enum';
@Injectable({
  providedIn: 'root',
})
export class Rfq4CalculatorService {
  readonly #http = inject(HttpClient);
  readonly calService = inject(Rfq4Service);

  getRfqRequests(tab: CalculatorTab): Observable<RfqRequest[]> {
    return this.#http
      .get<GetRfqRequestsResponse>(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${Rfq4CalculatorPaths.RFQ_4_CALCULATOR_OVERVIEW}/${tab}`
      )
      .pipe(map(({ results }) => results));
  }

  loadRfqRequestsCount(): Observable<Rfq4OverviewTabCounts> {
    return this.#http
      .get<GetRfqRequestsCountResponse>(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${Rfq4CalculatorPaths.RFQ_4_REQUESTS_COUNT}`
      )
      .pipe(
        map(({ results }) => ({
          [CalculatorTab.OPEN]: results.openCount,
          [CalculatorTab.IN_PROGRESS]: results.inProgressCount,
          [CalculatorTab.DONE]: results.doneCount,
        }))
      );
  }
}
