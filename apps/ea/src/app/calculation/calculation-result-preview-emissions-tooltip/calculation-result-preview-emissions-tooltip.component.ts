import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
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
    MatIconModule,
    RichTooltipComponent,
    CdkOverlayOrigin,
    SharedTranslocoModule,
  ],
})
export class CalculationResultPreviewEmissionsTooltipComponent {
  isDownstream = input<boolean>();

  hintTranslationKey = computed(() =>
    this.isDownstream() ? 'downstreamHint' : 'upstreamHint'
  );

  constructor(private readonly dialog: MatDialog) {}

  public openMoreInformation() {
    this.dialog.open(CalculationDisclaimerComponent, {
      hasBackdrop: true,
      autoFocus: true,
      maxWidth: '750px',
      data: {
        isDownstreamDisclaimer: this.isDownstream(),
      },
    });
  }
}
