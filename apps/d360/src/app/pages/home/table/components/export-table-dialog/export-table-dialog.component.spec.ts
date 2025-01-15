import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { ExportMaterialCustomerService } from '../../services/export-material-customer.service';
import { ExportTableDialogComponent } from './export-table-dialog.component';

describe('ExportTableDialogComponent', () => {
  let spectator: Spectator<ExportTableDialogComponent>;
  const createComponent = createComponentFactory({
    component: ExportTableDialogComponent,
    imports: [MockModule(LoadingSpinnerModule)],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          gridApi: {},
          filter: {},
        },
      },
      {
        provide: MatDialog,
        useValue: {
          closeAll: jest.fn(),
        },
      },
      {
        provide: ExportMaterialCustomerService,
        useValue: {
          triggerExport: jest.fn().mockReturnValue(of(null)),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
