import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

import { IStatusPanelParams } from '@ag-grid-enterprise/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { selectCalculation } from '@cdba/core/store';
import { Calculation } from '@cdba/shared/models';
import { SharedModule } from '@cdba/shared/shared.module';
import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import { LoadBomButtonComponent } from './load-bom-button.component';

describe('LoadBomButtonComponent', () => {
  let spectator: Spectator<LoadBomButtonComponent>;
  let component: LoadBomButtonComponent;
  let store: MockStore;

  const params: IStatusPanelParams = {
    api: {
      getSelectedNodes: jest.fn(() => [{ id: '1', data: { foo: 'bar' } }]),
    },
  } as unknown as IStatusPanelParams;

  const createComponent = createComponentFactory({
    component: LoadBomButtonComponent,
    imports: [
      SharedModule,
      MatButtonModule,
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({ initialState: { detail: DETAIL_STATE_MOCK } }),
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

  describe('agInit', () => {
    test('should set params and add listeners', () => {
      component.agInit(params as unknown as IStatusPanelParams);

      expect(component['gridApi']).toEqual(params.api);
    });
  });

  describe('loadBom', () => {
    test('should dispatch selectCalculation action', () => {
      store.dispatch = jest.fn();

      component['gridApi'] = params.api;
      component.loadBom();

      expect(store.dispatch).toHaveBeenCalledWith(
        selectCalculation({
          nodeId: '1',
          calculation: { foo: 'bar' } as unknown as Calculation,
        })
      );
    });
  });
});
