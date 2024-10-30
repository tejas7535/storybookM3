import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { VersionData } from './model';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private readonly VERSION_API = 'api/info/version';
  constructor(private readonly http: HttpClient) {}

  getVersionData(): Observable<VersionData> {
    return this.http.get<VersionData>(this.VERSION_API);
    // TODO add error handling here --> display snackbar in this service.
  }
}
