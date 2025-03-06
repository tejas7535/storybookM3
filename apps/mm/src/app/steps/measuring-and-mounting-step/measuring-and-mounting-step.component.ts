import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
  output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
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

  public selectedOption = output<string>();

  public selectedMeasurementMethod = output<string>();

  measurementForm: FormGroup = new FormGroup({
    measurementMethod: new FormControl(undefined, Validators.required),
  });

  public measurementMethod: string | undefined;

  private _measurementMethods: StepSelectionValue | undefined;

  get measurementMethods(): StepSelectionValue | undefined {
    return this._measurementMethods;
  }

  @Input()
  set measurementMethods(value: StepSelectionValue | undefined) {
    this._measurementMethods = value;
    this.measurementMethod = value?.selectedValueId;
    this.measurementForm = new FormGroup({
      measurementMethod: new FormControl(
        value?.selectedValueId,
        Validators.required
      ),
    });
  }

  cardAction(selectionId: string): void {
    this.selectedOption.emit(selectionId);
  }

  onMeasurementMethodChange(newValue: string): void {
    this.selectedMeasurementMethod.emit(newValue);
  }

  resetMeasurementMethod() {
    this.measurementForm.markAsPristine();
    this.measurementForm.markAsUntouched();
    this.measurementForm.reset();
  }
}
