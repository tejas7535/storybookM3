import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Extension } from '../../home/extension/extension.model';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private readonly httpService: HttpClient) {}

  /**
   * gets all extensions from asset json file currently
   */
  public getExtensions(): Observable<Extension[]> {
    return this.httpService.get<Extension[]>(`assets/extensions.json`);
  }
}
