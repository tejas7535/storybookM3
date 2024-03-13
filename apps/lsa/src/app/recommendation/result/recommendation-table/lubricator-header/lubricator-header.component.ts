import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

import { RecommendationLubricatorHeaderData } from '@lsa/shared/models';
import { TranslocoModule } from '@ngneat/transloco';

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

  @Output() headerSelected = new EventEmitter<{ isRecommended: boolean }>();

  onHeaderSelected(checked: boolean): void {
    if (checked) {
      this.headerSelected.emit({
        isRecommended: this.headerData.isRecommended,
      });
    }
  }
}
