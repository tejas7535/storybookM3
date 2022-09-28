import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  RotaryControlComponent,
  RotaryControlItem,
} from '@schaeffler/controls';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { GreaseConcep1Suitablity } from '../../models';

@Component({
  selector: 'ga-grease-report-concept1',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    RotaryControlComponent,
  ],
  templateUrl: './grease-report-concept1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseReportConcept1Component {
  @Input() public settings: GreaseConcep1Suitablity;

  private readonly monthsWithNumber = [0, 1, 3, 6, 9, 12];
  public duration = 5;
  public availableMonths: RotaryControlItem[] = Array.from(
    { length: 13 },
    (_, index) => ({
      label: this.monthsWithNumber.includes(index) ? index.toString() : '',
      highlight: index === 0,
    })
  );

  public getDurationMonths(): number {
    return this.settings?.c1_125 || this.settings?.c1_60;
  }

  public getDurationSize(): string {
    return this.settings?.c1_125 ? '125' : this.settings?.c1_60 && '60';
  }
}
