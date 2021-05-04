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
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() displayReport!: string;
  @Input() downloadReport?: string;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  result$: Observable<string>;

  constructor(private readonly reportService: ReportService) {}

  ngOnInit(): void {
    this.getReport();
  }

  getReport(): void {
    this.result$ = this.reportService.getReport(this.displayReport);
  }
}
