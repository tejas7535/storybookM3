import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { API } from '@cdba/shared/constants/api';
import { withCache } from '@ngneat/cashew';

import { RoleDescriptions } from '../models/roles.models';

@Injectable({
  providedIn: 'root',
})
export class RoleDescriptionsService {
  private readonly PATH_ROLE_DESCRIPTIONS = 'role-description';

  public constructor(private readonly httpClient: HttpClient) {}

  public getRoleDescriptions(): Observable<RoleDescriptions> {
    return this.httpClient.get<RoleDescriptions>(
      `${API.v1}/${this.PATH_ROLE_DESCRIPTIONS}`,
      {
        context: withCache(),
      }
    );
  }
}
