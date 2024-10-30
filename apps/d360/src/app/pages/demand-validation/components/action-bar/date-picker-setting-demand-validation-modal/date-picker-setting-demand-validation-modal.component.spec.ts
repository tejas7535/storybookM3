import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent, MockProvider } from 'ng-mocks';

import { DemandValidationDatePickerComponent } from '../../demand-validation-date-picker/demand-validation-date-picker.component';
import { DatePickerSettingDemandValidationModalComponent } from './date-picker-setting-demand-validation-modal.component';

describe('DatePickerSettingDemandValidationModalComponent', () => {
  let spectator: Spectator<DatePickerSettingDemandValidationModalComponent>;

  const createComponent = createComponentFactory({
    component: DatePickerSettingDemandValidationModalComponent,
    imports: [MockComponent(DemandValidationDatePickerComponent)],
    providers: [
      MockProvider(MAT_DIALOG_DATA, {
        range1: {
          from: new Date(),
          to: new Date(),
        },
      }),
      mockProvider(
        MatDialogRef<DatePickerSettingDemandValidationModalComponent>,
        {
          close: jest.fn(),
        }
      ),
    ],
  });
  beforeEach(() => {
    spectator = createComponent({});
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
