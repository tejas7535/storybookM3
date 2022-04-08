import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { debounceTime, Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { AppRoutePath } from '../app-route-path.enum';
import { getReportUrls } from '../core/store/selectors/result/result.selector';
import { GreaseCalculationPath } from '../grease-calculation/grease-calculation-path.enum';
import { ReportUrls } from '../shared/models';

@Component({
  selector: 'ga-result',
  templateUrl: './result.component.html',
})
export class ResultComponent implements OnInit {
  public reportUrls$: Observable<ReportUrls>;
  public reportSelector = '.content';
  public showCompactView = true;

  constructor(private readonly store: Store, private readonly router: Router) {}

  public ngOnInit(): void {
    this.reportUrls$ = this.store
      .select(getReportUrls)
      .pipe(debounceTime(3000));
  }

  public navigateBack(): void {
    this.router.navigate([
      `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
    ]);
  }
}
