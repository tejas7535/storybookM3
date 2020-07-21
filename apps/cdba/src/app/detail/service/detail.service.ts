import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '../../core/http/data.service';
import {
  ReferenceTypeIdModel,
  ReferenceTypeResultModel,
} from '../../core/store/reducers/detail/models';

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
}
