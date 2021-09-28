import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '../app-route-path.enum';
import { getResultId } from '../core/store/selectors/result/result.selector';
import { GreaseCalculationPath } from '../grease-calculation/grease-calculation-path.enum';

@Component({
  selector: 'ga-result',
  templateUrl: './result.component.html',
})
export class ResultComponent implements OnInit {
  public resultId$: Observable<string>;
  public resultState$: Observable<any>;

  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.resultId$ = this.store.select(getResultId);
  }

  public navigateBack(): void {
    this.router.navigate([
      `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
    ]);
  }
}
