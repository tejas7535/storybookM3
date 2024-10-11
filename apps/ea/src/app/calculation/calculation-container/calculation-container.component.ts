import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import {
  CalculationParametersFacade,
  CalculationResultFacade,
  SettingsFacade,
} from '@ea/core/store';
import { PushPipe } from '@ngrx/component';

import { CalculationIndicationMobileComponent } from '../calculation-indication-mobile/calculation-indication-mobile.component';
import { CalculationParametersComponent } from '../calculation-parameters/calculation-parameters.component';
import { CalculationResultPreviewComponent } from '../calculation-result-preview/calculation-result-preview.component';
import { CalculationTypesSelectionComponent } from '../calculation-types-selection/calculation-types-selection.component';

@Component({
  selector: 'ea-calculation-container',
  templateUrl: './calculation-container.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatDividerModule,
    PushPipe,
    CalculationParametersComponent,
    CalculationTypesSelectionComponent,
    CalculationResultPreviewComponent,
    CalculationIndicationMobileComponent,
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

  constructor(
    private readonly settingsFacade: SettingsFacade,
    private readonly calculationParametersFacade: CalculationParametersFacade,
    private readonly calculationResultFacade: CalculationResultFacade
  ) {}
}
