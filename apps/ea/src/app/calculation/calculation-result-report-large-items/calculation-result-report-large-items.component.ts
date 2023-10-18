import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { InfoButtonComponent } from '@ea/shared/info-button/info-button.component';
import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { TagComponent } from '@ea/shared/tag/tag.component';
import { TranslocoDecimalPipe } from '@ngneat/transloco-locale';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-calculation-result-report-large-items',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    TagComponent,
    MatIconModule,
    InfoButtonComponent,
    MeaningfulRoundPipe,
  ],
  providers: [TranslocoDecimalPipe],
  templateUrl: './calculation-result-report-large-items.component.html',
})
export class CalculationResultReportLargeItemsComponent {
  @Input() translocoRoot = '';
  @Input() items: {
    /** Value of this item */
    value?: string | number;
    /** Unit of the value */
    unit: string;
    /** Scientific name, displayed in tag */
    short?: string;
    /** Transloco key */
    title: string;
    /** Optional tooltip */
    titleTooltip?: string;
    /** Optional warning for this item */
    warning?: string;
  }[];
  @Input() firstItemLarge = true;
}
