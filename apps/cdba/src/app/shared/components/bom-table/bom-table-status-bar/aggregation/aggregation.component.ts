import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgModule } from '@angular/core';

import { IStatusPanelAngularComp } from 'ag-grid-angular';
import { IStatusPanelParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AggregationStatusBar } from '@cdba/shared/models';
import { AggregationStatusBarData } from '@cdba/shared/models/aggregation-status-bar.model';

import { AggregationService } from './service/aggregation.service';

@Component({
  selector: 'cdba-aggregation',
  templateUrl: './aggregation.component.html',
  styleUrls: ['./aggregation.component.scss'],
  standalone: false,
})
export class AggregationComponent implements IStatusPanelAngularComp {
  aggregationModel = new AggregationStatusBar(
    false,
    false,
    new AggregationStatusBarData(new Map(), new Map()),
    0,
    0,
    0,
    0,
    0
  );

  public constructor(
    private readonly aggregationService: AggregationService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  agInit(params: IStatusPanelParams): void {
    params.api.addEventListener('rangeSelectionChanged', () => {
      this.handleRangeSelectionChanges(params);
    });
  }
  private handleRangeSelectionChanges(params: IStatusPanelParams) {
    this.aggregationModel = this.aggregationService.calculateStatusBarValues(
      this.aggregationModel,
      params.api.getCellRanges(),
      params.api
    );

    this.changeDetectorRef.detectChanges();
  }
}

@NgModule({
  imports: [SharedTranslocoModule, CommonModule],
  declarations: [AggregationComponent],
  providers: [AggregationService],
  exports: [AggregationComponent],
})
export class AggregationComponentModule {}
