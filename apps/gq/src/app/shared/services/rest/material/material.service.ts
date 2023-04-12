import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { mergeMap, Observable, of } from 'rxjs';

import { MaterialStock } from '@gq/core/store/reducers/models';

import { ApiVersion } from '../../../models';
import { PlantMaterialDetail } from '../../../models/quotation-detail';
import {
  MaterialValidationRequest,
  MaterialValidationResponse,
} from './models';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private readonly PATH_VALIDATION = 'materials/validation';
  private readonly PATH_MATERIAL_STOCK = 'materials/material-stock-status';
  private readonly PRODUCTION_PLANT_PARAM_KEY = 'production_plant_id';
  private readonly MATERIAL_NUMBER_PARAM_KEY = 'material_number_15';

  constructor(private readonly http: HttpClient) {}

  public validateMaterials(
    validateMaterialData: MaterialValidationRequest
  ): Observable<MaterialValidationResponse> {
    return this.http.post<MaterialValidationResponse>(
      `${ApiVersion.V1}/${this.PATH_VALIDATION}`,
      validateMaterialData
    );
  }

  public getMaterialStock(
    productionPlantId: string,
    materialNumber15: string
  ): Observable<MaterialStock> {
    const params = new HttpParams()
      .set(this.PRODUCTION_PLANT_PARAM_KEY, productionPlantId)
      .set(this.MATERIAL_NUMBER_PARAM_KEY, materialNumber15);

    return this.http.get<MaterialStock>(
      `${ApiVersion.V1}/${this.PATH_MATERIAL_STOCK}`,
      { params }
    );
  }

  public getPlantMaterialDetails(
    materialId: string,
    plantIds: string[]
  ): Observable<PlantMaterialDetail[]> {
    return this.http
      .post(`${ApiVersion.V1}/materials/${materialId}/plant-material-details`, {
        plantIds,
      })
      .pipe(mergeMap((result: any) => of([...result.plantMaterialDetailDtos])));
  }

  public getMaterialCostDetails(
    productionPlantId: string,
    materialId: string
  ): Observable<any> {
    const params = new HttpParams().set(
      this.PRODUCTION_PLANT_PARAM_KEY,
      productionPlantId
    );

    return this.http.get(
      `${ApiVersion.V1}/materials/${materialId}/material-cost-details`,
      { params }
    );
  }
}
