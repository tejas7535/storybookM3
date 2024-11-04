import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';

import { ColumnLayoutManagementModalComponent } from './column-layout-management-modal.component';

describe('ColumnLayoutManagementModalComponent', () => {
  let spectator: Spectator<ColumnLayoutManagementModalComponent>;
  const createComponent = createComponentFactory({
    component: ColumnLayoutManagementModalComponent,
    imports: [],
    providers: [
      MockProvider(MAT_DIALOG_DATA, {
        gridApi: {},
        columnApi: {},
        filter: {},
      }),
      mockProvider(MatDialog, {
        closeAll: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
