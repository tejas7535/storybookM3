import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { Rating } from './models/rating.enum';

@Component({
  selector: 'gq-kpi-status-card',
  standalone: true,
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
    return Rating[this.rating];
  }
}
