import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  Bearing,
  StepSelectionValue,
} from '@mm/core/store/models/calculation-selection-state.model';
import { HorizontalSeparatorComponent } from '@mm/shared/components/horizontal-seperator/horizontal-separator.component';

import { SelectionCardsComponent } from '../../shared/components/selection-cards/selection-cards.component';

@Component({
  selector: 'mm-measuring-and-mounting-step',
  templateUrl: './measuring-and-mounting-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    SelectionCardsComponent,
    HorizontalSeparatorComponent,
  ],
})
export class MeasuringAndMountingStepComponent {
  mountingMethods = input.required<StepSelectionValue>();
  bearing = input.required<Bearing>();
  mountingMethodSelectionLabel = input.required<string>();
  measuringMethodLabel = input.required<string>();
  measurementMethods = input.required<StepSelectionValue>();

  public selectedOption = output<string>();
  public selectedMeasurementMethod = output<string>();

  measurementForm: FormGroup = new FormGroup({
    measurementMethod: new FormControl(undefined),
  });

  constructor() {
    effect(() => {
      const selectedValueId = this.measurementMethods()?.selectedValueId;
      if (
        this.measurementForm.get('measurementMethod')?.value !== selectedValueId
      ) {
        this.measurementForm.patchValue(
          { measurementMethod: selectedValueId },
          { emitEvent: false }
        );
      }
    });
  }

  cardAction(selectionId: string): void {
    this.selectedOption.emit(selectionId);
  }

  onMeasurementMethodChange(newValue: string): void {
    this.selectedMeasurementMethod.emit(newValue);
  }
}
