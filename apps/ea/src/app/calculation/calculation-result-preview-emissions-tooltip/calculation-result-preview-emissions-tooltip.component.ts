import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { DisclaimerService } from '@ea/core/services/disclaimer.service';

import { RichTooltipComponent } from '@schaeffler/rich-tooltip';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-calculation-result-preview-emissions-tooltip',
  templateUrl: './calculation-result-preview-emissions-tooltip.component.html',
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
  disclaimerServie = inject(DisclaimerService);
  hintTranslationKey = computed(() =>
    this.isDownstream() ? 'downstreamHint' : 'upstreamHint'
  );

  public openMoreInformation() {
    this.disclaimerServie.openCO2Disclaimer(this.isDownstream());
  }
}
