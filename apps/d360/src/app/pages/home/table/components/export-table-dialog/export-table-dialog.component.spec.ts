import { Stub } from './../../../../../shared/test/stub.class';
import { ExportTableDialogComponent } from './export-table-dialog.component';

describe('ExportTableDialogComponent', () => {
  let component: ExportTableDialogComponent;

  let gridApi: any;
  let filter: any;

  beforeEach(() => {
    gridApi = Stub.getGridApi();
    filter = {};

    component = Stub.get({
      component: ExportTableDialogComponent,
      providers: [
        Stub.getMatDialogDataProvider({
          gridApi,
          filter,
        }),
        Stub.getMatDialogProvider(),
        Stub.getExportMaterialCustomerServiceProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger export with provided grid API and filter', () => {
    jest.spyOn(component['exportMaterialCustomerService'], 'triggerExport');

    component.ngOnInit();

    expect(
      component['exportMaterialCustomerService'].triggerExport
    ).toHaveBeenCalledWith(gridApi, filter);
  });

  it('should close all dialogs after export completes', () => {
    jest.spyOn(component['dialog'], 'closeAll');

    component.ngOnInit();

    expect(component['dialog'].closeAll).toHaveBeenCalled();
  });
});
