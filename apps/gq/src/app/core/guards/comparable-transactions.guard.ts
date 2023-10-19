import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, tap } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { RolesFacade } from '@gq/core/store/facades';

@Injectable({
  providedIn: 'root',
})
export class ComparableTransactionsGuard {
  constructor(
    private readonly rolesFacade: RolesFacade,
    private readonly router: Router
  ) {}

  canActivateChild(): Observable<boolean> {
    return this.rolesFacade.userHasAccessToComparableTransactions$.pipe(
      tap((granted) => {
        if (!granted) {
          this.router.navigate([AppRoutePath.ForbiddenPath]);
        }
      })
    );
  }
}
