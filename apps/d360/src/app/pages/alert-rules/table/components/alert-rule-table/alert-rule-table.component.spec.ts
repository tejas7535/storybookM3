import { of } from 'rxjs';

import {
  FirstDataRenderedEvent,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
} from 'ag-grid-enterprise';

import { AlertRule } from '../../../../../feature/alert-rules/model';
import { ActionsMenuCellRendererComponent } from '../../../../../shared/components/ag-grid/cell-renderer/actions-menu-cell-renderer/actions-menu-cell-renderer.component';
import { Stub } from '../../../../../shared/test/stub.class';
import { AlertRuleDeleteSingleModalComponent } from '../modals/alert-rule-delete-single-modal/alert-rule-delete-single-modal.component';
import { clientSideTableDefaultProps } from './../../../../../shared/ag-grid/grid-defaults';
import { AlertRuleTableComponent } from './alert-rule-table.component';

describe('AlertRuleTableComponent', () => {
  let component: AlertRuleTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<AlertRuleTableComponent>({
      component: AlertRuleTableComponent,
      providers: [
        Stub.getAlertRulesServiceProvider(),
        Stub.getAlertRulesColumnSettingsServiceProvider(),
        Stub.getMatDialogProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('gridOptions', () => {
    it('should have clientSideTableDefaultProps', () => {
      expect(component['gridOptions']).toMatchObject(
        clientSideTableDefaultProps
      );
    });

    it('should have sideBar defined', () => {
      expect(component['gridOptions'].sideBar).toBeDefined();
    });

    it('should have getRowId function defined', () => {
      expect(component['gridOptions'].getRowId).toBeDefined();
    });

    it('getRowId should return correct id', () => {
      const params = { data: { id: 'test-id' } } as GetRowIdParams<AlertRule>;
      const result = component['gridOptions'].getRowId(params);
      expect(result).toBe('test-id');
    });
  });

  describe('context', () => {
    let params: ICellRendererParams<any, AlertRule>;

    beforeEach(() => {
      params = {
        node: {
          data: {
            id: '1',
            deactivated: false,
          },
        },
      } as ICellRendererParams<any, AlertRule>;
    });

    it('should return menu items with correct text and onClick handlers', () => {
      const menuItems = component['context'].getMenu(params);

      expect(menuItems).toHaveLength(3);

      expect(menuItems[0].text).toBe('button.edit');
      expect(menuItems[0].onClick).toBeInstanceOf(Function);

      expect(menuItems[1].text).toBe('alert_rules.action_menu.deactivate');
      expect(menuItems[1].onClick).toBeInstanceOf(Function);

      expect(menuItems[2].text).toBe('alert_rules.action_menu.delete');
      expect(menuItems[2].onClick).toBeInstanceOf(Function);
    });

    it('should call editAlertRuleCallback with correct data when edit is clicked', () => {
      const editSpy = jest.fn();

      Stub.setInput('editAlertRuleCallback', editSpy);
      Stub.detectChanges();

      const menuItems = component['context'].getMenu(params);
      menuItems[0].onClick();

      expect(editSpy).toHaveBeenCalledWith(params.node.data);
    });

    it('should call toggleAlertRuleStatus with correct params when deactivate is clicked', () => {
      const toggleSpy = jest
        .spyOn(component, 'toggleAlertRuleStatus')
        .mockImplementation(() => {});

      const menuItems = component['context'].getMenu(params);
      menuItems[1].onClick();

      expect(toggleSpy).toHaveBeenCalledWith(params);
    });

    it('should call delete with correct params when delete is clicked', () => {
      const deleteSpy = jest.spyOn(component, 'delete');

      const menuItems = component['context'].getMenu(params);
      menuItems[2].onClick();

      expect(deleteSpy).toHaveBeenCalledWith(params);
    });

    it('should return activate text if alert rule is deactivated', () => {
      params.node.data.deactivated = true;

      const menuItems = component['context'].getMenu(params);

      expect(menuItems[1].text).toBe('alert_rules.action_menu.activate');
    });
  });

  describe('ngOnInit', () => {
    it('should call setAlertRuleData', () => {
      jest
        .spyOn(component as any, 'toggleAlertRuleStatus')
        .mockImplementation(() => {});

      const setAlertRuleDataSpy = jest.spyOn(
        component as any,
        'setAlertRuleData'
      );
      component.ngOnInit();
      expect(setAlertRuleDataSpy).toHaveBeenCalled();
    });
  });

  describe('toggleAlertRuleStatus', () => {
    let params: ICellRendererParams<any, AlertRule>;
    let saveMultiAlertRulesSpy: jest.SpyInstance;
    let openSnackBarSpy: jest.SpyInstance;
    let setValueSpy: jest.SpyInstance;
    let updateDataSpy: jest.SpyInstance;
    let refreshCellsSpy: jest.SpyInstance;

    beforeEach(() => {
      params = {
        node: {
          data: {
            id: '1',
            deactivated: false,
            startDate: new Date(),
            endDate: new Date(),
          },
          id: '1',
        },
        api: {
          getRowNode: jest.fn().mockReturnValue({
            updateData: jest.fn(),
          }),
          refreshCells: jest.fn(),
        },
        setValue: jest.fn(),
      } as unknown as ICellRendererParams<any, AlertRule>;

      saveMultiAlertRulesSpy = jest
        .spyOn(component['alertRulesService'], 'saveMultiAlertRules')
        .mockReturnValue(of({ overallStatus: 'success', response: [] } as any));
      openSnackBarSpy = jest.spyOn(
        component['snackBarService'],
        'openSnackBar'
      );
      setValueSpy = jest.spyOn(params, 'setValue');
      updateDataSpy = jest.spyOn(
        params.api.getRowNode(params.node.id),
        'updateData'
      );
      refreshCellsSpy = jest.spyOn(params.api, 'refreshCells');
    });

    it('should not proceed if params.node.data is null', () => {
      params.node.data = null;
      component.toggleAlertRuleStatus(params);
      expect(saveMultiAlertRulesSpy).not.toHaveBeenCalled();
    });

    it('should call saveMultiAlertRules with correct workflow data', () => {
      component.toggleAlertRuleStatus(params);
      expect(saveMultiAlertRulesSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          id: '1',
          deactivated: true,
        }),
      ]);
    });

    it('should call openSnackBar with correct message on success', (done) => {
      component.toggleAlertRuleStatus(params);
      setTimeout(() => {
        expect(openSnackBarSpy).toHaveBeenCalledWith(expect.any(String));
        done();
      });
    });

    it('should update params with new workflow data on success', (done) => {
      component.toggleAlertRuleStatus(params);
      setTimeout(() => {
        expect(setValueSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            id: '1',
            deactivated: true,
          })
        );
        expect(updateDataSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            id: '1',
            deactivated: true,
          })
        );
        expect(refreshCellsSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('delete', () => {
    let params: ICellRendererParams<any, AlertRule>;
    let dialogOpenSpy: jest.SpyInstance;

    beforeEach(() => {
      params = {
        node: {
          data: {
            id: '1',
            deactivated: false,
          },
        },
        api: {
          getRowNode: jest.fn().mockReturnValue({
            updateData: jest.fn(),
          }),
          refreshCells: jest.fn(),
        },
      } as unknown as ICellRendererParams<any, AlertRule>;

      dialogOpenSpy = jest.spyOn(component['dialog'], 'open');
    });

    it('should open the dialog with correct configuration', () => {
      component.delete(params);

      expect(dialogOpenSpy).toHaveBeenCalledWith(
        AlertRuleDeleteSingleModalComponent,
        {
          data: { gridApi: params.api, alertRule: params.node.data },
          disableClose: true,
          width: '600px',
        }
      );
    });

    it('should pass the correct data to the dialog', () => {
      component.delete(params);

      const dialogData = dialogOpenSpy.mock.calls[0][1].data;
      expect(dialogData.gridApi).toBe(params.api);
      expect(dialogData.alertRule).toBe(params.node.data);
    });

    it('should set disableClose to true', () => {
      component.delete(params);

      const dialogConfig = dialogOpenSpy.mock.calls[0][1];
      expect(dialogConfig.disableClose).toBe(true);
    });

    it('should set the width to 600px', () => {
      component.delete(params);

      const dialogConfig = dialogOpenSpy.mock.calls[0][1];
      expect(dialogConfig.width).toBe('600px');
    });
  });

  describe('onGridReady', () => {
    let event: GridReadyEvent;
    let createColumnDefsSpy: jest.SpyInstance;

    beforeEach(() => {
      event = {
        api: {
          setGridOption: jest.fn(),
        },
      } as unknown as GridReadyEvent;

      createColumnDefsSpy = jest.spyOn(component as any, 'createColumnDefs');
    });

    it('should set gridApi to event.api', () => {
      component['onGridReady'](event);
      expect(component.gridApi).toBe(event.api);
    });

    it('should emit getApi with event.api', () => {
      const emitSpy = jest.spyOn(component.getApi, 'emit');
      component['onGridReady'](event);
      expect(emitSpy).toHaveBeenCalledWith(event.api);
    });

    it('should call createColumnDefs', () => {
      component['onGridReady'](event);
      expect(createColumnDefsSpy).toHaveBeenCalled();
    });
  });

  describe('setAlertRuleData', () => {
    let loadDataSpy: jest.SpyInstance;
    let setGridOptionSpy: jest.SpyInstance;

    beforeEach(() => {
      jest
        .spyOn(component as any, 'toggleAlertRuleStatus')
        .mockImplementation(() => {});

      loadDataSpy = jest.spyOn(component, 'loadData$').mockReturnValue(() =>
        of({
          count: 1,
          content: [{ id: '1', name: 'Test Rule' }],
        } as any)
      );
      setGridOptionSpy = jest.fn();
      component['gridApi'] = {
        setGridOption: setGridOptionSpy,
      } as unknown as GridApi;
    });

    it('should call loadData$', () => {
      component['setAlertRuleData']();
      expect(loadDataSpy).toHaveBeenCalled();
    });

    it('should set grid option rowData with response content', (done) => {
      component['setAlertRuleData']();
      setTimeout(() => {
        expect(setGridOptionSpy).toHaveBeenCalledWith('rowData', [
          { id: '1', name: 'Test Rule' },
        ]);
        done();
      });
    });

    it('should handle empty response gracefully', (done) => {
      loadDataSpy.mockReturnValue(() => of({ count: 0, content: [] }));
      component['setAlertRuleData']();
      setTimeout(() => {
        expect(setGridOptionSpy).toHaveBeenCalledWith('rowData', []);
        done();
      });
    });
  });

  describe('createColumnDefs', () => {
    let getColumnSettingsSpy: jest.SpyInstance;
    let setGridOptionSpy: jest.SpyInstance;

    beforeEach(() => {
      jest
        .spyOn(component as any, 'toggleAlertRuleStatus')
        .mockImplementation(() => {});

      jest
        .spyOn(component['alertRulesService'], 'saveMultiAlertRules')
        .mockReturnValue(of({ overallStatus: 'success', response: [] } as any));

      getColumnSettingsSpy = jest
        .spyOn(component['columnSettingsService'], 'getColumnSettings')
        .mockReturnValue(
          of([
            {
              colId: 'testCol',
              title: 'Test Column',
              filter: 'agTextColumnFilter',
              filterParams: {},
              cellRenderer: null,
              visible: true,
              sortable: true,
              sort: 'asc',
              alwaysVisible: false,
              valueFormatter: null,
              maxWidth: 200,
              tooltipComponent: null,
              tooltipComponentParams: null,
              tooltipField: null,
            },
          ])
        );
      setGridOptionSpy = jest.fn();
      component['gridApi'] = {
        setGridOption: setGridOptionSpy,
      } as unknown as GridApi;
    });

    it('should call getColumnSettings', () => {
      component['createColumnDefs']();
      expect(getColumnSettingsSpy).toHaveBeenCalled();
    });

    it('should set grid option columnDefs with correct column settings', (done) => {
      component['createColumnDefs']();
      setTimeout(() => {
        expect(setGridOptionSpy).toHaveBeenCalledWith(
          'columnDefs',
          expect.arrayContaining([
            expect.objectContaining({
              colId: 'testCol',
              field: 'testCol',
              headerName: 'Test Column',
              filter: 'agTextColumnFilter',
              sortable: true,
              sort: 'asc',
              maxWidth: 200,
            }),
            expect.objectContaining({
              cellClass: ['fixed-action-column'],
              field: 'menu',
              headerName: '',
              cellRenderer: ActionsMenuCellRendererComponent,
              lockVisible: true,
              pinned: 'right',
              lockPinned: true,
              suppressHeaderMenuButton: true,
              maxWidth: 64,
              suppressSizeToFit: true,
            }),
          ])
        );
        done();
      });
    });

    it('should handle empty column settings gracefully', (done) => {
      getColumnSettingsSpy.mockReturnValue(of([]));
      component['createColumnDefs']();
      setTimeout(() => {
        expect(setGridOptionSpy).toHaveBeenCalledWith(
          'columnDefs',
          expect.arrayContaining([
            expect.objectContaining({
              cellClass: ['fixed-action-column'],
              field: 'menu',
              headerName: '',
              cellRenderer: ActionsMenuCellRendererComponent,
              lockVisible: true,
              pinned: 'right',
              lockPinned: true,
              suppressHeaderMenuButton: true,
              maxWidth: 64,
              suppressSizeToFit: true,
            }),
          ])
        );
        done();
      });
    });
  });

  describe('onFirstDataRendered', () => {
    let event: FirstDataRenderedEvent;
    let applyStoredFiltersSpy: jest.SpyInstance;

    beforeEach(() => {
      event = {
        api: {
          setGridOption: jest.fn(),
        },
      } as unknown as FirstDataRenderedEvent;

      applyStoredFiltersSpy = jest.spyOn(
        component['columnSettingsService'],
        'applyStoredFilters'
      );
    });

    it('should call applyStoredFilters with event.api', () => {
      component['onFirstDataRendered'](event);
      expect(applyStoredFiltersSpy).toHaveBeenCalledWith(event.api);
    });
  });
});
