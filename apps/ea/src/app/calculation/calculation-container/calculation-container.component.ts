import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { SettingsFacade } from '@ea/core/store';
import { PushPipe } from '@ngrx/component';

import { CalculationParametersComponent } from '../calculation-parameters/calculation-parameters';
import { CalculationResultPreviewComponent } from '../calculation-result-preview/calculation-result-preview';
import { CalculationTypesSelectionComponent } from '../calculation-types-selection/calculation-types-selection';

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

  constructor(private readonly settingsFacade: SettingsFacade) {}
}
