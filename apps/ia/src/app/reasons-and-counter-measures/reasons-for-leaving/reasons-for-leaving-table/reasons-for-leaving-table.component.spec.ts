import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { RowDataUpdatedEvent } from 'ag-grid-community';

import { ReasonsForLeavingTableComponent } from './reasons-for-leaving-table.component';

describe('ReasonsForLeavingTableComponent', () => {
  let component: ReasonsForLeavingTableComponent;
  let spectator: Spectator<ReasonsForLeavingTableComponent>;

  const createComponent = createComponentFactory({
    component: ReasonsForLeavingTableComponent,
    imports: [AgGridModule],
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

  describe('onRowDataUpdated', () => {
    test('should autosize detailedReason column', () => {
      const params = {
        columnApi: {
          autoSizeColumns: jest.fn(),
        },
      } as unknown as RowDataUpdatedEvent;

      component.onRowDataUpdated(params);

      expect(params.columnApi.autoSizeColumns).toHaveBeenCalledWith(
        ['detailedReason'],
        false
      );
    });
  });
});
