import { CommonModule } from '@angular/common';
import { Component, input, model, output } from '@angular/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PlanningView } from '../../../../feature/demand-validation/planning-view';

@Component({
  selector: 'd360-demand-validation-setting-modal',
  standalone: true,
  imports: [CommonModule, SharedTranslocoModule, MatRadioModule],
  templateUrl: './demand-validation-setting-modal.component.html',
})
export class DemandValidationSettingModalComponent {
  public readonly data = model.required<PlanningView>();
  public readonly close = input.required<() => void>();
  public selectionChange = output<PlanningView>();

  protected readonly PlanningView = PlanningView;

  protected handleSettingsChange(event: MatRadioChange) {
    this.selectionChange.emit(event.value);
  }
}
