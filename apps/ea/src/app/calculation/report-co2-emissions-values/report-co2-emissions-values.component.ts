import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
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
  public co2Emission = input.required<number>();
  public co2EmissionPercentage = input.required<number>();
  public operatingHours = input<number | undefined>();
  public downstreamError = input<string | undefined>();
  public showApprox = input<boolean>(false);
  public noRounding = input<boolean>(false);

  private readonly assetsPath = `${getAssetsPath()}/images/`;

  public getImagePath = (image: string): string => `${this.assetsPath}${image}`;
}
