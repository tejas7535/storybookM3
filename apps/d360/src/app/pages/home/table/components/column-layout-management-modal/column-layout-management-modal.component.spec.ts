import { MatDialog } from '@angular/material/dialog';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { Stub } from './../../../../../shared/test/stub.class';
import { ColumnLayoutManagementModalComponent } from './column-layout-management-modal.component';

describe('ColumnLayoutManagementModalComponent', () => {
  let spectator: Spectator<ColumnLayoutManagementModalComponent>;
  const createComponent = createComponentFactory({
    component: ColumnLayoutManagementModalComponent,
    imports: [],
    providers: [
      Stub.getMatDialogDataProvider({
        gridApi: {},
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
