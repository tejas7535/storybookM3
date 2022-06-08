import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetModule, PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../testing/mocks';
import { SelectSalesOrgComponent } from './select-sales-org.component';

describe('SelectSalesOrgComponent', () => {
  let component: SelectSalesOrgComponent;
  let spectator: Spectator<SelectSalesOrgComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: SelectSalesOrgComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatSelectModule,
      MockModule(LetModule),
      MockModule(PushModule),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          case: CREATE_CASE_STORE_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectionChange', () => {
    test('should dispatch action', () => {
      mockStore.dispatch = jest.fn();
      const event = { value: '1234' } as unknown as any;

      component.selectionChange(event);

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    });
  });
  describe('trackByFn()', () => {
    test('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
