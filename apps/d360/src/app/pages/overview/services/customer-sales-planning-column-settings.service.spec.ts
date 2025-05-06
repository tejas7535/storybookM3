import { ActionsMenuCellRendererComponent } from '../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { Stub } from '../../../shared/test/stub.class';
import { CustomerSalesPlanningLayout } from '../overview.component';
import { CustomerSalesPlanningColumnSettingsService } from './customer-sales-planning-column-settings.service';

describe('CustomerSalesPlanningColumnSettingsService', () => {
  let service: CustomerSalesPlanningColumnSettingsService<any, any>;
  beforeEach(() => {
    service = Stub.get({
      component: CustomerSalesPlanningColumnSettingsService,
      providers: [Stub.getTranslocoLocaleServiceProvider()],
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getColumnDefs', () => {
    it('should have an action column', () => {
      const result = service.getColumnDefs(
        CustomerSalesPlanningLayout.PreviousToCurrent
      );
      const actionColumn = result.find((column) => column.field === 'menu');
      expect(actionColumn).toBeDefined();
      expect(actionColumn.cellRenderer).toEqual(
        ActionsMenuCellRendererComponent
      );
    });
  });
});
