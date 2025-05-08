import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { InfoButtonComponent } from '@ea/shared/info-button/info-button.component';
import { MeaningfulRoundPipe } from '@ea/shared/pipes/meaningful-round.pipe';
import { TagComponent } from '@ea/shared/tag/tag.component';
import { TranslocoDecimalPipe } from '@jsverse/transloco-locale';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ResultReportLargeItem } from './result-report-large-item';

@Component({
  selector: 'ea-calculation-result-report-large-items',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    TagComponent,
    MatIconModule,
    InfoButtonComponent,
    MeaningfulRoundPipe,
    MatDividerModule,
  ],
  providers: [TranslocoDecimalPipe],
  templateUrl: './calculation-result-report-large-items.component.html',
})
export class CalculationResultReportLargeItemsComponent {
  @Input() translocoRoot = '';
  @Input() items: ResultReportLargeItem[];

  /**
   * Contains the translations keys for fields that have additional context
   * like disclaimers.
   * The context is provided by placing the <ng-content> conditionally on the fields
   * that are included in this array
   **/
  @Input() contextKeys?: string[];
  @Input() disclaimerTemplate?: TemplateRef<any>;

  @Input() firstItemLarge = true;

  hasContext(translationKey: string) {
    if (!this.contextKeys) {
      return false;
    }

    return this.contextKeys.includes(translationKey);
  }
}
