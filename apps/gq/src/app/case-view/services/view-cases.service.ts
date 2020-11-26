import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '@schaeffler/http';

@Injectable({
  providedIn: 'root',
})
export class ViewCasesService {
  private readonly path = 'quotations/list';

  constructor(private readonly dataService: DataService) {}

  public getCases(): Observable<any[]> {
    return this.dataService.getAll<any>(`${this.path}`).pipe();
  }
}
