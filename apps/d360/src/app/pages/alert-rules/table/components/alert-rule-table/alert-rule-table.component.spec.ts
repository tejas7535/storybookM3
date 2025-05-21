import { of } from 'rxjs';

import { ICellRendererParams } from 'ag-grid-enterprise';

import { AlertRule } from '../../../../../feature/alert-rules/model';
import { Stub } from '../../../../../shared/test/stub.class';
import { AlertRuleDeleteSingleModalComponent } from '../modals/alert-rule-delete-single-modal/alert-rule-delete-single-modal.component';
import { AlertRuleTableComponent } from './alert-rule-table.component';

describe('AlertRuleTableComponent', () => {
  let component: AlertRuleTableComponent;

  beforeEach(() => {
    component = Stub.getForEffect<AlertRuleTableComponent>({
      component: AlertRuleTableComponent,
      providers: [
        Stub.getAlertRulesServiceProvider(),
        Stub.getMatDialogProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
      component['setConfig']([]);
      const menuItems = component['config']().table['context'].getMenu(params);

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

      component['setConfig']([]);
      const menuItems = component['config']().table['context'].getMenu(params);
      menuItems[0].onClick();

      expect(editSpy).toHaveBeenCalledWith(params.node.data);
    });

    it('should call toggleAlertRuleStatus with correct params when deactivate is clicked', () => {
      const toggleSpy = jest
        .spyOn(component as any, 'toggleAlertRuleStatus')
        .mockImplementation(() => {});

      component['setConfig']([]);
      const menuItems = component['config']().table['context'].getMenu(params);
      menuItems[1].onClick();

      expect(toggleSpy).toHaveBeenCalledWith(params);
    });

    it('should call delete with correct params when delete is clicked', () => {
      const deleteSpy = jest.spyOn(component as any, 'delete');

      component['setConfig']([]);
      const menuItems = component['config']().table['context'].getMenu(params);
      menuItems[2].onClick();

      expect(deleteSpy).toHaveBeenCalledWith(params);
    });

    it('should return activate text if alert rule is deactivated', () => {
      params.node.data.deactivated = true;

      component['setConfig']([]);
      const menuItems = component['config']().table['context'].getMenu(params);

      expect(menuItems[1].text).toBe('alert_rules.action_menu.activate');
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
      component['toggleAlertRuleStatus'](params);
      expect(saveMultiAlertRulesSpy).not.toHaveBeenCalled();
    });

    it('should call saveMultiAlertRules with correct workflow data', () => {
      component['toggleAlertRuleStatus'](params);
      expect(saveMultiAlertRulesSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          id: '1',
          deactivated: true,
        }),
      ]);
    });

    it('should call openSnackBar with correct message on success', (done) => {
      component['toggleAlertRuleStatus'](params);
      setTimeout(() => {
        expect(openSnackBarSpy).toHaveBeenCalledWith(expect.any(String));
        done();
      });
    });

    it('should update params with new workflow data on success', (done) => {
      component['toggleAlertRuleStatus'](params);
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
      component['delete'](params);

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
      component['delete'](params);

      const dialogData = dialogOpenSpy.mock.calls[0][1].data;
      expect(dialogData.gridApi).toBe(params.api);
      expect(dialogData.alertRule).toBe(params.node.data);
    });

    it('should set disableClose to true', () => {
      component['delete'](params);

      const dialogConfig = dialogOpenSpy.mock.calls[0][1];
      expect(dialogConfig.disableClose).toBe(true);
    });

    it('should set the width to 600px', () => {
      component['delete'](params);

      const dialogConfig = dialogOpenSpy.mock.calls[0][1];
      expect(dialogConfig.width).toBe('600px');
    });
  });
});
