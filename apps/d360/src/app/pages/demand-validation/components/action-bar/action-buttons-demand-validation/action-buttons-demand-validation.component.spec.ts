import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { getBackendRoles } from '@schaeffler/azure-auth';

import { PlanningView } from '../../../../../feature/demand-validation/planning-view';
import { ActionButtonsDemandValidationComponent } from './action-buttons-demand-validation.component';

describe('ActionButtonsDemandValidationComponent', () => {
  let spectator: Spectator<ActionButtonsDemandValidationComponent>;

  const createComponent = createComponentFactory({
    component: ActionButtonsDemandValidationComponent,
    providers: [
      provideMockStore({
        selectors: [{ selector: getBackendRoles, value: [] }],
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        planningView: PlanningView.REQUESTED,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
