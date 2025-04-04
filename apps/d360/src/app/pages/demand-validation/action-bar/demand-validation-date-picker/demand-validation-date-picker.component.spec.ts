import { FormControl, FormGroup } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { DateRangePeriod } from './../../../../shared/utils/date-range';
import { DemandValidationDatePickerComponent } from './demand-validation-date-picker.component';

describe('DemandValidationDatePickerComponent', () => {
  let spectator: Spectator<DemandValidationDatePickerComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationDatePickerComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        periodType1: new FormControl({ id: '1', text: '' }),
        periodType2: new FormControl({ id: '1', text: '' }),
        endDatePeriod1: new FormControl({ id: '1', text: '' }),
        endDatePeriod2: new FormControl({ id: '1', text: '' }),
        startDatePeriod1: new FormControl({ id: '1', text: '' }),
        startDatePeriod2: new FormControl({ id: '1', text: '' }),
        formGroup: new FormGroup({ period1: new FormControl({}) }),
        disableOptionalDate: true,
        periodTypes: [{ id: '1', text: DateRangePeriod.Weekly }],
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
