import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiVersion } from '../../../models';
import { MaterialTableItem, MaterialValidation } from '../../../models/table';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private readonly PATH_VALIDATION = 'materials/validation';

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
}
