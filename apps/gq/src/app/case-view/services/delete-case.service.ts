import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService, DeleteOptions } from '@schaeffler/http';

@Injectable({
  providedIn: 'root',
})
export class DeleteCaseService {
  private readonly path = 'quotations';

  constructor(private readonly dataService: DataService) {}

  public deleteCase(gqId: string[]): Observable<any> {
    const options: DeleteOptions = {
      body: gqId,
    };

    return this.dataService.delete(`${this.path}`, options);
  }
}
