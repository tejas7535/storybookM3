import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Event, NavigationEnd, Router } from '@angular/router';

import { filter, Subject, takeUntil } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { QuotationStatus } from '@gq/shared/models';

import { ProcessCaseRoutePath } from '../process-case-route-path.enum';
import { CancelWorkflowModalComponent } from './cancel-workflow-modal/cancel-workflow-modal.component';

@Component({
  selector: 'gq-cancel-workflow-button',
  templateUrl: './cancel-workflow-button.component.html',
  standalone: false,
})
export class CancelWorkflowButtonComponent implements OnInit, OnDestroy {
  @Input() quotationStatus: QuotationStatus;

  isProcessCaseOverviewTabActive = false;
  private readonly shutdown$$: Subject<void> = new Subject();

  readonly status = QuotationStatus;

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkIfOverviewTabIsActive();

    this.router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd),
        takeUntil(this.shutdown$$)
      )
      .subscribe(() => this.checkIfOverviewTabIsActive());
  }

  openDialog() {
    this.dialog.open(CancelWorkflowModalComponent, {
      width: '634px',
      autoFocus: false,
    });
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
