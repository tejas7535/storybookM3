import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ProductionPlantResponse } from '@gq/calculator/rfq-4-detail-view/models/rfq-4-detail-view-data.interface';
import { DetailViewPaths } from '@gq/calculator/rfq-4-detail-view/service/rest/rfq-4-detail-view-paths.enum';
import { ApiVersion } from '@gq/shared/models';
import { Rfq4PathsEnum } from '@gq/shared/services/rest/rfq4/models/rfq-4-paths.enum';

@Injectable({
  providedIn: 'root',
})
export class ProductionPlantService {
  private readonly http: HttpClient = inject(HttpClient);

  getProductionPlantsForRfq(): Observable<ProductionPlantResponse> {
    return this.http.get<ProductionPlantResponse>(
      `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${DetailViewPaths.PATH_CALCULATOR}/${DetailViewPaths.PATH_PRODUCTION_PLANTS}`
    );
  }
}
