import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

import { TranslocoModule } from '@jsverse/transloco';
import { RecommendationLubricatorHeaderData } from '@lsa/shared/models';

@Component({
  selector: 'lsa-lubricator-header',
  standalone: true,
  imports: [CommonModule, MatRadioModule, TranslocoModule],
  templateUrl: './lubricator-header.component.html',
})
export class LubricatorHeaderComponent {
  @Input() headerData: RecommendationLubricatorHeaderData;
  @Input() selected: boolean;
  @Input() isLastColumn?: boolean;
  @Input() selectValue: string;

  @Output() headerSelected = new EventEmitter<{ isRecommended: boolean }>();

  onHeaderSelected(checked: boolean): void {
    if (checked) {
      this.headerSelected.emit({
        isRecommended: this.headerData.isRecommended,
      });
    }
  }
}
