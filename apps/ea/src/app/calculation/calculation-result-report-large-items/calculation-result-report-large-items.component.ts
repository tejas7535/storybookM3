import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { InfoButtonComponent } from '@ea/shared/info-button/info-button.component';
import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { TagComponent } from '@ea/shared/tag/tag.component';
import { TranslocoDecimalPipe } from '@ngneat/transloco-locale';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ResultReportLargeItem } from './result-report-large-item';

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
  @Input() items: ResultReportLargeItem[];

  @Input() firstItemLarge = true;
}
