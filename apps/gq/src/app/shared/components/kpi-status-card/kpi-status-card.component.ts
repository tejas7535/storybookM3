import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'gq-kpi-status-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './kpi-status-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiStatusCardComponent {
  @Input() title: string;
  @Input() subtitle: string;
  @Input() kpiValue?: string;
}
