import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { SettingsFacade } from '@ea/core/store';
import { PushPipe } from '@ngrx/component';

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
  ],
})
export class CalculationContainerComponent {
  public isStandalone$ = this.settingsFacade.isStandalone$;
  public isResultPreviewSticky$ = this.settingsFacade.isResultPreviewSticky$;
  public isKeyboardVisible$ = this.settingsFacade.isMobileKeyboardVisible$;

  constructor(private readonly settingsFacade: SettingsFacade) {}
}
