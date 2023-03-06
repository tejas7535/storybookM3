import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { Rating } from './models/rating.enum';

@Component({
  selector: 'gq-kpi-status-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, SharedTranslocoModule],
  templateUrl: './kpi-status-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiStatusCardComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() kpiValue?: string;
  @Input() rating?: Rating;

  public readonly ratingStatus = Rating;
  public get ratingText(): string {
    return Rating[this.rating];
  }
}
