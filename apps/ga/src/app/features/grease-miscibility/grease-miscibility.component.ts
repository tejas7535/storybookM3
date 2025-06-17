import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { TranslocoService } from '@jsverse/transloco';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { CalculationParametersFacade, SettingsFacade } from '@ga/core/store';
import { GreaseDisclaimerComponent } from '@ga/shared/components/grease-disclaimer/grease-disclaimer.component';
import { QualtricsInfoBannerComponent } from '@ga/shared/components/qualtrics-info-banner/qualtrics-info-banner.component';
import { QuickBearingSelectionComponent } from '@ga/shared/components/quick-bearing-selection';
import { SelectedCompetitorGreaseComponent } from '@ga/shared/components/selected-competitor-grease/selected-competitor-grease.component';

import { GreaseCalculationPath } from '../grease-calculation/grease-calculation-path.enum';
import { GreaseCardComponent } from './grease-card/grease-card.component';

@Component({
  selector: 'ga-grease-selection',
  templateUrl: './grease-miscibility.component.html',
  imports: [
    SubheaderModule,
    SharedTranslocoModule,
    MatCardModule,
    MatIconModule,
    QualtricsInfoBannerComponent,
    QuickBearingSelectionComponent,
    GreaseCardComponent,
    GreaseDisclaimerComponent,
    SelectedCompetitorGreaseComponent,
  ],
})
export class GreaseMiscibilityComponent {
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  private readonly calculationParametersFacade = inject(
    CalculationParametersFacade
  );

  private readonly settingsFacade = inject(SettingsFacade);

  public mixableSchaefflerGreases = toSignal(
    this.calculationParametersFacade.mixableSchaefflerGreases$,
    { initialValue: [] }
  );

  public isPartnerVersion = toSignal(this.settingsFacade.partnerVersion$);

  public currentLanguage = toSignal(this.translocoService.langChanges$);

  public navigateBack(): void {
    this.router.navigate([
      `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.BearingPath}`,
    ]);
  }
}
