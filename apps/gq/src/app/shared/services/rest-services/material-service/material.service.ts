import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '@schaeffler/http';

import {
  MaterialTableItem,
  MaterialValidation,
} from '../../../../core/store/models';

@Injectable({
  providedIn: 'root',
})
/**
 *  Material Service
 */
export class MaterialService {
  private readonly PATH_VALIDATION = 'materials/validation';

  constructor(private readonly dataService: DataService) {}

  public validateMaterials(
    tableData: MaterialTableItem[]
  ): Observable<MaterialValidation[]> {
    const body = tableData.map((el) => el.materialNumber);

    return this.dataService.post(this.PATH_VALIDATION, body);
  }
}
