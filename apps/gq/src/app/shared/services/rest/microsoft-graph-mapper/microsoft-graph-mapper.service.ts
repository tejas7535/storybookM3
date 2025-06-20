import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import {
  ActiveDirectoryUser,
  MicrosoftUser,
  MicrosoftUsersResponse,
} from '@gq/shared/models/user.model';
import { withCache } from '@ngneat/cashew';

@Injectable({
  providedIn: 'root',
})
export class MicrosoftGraphMapperService {
  private readonly PATH_USERS = 'https://graph.microsoft.com/v1.0/users';
  private readonly USERS_PAGE_SIZE = 20;
  private readonly USERS_FIELDS = [
    'givenName',
    'surname',
    'displayName',
    'userPrincipalName',
    'mail',
  ];
  private readonly http: HttpClient = inject(HttpClient);

  getActiveDirectoryUsers(
    searchExpression: string
  ): Observable<ActiveDirectoryUser[]> {
    const headers: HttpHeaders = new HttpHeaders({
      ConsistencyLevel: 'eventual',
    });

    return this.http
      .get<MicrosoftUsersResponse>(
        `${
          this.PATH_USERS
        }?$search="displayName:${searchExpression}" OR "userPrincipalName:${searchExpression}"&$filter=givenName ne null and surname ne null&$orderby=userPrincipalName&$select=${this.USERS_FIELDS.join(
          ','
        )}&$count=true&$top=${this.USERS_PAGE_SIZE}`,
        { headers }
      )
      .pipe(
        map((userResponse: MicrosoftUsersResponse) =>
          userResponse.value.map((microsoftUser: MicrosoftUser) =>
            this.mapMicrosoftUser(microsoftUser)
          )
        )
      );
  }
  getActiveDirectoryUserByMultipleUserIds(
    userIds: string[]
  ): Observable<ActiveDirectoryUser[]> {
    const headers: HttpHeaders = new HttpHeaders({
      ConsistencyLevel: 'eventual',
    });
    const userIdsString = userIds
      .map((name) => `"userPrincipalName:${name}"`)
      .join(' OR ');

    return this.http
      .get<MicrosoftUsersResponse>(
        `${this.PATH_USERS}?$search=${userIdsString}&$filter=givenName ne null and surname ne null&$select=${this.USERS_FIELDS.join(',')}&$count=true&$top=${this.USERS_PAGE_SIZE}`,
        { headers }
      )
      .pipe(
        map((userResponse: MicrosoftUsersResponse) =>
          userResponse.value.map((microsoftUser: MicrosoftUser) =>
            this.mapMicrosoftUser(microsoftUser)
          )
        )
      );
  }

  getActiveDirectoryUserByUserId(
    userId: string
  ): Observable<ActiveDirectoryUser> {
    const headers: HttpHeaders = new HttpHeaders({
      ConsistencyLevel: 'eventual',
    });

    return this.http
      .get<MicrosoftUser>(
        `${this.PATH_USERS}/${`${userId}@schaeffler.com`}?$select=${this.USERS_FIELDS.join(',')}`,
        { headers, context: withCache() }
      )
      .pipe(
        map((microsoftUser: MicrosoftUser) =>
          this.mapMicrosoftUser(microsoftUser)
        )
      );
  }

  private mapMicrosoftUser(microsoftUser: MicrosoftUser): ActiveDirectoryUser {
    return {
      firstName: microsoftUser.givenName,
      lastName: microsoftUser.surname,
      userId: microsoftUser.userPrincipalName.split('@')[0],
      mail: microsoftUser.mail,
    };
  }
}
