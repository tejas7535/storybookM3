import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '../../core/http/data.service';
import {
  ReferenceTypeIdModel,
  ReferenceTypeResultModel,
} from '../../core/store/reducers/detail/models';
import { CalculationsResultModel } from '../../core/store/reducers/detail/models/calculations-result-model';

@Injectable({
  providedIn: 'root',
})
export class DetailService {
  private readonly PARAM_MATERIAL_NUMBER = 'material-number';
  private readonly PARAM_PLANT = 'plant';

  public constructor(private readonly dataService: DataService) {}

  public detail(
    item: ReferenceTypeIdModel
  ): Observable<ReferenceTypeResultModel> {
    const params: HttpParams = new HttpParams()
      .set(this.PARAM_MATERIAL_NUMBER, item.materialNumber)
      .set(this.PARAM_PLANT, item.plant);

    return this.dataService.getAll<ReferenceTypeResultModel>('detail', params);
  }

  public calculations(
    materialNumber: string
  ): Observable<CalculationsResultModel> {
    const params = new HttpParams().set(
      this.PARAM_MATERIAL_NUMBER,
      materialNumber
    );

    return this.dataService.getAll<CalculationsResultModel>(
      'calculations',
      params
    );
  }
}
