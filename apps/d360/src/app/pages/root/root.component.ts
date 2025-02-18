import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { take, tap } from 'rxjs';

import { TranslocoDirective } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'd360-root',
  standalone: true,
  imports: [LoadingSpinnerModule, TranslocoDirective],
  templateUrl: './root.component.html',
})
export class RootComponent {
  public constructor() {
    const userService = inject(UserService);
    const router = inject(Router);

    userService
      .loadRegion()
      .pipe(
        take(1),
        tap(() => {
          router.navigate([userService.startPage()]);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
