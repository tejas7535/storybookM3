import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { withCache } from '@ngneat/cashew';

import { ApiVersion } from '../../shared/models';
import { UserFeedback } from './models';
import { UserSettings } from './models/user-settings.model';

@Injectable({
  providedIn: 'root',
})
export class UserSettingsService {
  readonly USER_SETTINGS = 'user-settings';
  readonly FEEDBACK = 'user-feedback';

  constructor(private readonly http: HttpClient) {}

  getUserSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(
      `${ApiVersion.V1}/${this.USER_SETTINGS}`,
      {
        context: withCache(),
      }
    );
  }

  updateUserSettings(
    userSettings: Partial<UserSettings>
  ): Observable<UserSettings> {
    return this.http.patch<UserSettings>(
      `${ApiVersion.V1}/${this.USER_SETTINGS}`,
      userSettings
    );
  }

  submitUserFeedback(feedback: UserFeedback): Observable<void> {
    return this.http.post<void>(`${ApiVersion.V1}/${this.FEEDBACK}`, feedback);
  }
}
