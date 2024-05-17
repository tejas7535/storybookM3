import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiVersion } from '../../shared/models';
import { ISystemMessage } from '../../shared/models/system-message';

@Injectable({
  providedIn: 'root',
})
export class SystemMessageService {
  readonly SYSTEM_MESSAGE = 'system-message';
  constructor(private readonly http: HttpClient) {}

  getSystemMessage(): Observable<ISystemMessage[]> {
    return this.http.get<ISystemMessage[]>(
      `${ApiVersion.V1}/${this.SYSTEM_MESSAGE}`
    );
  }

  dismissSystemMessage(id: number): Observable<ISystemMessage> {
    return this.http.patch<ISystemMessage>(
      `${ApiVersion.V1}/${this.SYSTEM_MESSAGE}`,
      id
    );
  }
}
