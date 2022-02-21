import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { MaterialStock } from '../../../../core/store/reducers/material-stock/models/material-stock.model';
import { ApiVersion } from '../../../models';
import { MaterialTableItem, MaterialValidation } from '../../../models/table';
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
    tableData: MaterialTableItem[]
  ): Observable<MaterialValidation[]> {
    const body = [...new Set(tableData.map((el) => el.materialNumber))];

    return this.http.post<MaterialValidation[]>(
      `${ApiVersion.V1}/${this.PATH_VALIDATION}`,
      body
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
}
