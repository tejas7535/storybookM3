import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import {
  CalculationParametersFacade,
  CalculationResultFacade,
  ProductSelectionFacade,
  SettingsFacade,
} from '@ea/core/store';
import { AppStoreButtonsComponent } from '@ea/shared/app-store-buttons/app-store-buttons.component';
import { QualtricsInfoBannerComponent } from '@ea/shared/qualtrics-info-banner/qualtrics-info-banner.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { CalculationIndicationMobileComponent } from '../calculation-indication-mobile/calculation-indication-mobile.component';
import { CalculationParametersComponent } from '../calculation-parameters/calculation-parameters.component';
import { CalculationResultPreviewComponent } from '../calculation-result-preview/calculation-result-preview.component';
import { CalculationTypesSelectionComponent } from '../calculation-types-selection/calculation-types-selection.component';

@Component({
  selector: 'ea-calculation-container',
  templateUrl: './calculation-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatDividerModule,
    PushPipe,
    CalculationParametersComponent,
    CalculationTypesSelectionComponent,
    CalculationResultPreviewComponent,
    CalculationIndicationMobileComponent,
    AppStoreButtonsComponent,
    TranslocoPipe,
    QualtricsInfoBannerComponent,
  ],
})
export class CalculationContainerComponent {
  public isStandalone$ = this.settingsFacade.isStandalone$;
  public isResultPreviewSticky$ = this.settingsFacade.isResultPreviewSticky$;
  public isKeyboardVisible$ = this.settingsFacade.isMobileKeyboardVisible$;
  public isAnyServiceLoading$ =
    this.calculationParametersFacade.isAnyServiceLoading$;
  public isCalculationResultAvailable$ =
    this.calculationResultFacade.isCalculationResultReportAvailable$;

  public bearingDesignation$ = this.productSelectionFacade.bearingDesignation$;

  constructor(
    private readonly settingsFacade: SettingsFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly calculationResultFacade: CalculationResultFacade,
    private readonly productSelectionFacade: ProductSelectionFacade
  ) {}
}
