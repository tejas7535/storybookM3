import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import { MaterialDetails } from '../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class MaterialDetailsService {
  private readonly path = 'materials';

  constructor(private readonly dataService: DataService) {}

  loadMaterials(materialNumber15: string): Observable<any> {
    return this.dataService
      .getAll<any>(`${this.path}/${materialNumber15}`)
      .pipe(map((res: MaterialDetails) => res));
  }
}
