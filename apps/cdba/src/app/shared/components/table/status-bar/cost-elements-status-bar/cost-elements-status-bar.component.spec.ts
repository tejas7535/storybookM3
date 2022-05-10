import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { ToggleSplitTypeButtonModule } from '../../button/toggle-split-type-button/toggle-split-type-button.module';
import { CostElementsStatusBarComponent } from './cost-elements-status-bar.component';

describe('CostElementsStatusBarComponent', () => {
  let spectator: Spectator<CostElementsStatusBarComponent>;
  const createComponent = createComponentFactory({
    component: CostElementsStatusBarComponent,
    imports: [ReactiveComponentModule, MockModule(ToggleSplitTypeButtonModule)],
    providers: [
      provideMockStore({ initialState: { detail: DETAIL_STATE_MOCK } }),
    ],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
