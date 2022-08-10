import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { RowSelectedEvent } from 'ag-grid-community';

import { ActionsCellRendererComponent } from './actions-cell-renderer/actions-cell-renderer.component';
import { ColumnDefinitionService } from './config';
import { DrawingsTableComponent } from './drawings-table.component';

describe('DrawingsTableComponent', () => {
  let component: DrawingsTableComponent;
  let spectator: Spectator<DrawingsTableComponent>;

  const createComponent = createComponentFactory({
    component: DrawingsTableComponent,
    declarations: [ActionsCellRendererComponent],
    imports: [AgGridModule],
    providers: [
      mockProvider(ColumnDefinitionService, { COLUMN_DEFINITIONS: [] }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onRowSelected', () => {
    const event = {
      node: {
        id: 2,
      },
      api: {
        getSelectedRows: jest.fn(() => [{}]),
      },
    } as unknown as RowSelectedEvent;

    it('should emit selectionChange event', () => {
      component.selectionChange.emit = jest.fn();
      const expected = { nodeId: 2, drawing: {} };

      component.onRowSelected(event);

      expect(component.selectionChange.emit).toHaveBeenCalledWith(expected);
    });
  });
});
