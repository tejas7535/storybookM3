import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { TagComponent } from '@schaeffler/tag';

import { GreaseReportShopButtonsComponent } from '@ga/features/grease-calculation/calculation-result/components/grease-report-shop-buttons/grease-report-shop-buttons.component';
import {
  GreaseConcep1Suitablity,
  GreaseResultData,
  SUITABILITY_LABEL,
} from '@ga/features/grease-calculation/calculation-result/models';

@Component({
  selector: 'ga-grease-card',
  templateUrl: './grease-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TagComponent,
    MatIconModule,
    MatCardModule,
    GreaseReportShopButtonsComponent,
  ],
})
export class GreaseCardComponent {
  title = input<string>('');
  description = input<Record<string, string> | string>('');
  tagLabel = input<string>('');
  imgSrc = input<string>('');
  currentLanguage = input.required<string>();

  getLocalizedDescription = computed(() => {
    const descriptionValue = this.description();
    if (!descriptionValue) {
      return '';
    }

    if (typeof descriptionValue === 'string') {
      return descriptionValue;
    }

    return (
      descriptionValue[this.currentLanguage()] || descriptionValue['en'] || ''
    );
  });

  greaseResult = computed(() => ({
    mainTitle: this.title(),
    subTitle: 'anything not used in view',
    isSufficient: true,
    dataSource: [] as GreaseResultData,
  }));

  settings: GreaseConcep1Suitablity = {
    label: SUITABILITY_LABEL.SUITED,
    hint: '',
    c1_60: 0,
    c1_125: 0,
  };
}
