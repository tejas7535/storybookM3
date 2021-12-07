import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { take, tap } from 'rxjs';

import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { selectBearing } from '../core/store';

@Component({
  selector: 'ga-grease-calculation',
  templateUrl: './grease-calculation.component.html',
})
export class GreaseCalculationComponent implements OnInit {
  public breadcrumbs: Breadcrumb[] = [
    {
      label: 'Landing Page',
      url: '/',
    },
    {
      label: 'Grease Calculator',
    },
  ];

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute
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
  }
}
