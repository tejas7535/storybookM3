import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { toggleSplitType as toggleSelectedSplitTypeCompare } from '@cdba/compare/store';
import { toggleSplitType as toggleSelectedSplitTypeDetail } from '@cdba/core/store';
import { COMPARE_STATE_MOCK, DETAIL_STATE_MOCK } from '@cdba/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { ToggleSplitTypeButtonModule } from '../../button/toggle-split-type-button/toggle-split-type-button.module';
import { CostElementsStatusBarComponent } from './cost-elements-status-bar.component';

describe('CostElementsStatusBarComponent', () => {
  let spectator: Spectator<CostElementsStatusBarComponent>;
  let component: CostElementsStatusBarComponent;

  let store: MockStore;

  const createComponent = createComponentFactory({
    component: CostElementsStatusBarComponent,
    imports: [ReactiveComponentModule, MockModule(ToggleSplitTypeButtonModule)],
    providers: [
      provideMockStore({
        initialState: {
          detail: DETAIL_STATE_MOCK,
          compare: COMPARE_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleSelectedSplitType', () => {
    it('should dispatch detail action if index is undefined', () => {
      const index: number = undefined;
      component.agInit({ context: { index } } as IStatusPanelParams);
      store.dispatch = jest.fn();

      component.toggleSelectedSplitType();

      expect(store.dispatch).toHaveBeenCalledWith(
        toggleSelectedSplitTypeDetail()
      );
    });

    it('should dispatch compare action if index is defined', () => {
      const index = 1;
      component.agInit({ context: { index } } as IStatusPanelParams);
      store.dispatch = jest.fn();

      component.toggleSelectedSplitType();

      expect(store.dispatch).toHaveBeenCalledWith(
        toggleSelectedSplitTypeCompare()
      );
    });
  });
});
