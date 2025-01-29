import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { GridApi, IRowNode, IStatusPanelParams } from 'ag-grid-enterprise';
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
    detectChanges: false,
    imports: [
      PushPipe,
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
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set grid api', () => {
      params = {
        api: {},
      } as unknown as IStatusPanelParams;

      component.agInit(params);

      expect(component.gridApi).toEqual(params.api);
    });
  });

  describe('ngOnInit', () => {
    it('should subscribe to selectedNodes$', () => {
      component.gridApi = {
        getRowNode: jest.fn((id) => {
          switch (id) {
            case '3': {
              return { id: 'node3' } as IRowNode;
            }
            case '4': {
              return { id: 'node4' } as IRowNode;
            }
            default: {
              return { id: '0' } as IRowNode;
            }
          }
        }),
      } as unknown as GridApi;

      component.ngOnInit();

      expect(component['selectedNodes']).toEqual([
        { id: 'node3' },
        { id: 'node4' },
      ]);
      expect(component.selectedNodesSubscription).toBeTruthy();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from selectedNodesSubscription', () => {
      component.selectedNodesSubscription = {
        unsubscribe: jest.fn(),
      } as any;

      component.ngOnDestroy();

      expect(
        component.selectedNodesSubscription.unsubscribe
      ).toHaveBeenCalled();
    });
  });
});
