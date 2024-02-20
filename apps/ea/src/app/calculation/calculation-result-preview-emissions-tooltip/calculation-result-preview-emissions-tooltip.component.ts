import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { RichTooltipComponent } from '@schaeffler/rich-tooltip';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationDisclaimerComponent } from '../calculation-disclaimer/calculation-disclaimer.component';

@Component({
  selector: 'ea-calculation-result-preview-emissions-tooltip',
  templateUrl: './calculation-result-preview-emissions-tooltip.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    RichTooltipComponent,
    CdkOverlayOrigin,
    SharedTranslocoModule,
  ],
})
export class CalculationResultPreviewEmissionsTooltipComponent {
  constructor(private readonly dialog: MatDialog) {}

  public openMoreInformation() {
    this.dialog.open(CalculationDisclaimerComponent, {
      hasBackdrop: true,
      autoFocus: true,
      maxWidth: '750px',
    });
  }
}
