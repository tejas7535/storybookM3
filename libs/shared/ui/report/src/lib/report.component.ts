import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SnackBarService } from '@schaeffler/snackbar';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ReportService } from './report.service';

@Component({
  selector: 'schaeffler-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [ReportService],
  encapsulation: ViewEncapsulation.None,
})
export class ReportComponent implements OnInit, OnDestroy {
  @Input() public title!: string;
  @Input() public subtitle?: string;
  @Input() public displayReport!: string;
  @Input() public downloadReport?: string;
  @Input() public errorMsg =
    'Unfortunately an error occured. Please try again later.';
  @Input() public actionText = 'Retry';

  public result$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly reportService: ReportService,
    private readonly snackbarService: SnackBarService
  ) {}

  public ngOnInit(): void {
    this.getReport();
  }

  public ngOnDestroy(): void {
    this.snackbarService.dismiss();
    this.destroy$.next();
  }

  public getReport(): void {
    this.reportService
      .getReport(this.displayReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => this.result$.next(result),
        error: () => {
          this.snackbarService
            .showErrorMessage(this.errorMsg, this.actionText, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.getReport());
        },
      });
  }
}
