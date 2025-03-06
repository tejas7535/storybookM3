import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { BehaviorSubject, Subject, take, takeUntil, tap } from 'rxjs';

import { translate, TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { selectBearing, SettingsFacade } from '@ga/core/store';

@Component({
  selector: 'ga-grease-calculation',
  templateUrl: './grease-calculation.component.html',
  standalone: false,
})
export class GreaseCalculationComponent implements OnInit, OnDestroy {
  public appIsEmbedded$ = this.settingsFacade.appIsEmbedded$;
  public breadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject(
    this.getBreadcrumbs()
  );

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly settingsFacade: SettingsFacade,
    private readonly translocoService: TranslocoService
  ) {}

  public ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        take(1),
        tap((params: ParamMap) => {
          if (params.has('bearing')) {
            this.store.dispatch(
              selectBearing({ bearing: params.get('bearing') })
            );
          }
        })
      )
      .subscribe();

    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.breadcrumbs$.next(this.getBreadcrumbs());
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getBreadcrumbs(): Breadcrumb[] {
    return [
      {
        label: translate('shared.breadcrumbs.landingPage'),
        url: '/',
      },
      {
        label: translate('shared.breadcrumbs.greaseCalculator'),
      },
    ];
  }
}
