import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import { filter, Subject, takeUntil } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { QuotationStatus } from '@gq/shared/models';

import { ProcessCaseRoutePath } from '../process-case-route-path.enum';

@Component({
  selector: 'gq-cancel-workflow-button',
  templateUrl: './cancel-workflow-button.component.html',
})
export class CancelWorkflowButtonComponent implements OnInit, OnDestroy {
  @Input() quotationStatus: QuotationStatus;

  isProcessCaseOverviewTabActive = false;
  readonly status = QuotationStatus;

  private readonly shutdown$$: Subject<void> = new Subject();

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.checkIfOverviewTabIsActive();

    this.router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd),
        takeUntil(this.shutdown$$)
      )
      .subscribe(() => this.checkIfOverviewTabIsActive());
  }

  ngOnDestroy(): void {
    this.shutdown$$.next();
    this.shutdown$$.complete();
  }

  private checkIfOverviewTabIsActive(): void {
    this.isProcessCaseOverviewTabActive = this.router.url.startsWith(
      `/${AppRoutePath.ProcessCaseViewPath}/${ProcessCaseRoutePath.OverviewPath}`
    );
  }
}
