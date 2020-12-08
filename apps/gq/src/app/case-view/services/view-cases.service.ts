import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '@schaeffler/http';

import { ViewQuotation } from '../../core/store/models';

@Injectable({
  providedIn: 'root',
})
export class ViewCasesService {
  private readonly path = 'quotations/list';

  constructor(private readonly dataService: DataService) {}

  public getCases(): Observable<ViewQuotation[]> {
    return this.dataService.getAll<ViewQuotation[]>(`${this.path}`).pipe();
  }
}
