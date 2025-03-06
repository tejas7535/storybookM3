import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { RecommendationSelectionRadioButtonComponent } from '../recommendation-selection-radio-button/recommendation-selection-radio-button';

@Component({
  selector: 'lsa-recommendation-selection-mobile',
  templateUrl: './recommendation-selection-mobile.html',
  imports: [
    CommonModule,
    MatRadioModule,
    SharedTranslocoModule,
    MatInputModule,
    RecommendationSelectionRadioButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationSelectionMobileComponent {
  @Input() hasRecommendedData: boolean;
  @Input() hasMinimumData: boolean;
  @Input() isRecommendedSelected: boolean;
  @Output() headerSelected = new EventEmitter<{ isRecommended: boolean }>();

  public readonly recommended = 'recommended';
  public readonly minimum = 'minimum';

  onSelectionChange(change: MatRadioChange): void {
    const resultValue = change.value === this.recommended ? true : false;
    this.headerSelected.emit({
      isRecommended: resultValue,
    });
  }
}
