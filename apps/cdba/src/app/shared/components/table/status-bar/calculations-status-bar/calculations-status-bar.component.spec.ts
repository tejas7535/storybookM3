import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { IStatusPanelParams } from 'ag-grid-enterprise';
import { MockModule } from 'ng-mocks';

import { ExcludedCalculationsModule } from '@cdba/shared/components/excluded-calculations';
import { CompareButtonModule } from '@cdba/shared/components/table/button/compare-button';
import { LoadBomButtonModule } from '@cdba/shared/components/table/button/load-bom-button';
import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import { CalculationsStatusBarComponent } from './calculations-status-bar.component';

describe('CalculationsStatusBarComponent', () => {
  let spectator: Spectator<CalculationsStatusBarComponent>;
  let component: CalculationsStatusBarComponent;
  let params: IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: CalculationsStatusBarComponent,
    imports: [
      PushModule,
      MockModule(CompareButtonModule),
      MockModule(ExcludedCalculationsModule),
      MockModule(LoadBomButtonModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          detail: DETAIL_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    params = {
      api: {
        getRowNode: jest.fn(),
      },
    } as unknown as IStatusPanelParams;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set grid api', () => {
      component.agInit(params);

      expect(component['gridApi']).toEqual(params.api);
    });
  });
});
