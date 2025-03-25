import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { filter, switchMap, take, tap } from 'rxjs';

import { TranslocoDirective } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { AppRouteValue } from '../../app.routes.enum';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'd360-root',
  imports: [LoadingSpinnerModule, TranslocoDirective],
  templateUrl: './root.component.html',
})
export class RootComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    this.userService.settingsLoaded$
      .pipe(
        filter((loaded: boolean) => loaded),
        take(1),
        switchMap(() => this.userService.getStartPage()),
        tap((startPage: AppRouteValue) => this.router.navigate([startPage])),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
