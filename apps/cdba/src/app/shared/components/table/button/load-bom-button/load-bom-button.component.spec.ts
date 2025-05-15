import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { GridApi, IStatusPanelParams, RowNode } from 'ag-grid-enterprise';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { selectCalculation } from '@cdba/core/store';
import { Calculation } from '@cdba/shared/models';
import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import { LoadBomButtonComponent } from './load-bom-button.component';

const getSelectedNodes = jest.fn();

describe('LoadBomButtonComponent', () => {
  let spectator: Spectator<LoadBomButtonComponent>;
  let component: LoadBomButtonComponent;
  let store: MockStore;
  let params: IStatusPanelParams;

  const mockRowNodeDefault: Partial<RowNode> = {
    id: '1',
    data: { foo: 'bar' },
  };

  const mockRowNodeRfq: Partial<RowNode> = {
    id: '1',
    data: { foo: 'bar', costType: 'RFQ' },
  };

  const createComponent = createComponentFactory({
    component: LoadBomButtonComponent,
    imports: [
      MatButtonModule,
      MatTooltipModule,
      RouterModule.forRoot([]),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({ initialState: { detail: DETAIL_STATE_MOCK } }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    component['gridApi'] = {} as unknown as GridApi;

    store = spectator.inject(MockStore);
  });

  describe('default calculation', () => {
    beforeEach(() => {
      getSelectedNodes.mockReturnValue([mockRowNodeDefault]);
      params = {
        api: {
          getSelectedNodes,
        },
      } as unknown as IStatusPanelParams;
    });

    test('should dispatch selectCalculation action on loadBom call', () => {
      store.dispatch = jest.fn();

      component['gridApi'] = params.api;
      component.loadBom();

      expect(store.dispatch).toHaveBeenCalledWith(
        selectCalculation({
          nodeId: mockRowNodeDefault.id,
          calculation: mockRowNodeDefault.data as unknown as Calculation,
        })
      );
    });
  });

  describe('RFQ calculation', () => {
    getSelectedNodes.mockReturnValue([mockRowNodeRfq]);
    params = {
      api: {
        getSelectedNodes,
      },
    } as unknown as IStatusPanelParams;

    test('should cause a disabled button', () => {
      component['gridApi'] = params.api;

      expect(spectator.query('button')).toBeDisabled();
      expect(spectator.query('div')).toHaveClass('mat-mdc-tooltip-trigger');
    });
  });
});
