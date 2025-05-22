import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiVersion } from '@gq/shared/models';
import { Rfq4PathsEnum } from '@gq/shared/services/rest/rfq4/models/rfq-4-paths.enum';

import { RfqDetailViewData } from '../../models/rfq-4-detail-view-data.interface';
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
}
