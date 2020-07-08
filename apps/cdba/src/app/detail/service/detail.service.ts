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
  public constructor(private readonly dataService: DataService) {}

  public detail(
    item: ReferenceTypeIdModel
  ): Observable<ReferenceTypeResultModel> {
    return this.dataService.post<ReferenceTypeResultModel>('detail', item);
  }
}
