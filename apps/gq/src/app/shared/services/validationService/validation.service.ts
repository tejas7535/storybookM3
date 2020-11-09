import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '@schaeffler/http';

import { CaseTableItem, MaterialValidation } from '../../../core/store/models';

@Injectable({
  providedIn: 'root',
})
/**
 *  Validation Service
 */
export class ValidationService {
  private readonly path = 'materials/validation';

  constructor(private readonly dataService: DataService) {}

  public validate(
    tableData: CaseTableItem[]
  ): Observable<MaterialValidation[]> {
    const body = tableData.map((el) => el.materialNumber);

    return this.dataService.post(this.path, body);
  }
}
