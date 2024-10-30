import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AlertNotificationCount, AlertStatus } from './model';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly ALERT_COUNT_API = 'api/alerts/count';
  private readonly ALERT_HASH_API = 'api/alerts/hash';
  private readonly ALERT_NOTIFICATION_COUNT_API =
    'api/alerts/notification/count';

  constructor(private readonly http: HttpClient) {}

  completeAlert(alertId: string): Observable<any> {
    return this.http.post(`api/alerts/${alertId}/complete`, {});
  }

  activateAlert(alertId: string): Observable<any> {
    return this.http.post(`api/alerts/${alertId}/activate`, {});
  }

  deactivateAlert(alertId: string): Observable<any> {
    return this.http.post(`api/alerts/${alertId}/deactivate`, {});
  }

  getAlertCount(status: AlertStatus): Observable<number> {
    const params = new HttpParams().set('status', status);

    return this.http.get<number>(this.ALERT_COUNT_API, { params });
  }

  getAlertHash(): Observable<string> {
    return this.http.get<string>(this.ALERT_HASH_API);
  }

  getAlertNotificationCount(): Observable<AlertNotificationCount> {
    return this.http.get<AlertNotificationCount>(
      this.ALERT_NOTIFICATION_COUNT_API
    );
  }
}
