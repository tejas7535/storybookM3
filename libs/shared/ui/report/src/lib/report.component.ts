import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SnackBarService } from '@schaeffler/snackbar';

import { Title, Type } from './models';
import { Subordinate } from './models/subordinate.model';
import { TableItem } from './models/table-item.model';
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
  @Input() public htmlReport?: string;
  @Input() public jsonReport?: string;
  @Input() public reportSelector?: string;
  @Input() public downloadReport?: string;
  @Input() public errorMsg =
    'Unfortunately an error occured. Please try again later.';
  @Input() public actionText = 'Retry';
  @Input() public type = Type.GENERIC;

  public htmlResult$ = new ReplaySubject<string>();
  public jsonResult$ = new ReplaySubject<Subordinate[]>();
  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly reportService: ReportService,
    private readonly snackbarService: SnackBarService
  ) {}

  public ngOnInit(): void {
    if (this.htmlReport) {
      this.getHtmlReport();
    } else if (this.jsonReport) {
      this.getJsonReport();
    }
  }

  public ngOnDestroy(): void {
    this.snackbarService.dismiss();
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getHtmlReport(): void {
    this.reportService
      .getHtmlReport(this.htmlReport as string, this.reportSelector)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: string) => this.htmlResult$.next(result),
        error: () => {
          this.snackbarService
            .showErrorMessage(this.errorMsg, this.actionText, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.getHtmlReport());
        },
      });
  }

  public getJsonReport(): void {
    this.reportService
      .getJsonReport(this.jsonReport as string)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: Subordinate[]) =>
          this.type === Type.GREASE
            ? this.jsonResult$.next(this.formatGreaseReport(result))
            : this.jsonResult$.next(result),
        error: () => {
          this.snackbarService
            .showErrorMessage(this.errorMsg, this.actionText, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.getJsonReport());
        },
      });
  }

  public getItem(row: TableItem[], field: string): TableItem | undefined {
    return row.find((element: TableItem) => element.field === field);
  }

  public getHeaders(fields: string[]): string[] {
    return fields.map((field: string, index: number) => `${field}${index}`);
  }

  public formatGreaseReport(result: Subordinate[]): Subordinate[] {
    console.log(result);
    const formattedResult = result.map((section: Subordinate) =>
      section.titleID === Title.STRING_OUTP_RESULTS
        ? { ...section, defaultOpen: true }
        : section
    );

    console.log(formattedResult);

    return formattedResult;
  }
}
