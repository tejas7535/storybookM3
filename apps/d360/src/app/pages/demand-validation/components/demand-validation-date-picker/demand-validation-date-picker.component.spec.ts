import { FormControl, FormGroup } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import {
  DemandValidationDatePickerComponent,
  DemandValidationDatePickerFormControls,
} from './demand-validation-date-picker.component';

describe('DemandValidationDatePickerComponent', () => {
  let spectator: Spectator<DemandValidationDatePickerComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationDatePickerComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        controls: {
          periodType1: new FormControl({ id: '1', text: '' }),
          periodType2: new FormControl({ id: '1', text: '' }),
          endDatePeriod1: new FormControl({ id: '1', text: '' }),
          endDatePeriod2: new FormControl({ id: '1', text: '' }),
          startDatePeriod1: new FormControl({ id: '1', text: '' }),
          startDatePeriod2: new FormControl({ id: '1', text: '' }),
          formGroup: new FormGroup({ period1: new FormControl({}) }),
        } as DemandValidationDatePickerFormControls,
        disableOptionalDate: true,
        periodTypes: [{ id: '1', text: 'WEEKLY' }],
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
