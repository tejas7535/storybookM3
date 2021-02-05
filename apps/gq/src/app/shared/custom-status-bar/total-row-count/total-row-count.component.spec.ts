import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { getRoles } from '@schaeffler/auth';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks';
import { UserRoles } from '../../roles/user-roles.enum';
import { TotalRowCountComponent } from './total-row-count.component';

describe('TotalRowCountComponent', () => {
  let component: TotalRowCountComponent;
  let spectator: Spectator<TotalRowCountComponent>;
  let params: IStatusPanelParams;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: TotalRowCountComponent,
    declarations: [TotalRowCountComponent],
    imports: [
      MatButtonModule,
      MatIconModule,
      provideTranslocoTestingModule({}),
      ReactiveComponentModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          auth: {
            token: {},
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    params = ({
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn().mockReturnValue([QUOTATION_DETAIL_MOCK]),
        forEachLeafNode: jest.fn(),
      },
    } as unknown) as IStatusPanelParams;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set showMargins to true', () => {
      store.overrideSelector(getRoles, [UserRoles.COST_GPC]);

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.showMargins$).toBeTruthy();
    });
  });
  describe('onrowDataChanged', () => {
    beforeEach(() => {
      component['params'] = params;
      component.onSelectionChange = jest.fn();
    });
    test('should set margin and Value if data exists', () => {
      const rowNode = {
        data: {
          netValue: 10,
          margin: 15,
        },
      };
      component['params'].api.forEachLeafNode = jest.fn((callback) =>
        callback(rowNode as any)
      );

      component.rowValueChanges();

      expect(component.totalNetValue).toEqual(10);
      expect(component.totalMargin).toEqual(15);
      expect(component.onSelectionChange).toHaveBeenCalledTimes(1);
    });
    test('should not set if no data exists', () => {
      component.rowValueChanges();
      expect(component.totalNetValue).toEqual(0);
      expect(component.totalMargin).toEqual(0);
      expect(component.onSelectionChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
      expect(component.selectedMargin).toEqual(QUOTATION_DETAIL_MOCK.margin);
      expect(component.selectedNetValue).toEqual(
        QUOTATION_DETAIL_MOCK.netValue
      );
    });
  });
});
