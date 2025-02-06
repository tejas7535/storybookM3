import { By } from '@angular/platform-browser';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { GridApi } from 'ag-grid-enterprise';

import { TableToolbarComponent } from './table-toolbar.component';

describe('TableToolbarComponent', () => {
  let spectator: Spectator<TableToolbarComponent>;
  const createComponent = createComponentFactory({
    component: TableToolbarComponent,
  });
  const getFilterModelMock = jest.fn(() => ({}));

  beforeEach(() => {
    spectator = createComponent({
      props: {
        rowCount: 0,
        grid: {
          getFilterModel: getFilterModelMock,
          getColumnDefs: () => [] as any,
          setGridOption: () => [] as any,
          refreshHeader: () => [] as any,
        } as unknown as GridApi,
      },
    });
  });

  it('should not show the reset-filter button, when no filter is set in the grid', () => {
    const resetButton = spectator.debugElement.queryAll(
      By.css('button.mdc-icon-button')
    );
    expect(resetButton.length).toBe(0);
  });

  it('should show the reset-filter button, when a filter is set in the grid', () => {
    getFilterModelMock.mockImplementation(() => ({ id: 'asc' }));
    spectator.detectComponentChanges();
    const resetButton = spectator.debugElement.queryAll(
      By.css('button.mdc-icon-button')
    );
    expect(resetButton.length).toBe(1);
  });
});
