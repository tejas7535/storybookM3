import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';

import { translate } from '@ngneat/transloco';

import {
  RotaryControlComponent,
  RotaryControlItem,
} from '@schaeffler/controls';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PartnerVersion } from '@ga/shared/models';

import { availableMonths } from '../../helpers/grease-helpers';
import {
  CONCEPT1_SIZES,
  GreaseConcep1Suitablity,
  GreaseResult,
} from '../../models';
import { GreaseReportShopButtonsComponent } from '../grease-report-shop-buttons/grease-report-shop-buttons.component';

@Component({
  selector: 'ga-grease-report-concept1-detail',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    FormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatRadioModule,
    RotaryControlComponent,
    GreaseReportShopButtonsComponent,
  ],
  templateUrl: './grease-report-concept1-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseReportConcept1DetailComponent implements OnInit {
  @Input() public greaseResult: GreaseResult;
  @Input() public settings: GreaseConcep1Suitablity;
  @Input() partnerVersion?: `${PartnerVersion}`;

  @Output() readonly hideDetails: EventEmitter<void> = new EventEmitter();

  public availableMonths: RotaryControlItem[] = availableMonths;
  public concept1Selection: CONCEPT1_SIZES;

  public sizes = [CONCEPT1_SIZES['60ML'], CONCEPT1_SIZES['125ML']];

  ngOnInit(): void {
    this.concept1Selection = this.settings?.c1_125
      ? CONCEPT1_SIZES['125ML']
      : CONCEPT1_SIZES['60ML'];
  }

  public getDurationMonths(): number {
    return this.concept1Selection === CONCEPT1_SIZES['125ML']
      ? this.settings.c1_125
      : this.settings.c1_60;
  }

  public onHideDetails(): void {
    this.hideDetails.emit();
  }

  public disabledOption(size: string | CONCEPT1_SIZES): boolean {
    return !(this.settings as any)[`c1_${size}`];
  }

  public getConcept1InfoUrl(): string {
    return `${translate('calculationResult.shopBaseUrl')}/${translate(
      'calculationResult.concept1Link'
    )}`;
  }

  public getTooltip(size: number | CONCEPT1_SIZES): string {
    return size === CONCEPT1_SIZES['60ML']
      ? this.settings.hint_60
      : this.settings.hint_125;
  }
}
