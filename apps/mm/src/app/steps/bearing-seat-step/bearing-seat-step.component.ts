import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  Bearing,
  StepSelectionValue,
} from '@mm/core/store/models/calculation-selection-state.model';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { PictureCardModule } from '@schaeffler/picture-card';

import { SelectionCardsComponent } from '../../shared/components/selection-cards/selection-cards.component';

@Component({
  selector: 'mm-bearing-seat-step',
  templateUrl: './bearing-seat-step.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PictureCardModule, LoadingSpinnerModule, SelectionCardsComponent],
})
export class BearingSeatStepComponent {
  public selectedOption = output<string>();
  bearing = input.required<Bearing>();
  bearingSeats = input.required<StepSelectionValue>();

  cardAction(selectionId: string): void {
    this.selectedOption.emit(selectionId);
  }
}
