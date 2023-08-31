import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { TagComponent } from '@ea/shared/tag/tag.component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ea-calculation-result-report-large-items',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    TagComponent,
    MatIconModule,
    MatTooltipModule,
    MeaningfulRoundPipe,
  ],
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
