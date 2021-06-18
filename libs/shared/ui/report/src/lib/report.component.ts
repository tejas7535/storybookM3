import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs';

import { ReportService } from './report.service';

@Component({
  selector: 'schaeffler-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [ReportService],
  encapsulation: ViewEncapsulation.None,
})
export class ReportComponent implements OnInit {
  @Input() public title!: string;
  @Input() public subtitle?: string;
  @Input() public displayReport!: string;
  @Input() public downloadReport?: string;

  public result$!: Observable<string>;

  public constructor(private readonly reportService: ReportService) {}

  public ngOnInit(): void {
    this.getReport();
  }

  public getReport(): void {
    this.result$ = this.reportService.getReport(this.displayReport);
  }
}
