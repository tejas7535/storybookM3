import { CommonModule } from '@angular/common';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ColDef, IToolPanelParams } from 'ag-grid-enterprise';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FilterComponent } from '@cdba/shared/components/filter/filter.component';

import { NavigateColumnsPanelComponent } from './navigate-columns-panel.component';

jest.mock('../../column-utils', () => ({
  getVisibleColumns: jest.fn(
    () =>
      [
        { colId: 'col1', hide: undefined },
        { colId: 'col3', hide: undefined },
      ] as ColDef[]
  ),
}));

describe('NavigateColumnsPanelComponent', () => {
  let spectator: Spectator<NavigateColumnsPanelComponent>;
  let component: NavigateColumnsPanelComponent;

  const createComponent = createComponentFactory({
    component: NavigateColumnsPanelComponent,
    imports: [
      CommonModule,
      MockComponent(FilterComponent),
      provideTranslocoTestingModule({ en: {} }),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should initialize with visible columns', () => {
      const mockParams = {
        api: {
          getColumnDefs: jest.fn(() => [
            { colId: 'col1', hide: undefined },
            { colId: 'col2', hide: true },
            { colId: 'col3', hide: undefined },
          ]),
          addEventListener: jest.fn(),
        },
      } as unknown as IToolPanelParams;

      component.agInit(mockParams);

      expect(mockParams.api.addEventListener).toHaveBeenCalledWith(
        'gridReady',
        expect.any(Function)
      );
      expect(mockParams.api.addEventListener).toHaveBeenCalledWith(
        'columnVisible',
        expect.any(Function)
      );
    });
  });

  describe('onNavigate', () => {
    it('should navigate to a column and flash it', () => {
      const colDef = { colId: 'col1' };
      component['params'] = {
        api: {
          ensureColumnVisible: jest.fn(),
          flashCells: jest.fn(),
        },
      } as unknown as IToolPanelParams;

      component.onNavigate(colDef);

      expect(component['params'].api.ensureColumnVisible).toHaveBeenCalledWith(
        'col1',
        'middle'
      );
      expect(component['params'].api.flashCells).toHaveBeenCalledWith({
        columns: ['col1'],
      });
    });

    describe('updateView', () => {
      it('should update visibleColDefsSubject with visible columns and clear filter input', () => {
        const mockParams = {
          api: {
            getColumnDefs: jest.fn(() => [
              { colId: 'col1', hide: undefined },
              { colId: 'col2', hide: true },
              { colId: 'col3', hide: undefined },
            ]),
          },
        } as unknown as IToolPanelParams;

        component.filterInput = 'test';
        component['params'] = mockParams;

        component.updateView();

        component.visibleColDefs$.subscribe((visibleColDefs) => {
          expect(visibleColDefs).toEqual([
            { colId: 'col1', hide: undefined },
            { colId: 'col3', hide: undefined },
          ]);
        });

        expect(component.filterInput).toBe('');
      });
    });

    describe('onFilter', () => {
      it('should reset visible columns if filter input is empty', () => {
        component.invariantVisibleColumns = [{ colId: 'test' } as ColDef];

        component.onFilter('');

        component.visibleColDefs$.subscribe((visibleColDefs) => {
          expect(visibleColDefs).toEqual([{ colId: 'test' } as ColDef]);
        });
      });

      it('should filter visible columns based on filter input', () => {
        component.invariantVisibleColumns = [
          { headerName: 'test' } as ColDef,
          { headerName: 'tESt' } as ColDef,
          { headerName: 'headerName' } as ColDef,
        ];

        component.onFilter('es');

        component.visibleColDefs$.subscribe((visibleColDefs) => {
          expect(visibleColDefs).toEqual([
            { headerName: 'test' } as ColDef,
            { headerName: 'tESt' } as ColDef,
          ]);
        });
      });
    });
  });
});
