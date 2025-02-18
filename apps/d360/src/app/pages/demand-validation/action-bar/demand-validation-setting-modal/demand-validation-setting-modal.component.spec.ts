import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import { DemandValidationSettingModalComponent } from './demand-validation-setting-modal.component';

describe('DemandValidationSettingModalComponent', () => {
  let spectator: Spectator<DemandValidationSettingModalComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationSettingModalComponent,
    componentMocks: [],
    providers: [
      MockProvider(MAT_DIALOG_DATA, {}),
      MockProvider(MatDialogRef<DemandValidationSettingModalComponent>, {
        close: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        data: PlanningView.CONFIRMED,
        close: () => {},
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
