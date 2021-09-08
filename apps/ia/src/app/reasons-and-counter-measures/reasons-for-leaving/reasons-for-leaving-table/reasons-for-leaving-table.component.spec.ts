import { RowDataChangedEvent } from '@ag-grid-community/all-modules';
import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { ReasonsForLeavingTableComponent } from './reasons-for-leaving-table.component';

describe('ReasonsForLeavingTableComponent', () => {
  let component: ReasonsForLeavingTableComponent;
  let spectator: Spectator<ReasonsForLeavingTableComponent>;

  const createComponent = createComponentFactory({
    component: ReasonsForLeavingTableComponent,
    imports: [AgGridModule.withComponents([])],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set columnDefs', () => {
      component.columnDefs = [];

      component.ngOnInit();

      expect(component.columnDefs.length).toEqual(4);
    });
  });

  describe('onRowDataChanged', () => {
    test('should autosize detailedReason column', () => {
      const params = {
        columnApi: {
          autoSizeColumns: jest.fn(),
        },
      } as unknown as RowDataChangedEvent;

      component.onRowDataChanged(params);

      expect(params.columnApi.autoSizeColumns).toHaveBeenCalledWith(
        ['detailedReason'],
        false
      );
    });
  });
});
