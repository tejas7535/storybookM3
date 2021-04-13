import { Component } from '@angular/core';

import { ICellRendererParams } from '@ag-grid-enterprise/all-modules';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

@Component({
  selector: 'cdba-actions-cell-renderer',
  templateUrl: './actions-cell-renderer.component.html',
  styleUrls: ['./actions-cell-renderer.component.scss'],
})
export class ActionsCellRendererComponent {
  private readonly METRIC_DOWNLOAD_DRAWING = 'Download Drawing';

  public downloadUrl: string;

  constructor(
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

  agInit(params: ICellRendererParams): void {
    this.downloadUrl = params.value;
  }

  download(): void {
    this.applicationInsightsService.logMetric(this.METRIC_DOWNLOAD_DRAWING, 1);
  }
}
