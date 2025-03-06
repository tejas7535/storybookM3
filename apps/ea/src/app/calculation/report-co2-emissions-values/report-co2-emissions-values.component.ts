import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { getAssetsPath } from '@ea/core/services/assets-path-resolver/assets-path-resolver.helper';
import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-report-emissions-values',
  templateUrl: './report-co2-emissions-values.component.html',
  imports: [
    CommonModule,
    MatDividerModule,
    MatIconModule,
    SharedTranslocoModule,
    MeaningfulRoundPipe,
  ],
})
export class ReportCo2EmissionsValuesComponent {
  @Input()
  public co2Emission: number;

  @Input()
  public co2EmissionPercentage: number;

  @Input()
  public operatingHours?: number;

  @Input()
  public downstreamError?: string;

  private readonly assetsPath = `${getAssetsPath()}/images/`;

  public getImagePath = (image: string): string => `${this.assetsPath}${image}`;
}
