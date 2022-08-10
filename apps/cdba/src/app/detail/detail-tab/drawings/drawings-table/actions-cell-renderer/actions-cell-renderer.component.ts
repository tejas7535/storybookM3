import { Component } from '@angular/core';

import { ICellRendererParams } from 'ag-grid-enterprise';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

@Component({
  selector: 'cdba-actions-cell-renderer',
  templateUrl: './actions-cell-renderer.component.html',
})
export class ActionsCellRendererComponent {
  private readonly DOWNLOAD_DRAWING_EVENT = 'Download Drawing';

  public downloadUrl: string;

  constructor(
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

  agInit(params: ICellRendererParams): void {
    this.downloadUrl = params.value;
  }

  download(downloadUrl: string): void {
    this.applicationInsightsService.logEvent(this.DOWNLOAD_DRAWING_EVENT, {
      downloadUrl,
    });
  }
}
