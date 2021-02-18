import { MatSelectModule } from '@angular/material/select';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SelectSalesOrgComponent } from './select-sales-org.component';

describe('SelectSalesOrgComponent', () => {
  let component: SelectSalesOrgComponent;
  let spectator: Spectator<SelectSalesOrgComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: SelectSalesOrgComponent,
    imports: [
      provideTranslocoTestingModule({}),
      MatSelectModule,
      ReactiveComponentModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          case: {
            customer: {
              salesOrgs: [],
            },
          },
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
      const event = ({ value: '1234' } as unknown) as any;

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
