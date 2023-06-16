import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import {
  RotaryControlComponent,
  RotaryControlItem,
} from '@schaeffler/controls';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  availableMonths,
  isGreaseSuited,
  isGreaseUnSuited,
} from '../../helpers/grease-helpers';
import { CONCEPT1_SIZES, GreaseConcep1Suitablity } from '../../models';

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

  @Output() readonly showDetails: EventEmitter<void> = new EventEmitter();

  public availableMonths: RotaryControlItem[] = availableMonths;

  public getDurationMonths(): number {
    return this.settings?.c1_125 || this.settings?.c1_60;
  }

  public getDurationSize(): CONCEPT1_SIZES {
    return this.settings?.c1_125
      ? CONCEPT1_SIZES['125ML']
      : this.settings?.c1_60 && CONCEPT1_SIZES['60ML'];
  }

  public onShowDetails(): void {
    if (this.getDurationMonths()) {
      this.showDetails.emit();
    }
  }

  public isSuited(): boolean {
    return isGreaseSuited(this.settings.label);
  }

  public isUnSuited(): boolean {
    return isGreaseUnSuited(this.settings.label);
  }
}
