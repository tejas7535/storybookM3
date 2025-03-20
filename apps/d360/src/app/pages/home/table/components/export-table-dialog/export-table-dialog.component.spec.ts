import { Stub } from './../../../../../shared/test/stub.class';
import { ExportTableDialogComponent } from './export-table-dialog.component';

describe('ExportTableDialogComponent', () => {
  let component: ExportTableDialogComponent;

  beforeEach(() => {
    component = Stub.get({
      component: ExportTableDialogComponent,
      providers: [
        Stub.getMatDialogDataProvider({
          gridApi: Stub.getGridApi(),
          filter: {},
        }),
        Stub.getMatDialogProvider(),
        Stub.getExportMaterialCustomerServiceProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
