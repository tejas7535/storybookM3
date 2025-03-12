import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { ExportMaterialCustomerService } from '../../services/export-material-customer.service';
import { Stub } from './../../../../../shared/test/stub.class';
import { ExportTableDialogComponent } from './export-table-dialog.component';

describe('ExportTableDialogComponent', () => {
  let component: ExportTableDialogComponent;

  beforeEach(() => {
    component = Stub.get({
      component: ExportTableDialogComponent,
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            gridApi: {},
            filter: {},
          },
        },
        MockProvider(MatDialog, { closeAll: jest.fn() }),
        MockProvider(ExportMaterialCustomerService, {
          triggerExport: jest.fn().mockReturnValue(of(null)),
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
