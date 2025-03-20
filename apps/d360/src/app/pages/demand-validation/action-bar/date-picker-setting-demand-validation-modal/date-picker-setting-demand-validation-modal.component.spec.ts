import { MatDialogRef } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { DemandValidationDatePickerComponent } from '../demand-validation-date-picker/demand-validation-date-picker.component';
import { Stub } from './../../../../shared/test/stub.class';
import { DatePickerSettingDemandValidationModalComponent } from './date-picker-setting-demand-validation-modal.component';

describe('DatePickerSettingDemandValidationModalComponent', () => {
  let spectator: Spectator<DatePickerSettingDemandValidationModalComponent>;

  const createComponent = createComponentFactory({
    component: DatePickerSettingDemandValidationModalComponent,
    imports: [MockComponent(DemandValidationDatePickerComponent)],
    providers: [
      Stub.getMatDialogDataProvider({
        range1: {
          from: new Date(),
          to: new Date(),
          period: 'WEEKLY',
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
    spectator = createComponent({
      props: {
        data: {
          range1: {
            from: new Date(),
            to: new Date(),
            period: 'WEEKLY',
          },
        },
        close: () => {},
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
