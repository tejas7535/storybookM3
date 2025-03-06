import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Rating } from '@gq/shared/models/rating.enum';
import { getRatingText } from '@gq/shared/utils/misc.utils';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-kpi-status-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    SharedTranslocoModule,
  ],
  templateUrl: './kpi-status-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiStatusCardComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() kpiValue?: string;
  @Input() rating?: Rating;
  @Input() warning?: boolean;
  @Input() warningInfo?: string;

  public readonly ratingStatus = Rating;
  public get ratingText(): string {
    return getRatingText(this.rating);
  }
}
