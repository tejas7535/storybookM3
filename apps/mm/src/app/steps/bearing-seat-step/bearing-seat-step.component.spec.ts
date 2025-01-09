import {
  Bearing,
  StepSelectionValue,
} from '@mm/core/store/models/calculation-selection-state.model';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { BearingSeatStepComponent } from './bearing-seat-step.component';

describe('BearingSeatStepComponent', () => {
  let spectator: Spectator<BearingSeatStepComponent>;
  let component: BearingSeatStepComponent;
  const createComponent = createComponentFactory({
    component: BearingSeatStepComponent,
    imports: [],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        bearing: {
          bearingId: '123',
        } as Bearing,
        bearingSeats: {} as StepSelectionValue,
      },
    });
    component = spectator.component;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selected option when cardAction is called', () => {
    const selectionId = 'test-selection-id';
    jest.spyOn(component.selectedOption, 'emit');

    component.cardAction(selectionId);

    expect(component.selectedOption.emit).toHaveBeenCalledWith(selectionId);
  });
});
