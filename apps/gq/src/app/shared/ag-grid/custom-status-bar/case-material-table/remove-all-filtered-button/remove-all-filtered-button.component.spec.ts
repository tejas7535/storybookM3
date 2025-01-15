import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { GridApi } from 'ag-grid-enterprise';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RemoveAllFilteredButtonComponent } from './remove-all-filtered-button.component';

describe('RemoveAllFilteredButtonComponent', () => {
  let component: RemoveAllFilteredButtonComponent;
  let spectator: Spectator<RemoveAllFilteredButtonComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: RemoveAllFilteredButtonComponent,
    declarations: [RemoveAllFilteredButtonComponent],
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [provideMockStore({}), mockProvider(MatDialog)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set isCaseView to true if params.isCaseView is true', () => {
      component.agInit({
        isCaseView: true,
        api: { addEventListener: jest.fn() },
      } as any);
      expect(component['isCaseView']).toBeTruthy();
      expect(component['gridApi'].addEventListener).toHaveBeenCalled();
      expect(component['gridApi']).toBeTruthy();
    });
  });

  describe('onFilterChanged', () => {
    test('should set filterSet to true if filterModel is not empty', () => {
      component['gridApi'] = {
        getFilterModel: jest.fn().mockReturnValue({ test: 'test' }),
      } as unknown as GridApi;
      component.onFilterChanged();
      expect(component['filterSet']).toBeTruthy();
    });
    test('should set filterSet to false if filterModel is empty', () => {
      component['gridApi'] = {
        getFilterModel: jest.fn().mockReturnValue({}),
      } as unknown as GridApi;
      component.onFilterChanged();
      expect(component['filterSet']).toBeFalsy();
    });
  });

  describe('openConfirmDialog', () => {
    test('should call removeAllFiltered if dialog is closed with true', () => {
      component['filterSet'] = true;
      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: () => of(true),
          }) as any
      );
      component.removeAllFiltered = jest.fn();
      component.openConfirmDialog();
      expect(component['dialog'].open).toHaveBeenCalled();
      expect(component.removeAllFiltered).toHaveBeenCalled();
    });

    test('should NOT call removeAllFiltered if dialog is closed with false', () => {
      component['filterSet'] = true;
      component['dialog'].open = jest.fn(
        () =>
          ({
            afterClosed: () => of(false),
          }) as any
      );
      component.removeAllFiltered = jest.fn();
      component.openConfirmDialog();
      expect(component['dialog'].open).toHaveBeenCalled();
      expect(component.removeAllFiltered).not.toHaveBeenCalled();
    });
  });

  describe('removeAllFiltered', () => {
    test('should dispatch action for CaseView', () => {
      component['isCaseView'] = true;
      const mockRowData = { data: { id: 123 } };
      component['gridApi'] = {
        forEachNodeAfterFilterAndSort: jest.fn((callback) =>
          callback(mockRowData)
        ),
        setFilterModel: jest.fn(),
      } as unknown as GridApi;

      mockStore.dispatch = jest.fn();
      component.removeAllFiltered();
      expect(mockStore.dispatch).toHaveBeenCalledWith({
        id: 123,
        type: '[Create Case] Delete Item from Customer Table',
      });
    });

    test('should dispatch action for ProcessCaseView', () => {
      component['isCaseView'] = false;
      const mockRowData = { data: { id: 123 } };
      component['gridApi'] = {
        forEachNodeAfterFilterAndSort: jest.fn((callback) =>
          callback(mockRowData)
        ),
        setFilterModel: jest.fn(),
      } as unknown as GridApi;

      mockStore.dispatch = jest.fn();
      component.removeAllFiltered();
      expect(mockStore.dispatch).toHaveBeenCalledWith({
        id: 123,
        type: '[Process Case] Delete Item From Material Table',
      });
    });
  });
});
