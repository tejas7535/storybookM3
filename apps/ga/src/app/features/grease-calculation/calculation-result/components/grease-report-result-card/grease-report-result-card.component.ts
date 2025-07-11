import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { TranslocoModule } from '@jsverse/transloco';

import { TagComponent } from '@schaeffler/tag';

import { SettingsFacade } from '@ga/core/store';
import { BadgeComponent } from '@ga/shared/components/badge/badge.component';
import { PartnerVersion } from '@ga/shared/models';

import { GreaseResult, PreferredGreaseResult } from '../../models';
import { ResultSectionPipe } from '../../pipes/result-section.pipe';
import { GreaseShopService } from '../grease-report-shop-buttons/grease-shop.service';
import { GreaseImageResolver } from './grease-image-resolver.services';
import { GreaseReportResultCardSectionComponent } from './grease-report-result-card-section/grease-report-result-card-section.component';

@Component({
  selector: 'ga-grease-report-result-card',
  templateUrl: './grease-report-result-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
    GreaseReportResultCardSectionComponent,
    BadgeComponent,
    ResultSectionPipe,
    TagComponent,
    MatCheckboxModule,
  ],
})
export class GreaseReportResultCardComponent {
  private readonly settingsFacade = inject(SettingsFacade);
  private readonly shopService = inject(GreaseShopService);
  protected readonly greaseImageResolver = inject(GreaseImageResolver);

  public greaseResult = input.required<GreaseResult>();
  public preferredGreaseResult = input<PreferredGreaseResult>();
  public automaticLubrication = input(false);
  public selectionModeEnabled = input(false);
  public greaseSelected = input(false);

  public partnerVersion = toSignal(this.settingsFacade.partnerVersion$);
  public toggleSelection = output<string>();

  protected shopUrl = computed(() => {
    const partner = this.partnerVersion();
    const greaseName = this.greaseResult().mainTitle;

    return this.shopService.getShopUrl(greaseName, partner as PartnerVersion);
  });

  protected bundleSize = computed(() =>
    this.greaseResult().mainTitle === 'Arcanol LOAD1000' ? '180KG' : '1KG'
  );

  protected isAcanolGrease = computed(
    () => !this.greaseResult().mainTitle.includes('Non-Schaeffler')
  );

  protected emitEvent() {
    if (!this.selectionModeEnabled()) {
      return;
    }
    this.toggleSelection.emit(this.greaseResult().mainTitle);
  }
}
