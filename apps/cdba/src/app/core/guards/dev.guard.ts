import { Injectable } from '@angular/core';
import { CanActivateChild } from '@angular/router';

import { Observable, of } from 'rxjs';

import { environment } from '@cdba/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DevGuard implements CanActivateChild {
  canActivateChild(): Observable<boolean> {
    return of(!environment.production);
  }
}
