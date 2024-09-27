import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';

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
});
