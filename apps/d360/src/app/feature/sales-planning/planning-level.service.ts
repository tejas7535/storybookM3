import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PlanningLevelMaterial } from './model';

@Injectable({
  providedIn: 'root',
})
export class PlanningLevelService {
  private readonly PLANNING_LEVEL_MATERIAL_API: string =
    'api/sales-planning/planning-level';

  private readonly http: HttpClient = inject(HttpClient);

  public getMaterialTypeByCustomerNumber(
    customerNumber: string
  ): Observable<PlanningLevelMaterial> {
    return this.http.get<PlanningLevelMaterial>(
      `${this.PLANNING_LEVEL_MATERIAL_API}?customerNumber=${customerNumber}`
    );
  }

  public deleteMaterialTypeByCustomerNumber(
    customerNumber: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.PLANNING_LEVEL_MATERIAL_API}?customerNumber=${customerNumber}`
    );
  }
}
