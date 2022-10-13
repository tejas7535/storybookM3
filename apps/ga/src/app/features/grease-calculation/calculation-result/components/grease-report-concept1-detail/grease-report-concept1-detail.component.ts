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

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import {
  RotaryControlComponent,
  RotaryControlItem,
} from '@schaeffler/controls';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MEDIASGREASE } from '../../constants';
import {
  availableMonths,
  concept1InShop,
  concept1ShopQuery,
  shortTitle,
} from '../../helpers/grease-helpers';
import {
  CONCEPT1,
  CONCEPT1_SIZES,
  GreaseConcep1Suitablity,
} from '../../models';
import { shopSearchPathBase } from '../grease-report-result';

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
  ],
  templateUrl: './grease-report-concept1-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreaseReportConcept1DetailComponent implements OnInit {
  @Input() public settings: GreaseConcep1Suitablity;
  @Input() public title: string;

  @Output() readonly hideDetails: EventEmitter<void> = new EventEmitter();

  public availableMonths: RotaryControlItem[] = availableMonths;
  public concept1Selection: CONCEPT1_SIZES;

  public sizes = [CONCEPT1_SIZES['60ML'], CONCEPT1_SIZES['125ML']];

  public constructor(
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

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

  public getShortTitle(): string {
    return shortTitle(this.title);
  }

  public getConcept1InfoUrl(): string {
    return `${translate('calculationResult.shopBaseUrl')}/${translate(
      'calculationResult.concept1Link'
    )}`;
  }

  public getConcept1InShop(): string {
    return concept1InShop(this.title, this.concept1Selection);
  }

  public getConcept1ShopUrl(): string {
    return `${translate(
      'calculationResult.shopBaseUrl'
    )}/${shopSearchPathBase}${concept1ShopQuery(
      this.title,
      this.concept1Selection
    )}`;
  }

  public trackConcept1Selection(): void {
    this.applicationInsightsService.logEvent(MEDIASGREASE, {
      grease: `${CONCEPT1} ${this.getShortTitle()} ${this.concept1Selection}`,
    });
  }
}
