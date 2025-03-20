import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import { Stub } from './../../../../shared/test/stub.class';
import { DemandValidationSettingModalComponent } from './demand-validation-setting-modal.component';

describe('DemandValidationSettingModalComponent', () => {
  let spectator: Spectator<DemandValidationSettingModalComponent>;

  const createComponent = createComponentFactory({
    component: DemandValidationSettingModalComponent,
    componentMocks: [],
    providers: [Stub.getMatDialogDataProvider({})],
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
