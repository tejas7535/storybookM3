import { MatDialog } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import { CustomerEntry } from '../../../../feature/global-selection/model';
import { ActionBarComponent } from './action-bar.component';

describe('ActionBarComponent', () => {
  let spectator: Spectator<ActionBarComponent>;

  const createComponent = createComponentFactory({
    component: ActionBarComponent,
    componentMocks: [],
    providers: [
      MockProvider(MatDialog, {
        open: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        currentCustomer: {} as CustomerEntry,
        customerData: [],
        planningView: PlanningView.REQUESTED,
        isMaterialListVisible: true,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
