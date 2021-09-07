import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '@schaeffler/http';

import { MaterialTableItem, MaterialValidation } from '../../../models/table';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private readonly PATH_VALIDATION = 'materials/validation';

  constructor(private readonly dataService: DataService) {}

  public validateMaterials(
    tableData: MaterialTableItem[]
  ): Observable<MaterialValidation[]> {
    const body = [...new Set(tableData.map((el) => el.materialNumber))];

    return this.dataService.post(this.PATH_VALIDATION, body);
  }
}
