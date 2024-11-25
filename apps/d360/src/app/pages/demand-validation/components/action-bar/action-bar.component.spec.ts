import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';

import { PlanningView } from '../../../../feature/demand-validation/planning-view';
import { CustomerEntry } from '../../../../feature/global-selection/model';
import { ActionBarComponent } from './action-bar.component';

jest.mock('@jsverse/transloco', () => ({
  translate: jest.fn((key, _) => `${key} mocked`),
}));

describe('ActionBarComponent', () => {
  let spectator: Spectator<ActionBarComponent>;

  const createComponent = createComponentFactory({
    component: ActionBarComponent,
    componentMocks: [],
    providers: [
      mockProvider(MatDialog, {
        open: jest.fn(),
      }),
      mockProvider(Store, {
        select: jest.fn().mockReturnValue(of({})),
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
