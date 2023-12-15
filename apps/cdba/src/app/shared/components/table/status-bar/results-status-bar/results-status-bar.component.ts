import { Component } from '@angular/core';

import { GridApi, IStatusPanelParams } from 'ag-grid-enterprise';

import { BetaFeature } from '@cdba/shared/constants/beta-feature';
import { BetaFeatureService } from '@cdba/shared/services/beta-feature/beta-feature.service';

@Component({
  selector: 'cdba-results-status-bar',
  templateUrl: './results-status-bar.component.html',
  styleUrls: ['./results-status-bar.component.scss'],
})
export class ResultsStatusBarComponent {
  public gridApi: GridApi;

  LIMIT_FILTER_ENABLED = false;

  constructor(private readonly betaFeatureService: BetaFeatureService) {}

  public agInit(params: IStatusPanelParams): void {
    this.gridApi = params.api;

    this.LIMIT_FILTER_ENABLED = this.betaFeatureService.getBetaFeature(
      BetaFeature.LIMIT_FILTER
    );
  }
}
