import { of } from 'rxjs';

import { AlertRule } from '../../../../../feature/alert-rules/model';
import { Stub } from '../../../../../shared/test/stub.class';
import { AlertRuleDeleteSingleModalComponent } from '../modals/alert-rule-delete-single-modal/alert-rule-delete-single-modal.component';
import {
  AlertRuleEditSingleModalComponent,
  AlertRuleModalProps,
} from '../modals/alert-rule-edit-single-modal/alert-rule-edit-single-modal.component';
import { MessageType } from './../../../../../shared/models/message-type.enum';
import { AlertRuleTableRowMenuButtonComponent } from './alert-rule-table-row-menu-button.component';

describe('AlertRuleTableRowMenuButtonComponent', () => {
  let component: AlertRuleTableRowMenuButtonComponent;

  beforeEach(() => {
    component = Stub.get<AlertRuleTableRowMenuButtonComponent>({
      component: AlertRuleTableRowMenuButtonComponent,
      providers: [
        Stub.getAlertRulesServiceProvider(),
        Stub.getMatDialogProvider(),
      ],
    });

    component['params'] = {
      data: {},
      api: {
        updateData: jest.fn().mockReturnValue({
          updateData: jest.fn(),
        }),
        getRowNode: jest.fn().mockReturnValue({
          updateData: jest.fn(),
        }),
      },
      node: {
        id: 'abc',
      },
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('edit', () => {
    let dialogOpenSpy: jest.SpyInstance;
    let afterClosedSpy: jest.SpyInstance;
    let handleCloseSpy: jest.SpyInstance;

    beforeEach(() => {
      afterClosedSpy = jest.fn().mockReturnValue(of(true));
      dialogOpenSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: afterClosedSpy,
      } as any);
      handleCloseSpy = jest.spyOn(component as any, 'handleClose');
    });

    it('should open the dialog with correct configuration', () => {
      component['params'] = { api: {} } as any;
      component['data'] = { id: '1' } as AlertRule;

      component['edit']();

      expect(dialogOpenSpy).toHaveBeenCalledWith(
        AlertRuleEditSingleModalComponent,
        {
          data: {
            gridApi: component['params'].api,
            alertRule: component['data'],
            title: 'edit',
          } as AlertRuleModalProps,
          disableClose: true,
          autoFocus: false,
        }
      );
    });

    it('should call handleClose after the dialog is closed', (done) => {
      component['edit']();

      setTimeout(() => {
        expect(afterClosedSpy).toHaveBeenCalled();
        expect(handleCloseSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('activate', () => {
    let saveMultiAlertRulesSpy: jest.SpyInstance;
    let snackBarSpy: jest.SpyInstance;
    let updateDataSpy: jest.SpyInstance;
    let handleCloseSpy: jest.SpyInstance;

    beforeEach(() => {
      saveMultiAlertRulesSpy = jest
        .spyOn(component['alertRulesService'], 'saveMultiAlertRules')
        .mockReturnValue(
          of({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: [],
          })
        );
      snackBarSpy = jest.spyOn(component['snackbarService'], 'show');
      updateDataSpy = jest.spyOn(component as any, 'updateData');
      handleCloseSpy = jest.spyOn(component as any, 'handleClose');
    });

    it('should not proceed if data is null', () => {
      component['data'] = null;
      component['activate']();
      expect(saveMultiAlertRulesSpy).not.toHaveBeenCalled();
    });

    it('should call saveMultiAlertRules with correct workflow data', () => {
      component['data'] = { id: '1', deactivated: true } as AlertRule;
      component['activate']();
      expect(saveMultiAlertRulesSpy).toHaveBeenCalledWith([
        { id: '1', deactivated: false },
      ]);
    });

    it('should call show with correct message on success', (done) => {
      component['data'] = { id: '1', deactivated: true } as AlertRule;
      component['activate']();
      setTimeout(() => {
        expect(snackBarSpy).toHaveBeenCalledWith(
          'alert_rules.action_menu_activated',
          undefined,
          undefined,
          'success'
        );
        done();
      });
    });

    it('should update data and call handleClose on success', (done) => {
      component['data'] = { id: '1', deactivated: true } as AlertRule;
      component['activate']();
      setTimeout(() => {
        expect(updateDataSpy).toHaveBeenCalledWith({
          id: '1',
          deactivated: false,
        });
        expect(handleCloseSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('deactivate', () => {
    let saveMultiAlertRulesSpy: jest.SpyInstance;
    let snackBarSpy: jest.SpyInstance;
    let updateDataSpy: jest.SpyInstance;
    let handleCloseSpy: jest.SpyInstance;

    beforeEach(() => {
      saveMultiAlertRulesSpy = jest
        .spyOn(component['alertRulesService'], 'saveMultiAlertRules')
        .mockReturnValue(
          of({
            overallStatus: MessageType.Success,
            overallErrorMsg: null,
            response: [],
          })
        );
      snackBarSpy = jest.spyOn(component['snackbarService'], 'show');
      updateDataSpy = jest.spyOn(component as any, 'updateData');
      handleCloseSpy = jest.spyOn(component as any, 'handleClose');
    });

    it('should not proceed if data is null', () => {
      component['data'] = null;
      component['deactivate']();
      expect(saveMultiAlertRulesSpy).not.toHaveBeenCalled();
    });

    it('should call saveMultiAlertRules with correct workflow data', () => {
      component['data'] = { id: '1', deactivated: false } as AlertRule;
      component['deactivate']();
      expect(saveMultiAlertRulesSpy).toHaveBeenCalledWith([
        { id: '1', deactivated: true },
      ]);
    });

    it('should call show with correct message on success', (done) => {
      component['data'] = { id: '1', deactivated: false } as AlertRule;
      component['deactivate']();
      setTimeout(() => {
        expect(snackBarSpy).toHaveBeenCalledWith(
          'alert_rules.action_menu_deactivated',
          undefined,
          undefined,
          'success'
        );
        done();
      });
    });

    it('should update data and call handleClose on success', (done) => {
      component['data'] = { id: '1', deactivated: false } as AlertRule;
      component['deactivate']();
      setTimeout(() => {
        expect(updateDataSpy).toHaveBeenCalledWith({
          id: '1',
          deactivated: true,
        });
        expect(handleCloseSpy).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('delete', () => {
    let dialogOpenSpy: jest.SpyInstance;

    beforeEach(() => {
      dialogOpenSpy = jest.spyOn(component['dialog'], 'open');
    });

    it('should open the dialog with correct configuration', () => {
      component['params'] = { api: {} } as any;
      component['data'] = { id: '1' } as AlertRule;

      component['delete']();

      expect(dialogOpenSpy).toHaveBeenCalledWith(
        AlertRuleDeleteSingleModalComponent,
        {
          data: {
            gridApi: component['params'].api,
            alertRule: component['data'],
          },
          disableClose: true,
        }
      );
    });

    it('should pass the correct data to the dialog', () => {
      component['params'] = { api: {} } as any;
      component['data'] = { id: '1' } as AlertRule;

      component['delete']();

      const dialogData = dialogOpenSpy.mock.calls[0][1].data;
      expect(dialogData.gridApi).toBe(component['params'].api);
      expect(dialogData.alertRule).toBe(component['data']);
    });

    it('should set disableClose to true', () => {
      component['params'] = { api: {} } as any;
      component['data'] = { id: '1' } as AlertRule;

      component['delete']();

      const dialogConfig = dialogOpenSpy.mock.calls[0][1];
      expect(dialogConfig.disableClose).toBe(true);
    });

    it('should still open dialog even if data is null', () => {
      component['params'] = { api: {} } as any;
      component['data'] = null;

      component['delete']();

      expect(dialogOpenSpy).toHaveBeenCalledWith(
        AlertRuleDeleteSingleModalComponent,
        {
          data: {
            gridApi: component['params'].api,
            alertRule: null,
          },
          disableClose: true,
        }
      );
    });

    it('should still open dialog even if params.api is undefined', () => {
      component['params'] = {} as any;
      component['data'] = { id: '1' } as AlertRule;

      component['delete']();

      expect(dialogOpenSpy).toHaveBeenCalledWith(
        AlertRuleDeleteSingleModalComponent,
        {
          data: {
            gridApi: undefined,
            alertRule: component['data'],
          },
          disableClose: true,
        }
      );
    });
  });

  describe('error handling', () => {
    it('should not update data or close on error response', (done) => {
      const mockErrorResponse = {
        overallStatus: MessageType.Error,
        overallErrorMsg: 'Error message',
        response: [] as any,
      };

      jest
        .spyOn(component['alertRulesService'], 'saveMultiAlertRules')
        .mockReturnValue(of(mockErrorResponse));

      const updateDataSpy = jest.spyOn(component as any, 'updateData');
      const handleCloseSpy = jest.spyOn(component as any, 'handleClose');
      const snackBarSpy = jest.spyOn(component['snackbarService'], 'show');

      component['data'] = { id: '1', deactivated: false } as AlertRule;
      component['deactivate']();

      setTimeout(() => {
        expect(snackBarSpy).toHaveBeenCalledWith(
          'Error message',
          undefined,
          undefined,
          'error'
        );
        expect(updateDataSpy).not.toHaveBeenCalled();
        expect(handleCloseSpy).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('updateData', () => {
    it('should call the grid API to update the data', () => {
      const updatedData = { id: '1', name: 'Updated Rule' };
      const getRowNodeSpy = jest.spyOn(component['params'].api, 'getRowNode');
      const nodeUpdateDataSpy = jest.spyOn(
        component['params'].api.getRowNode('abc'),
        'updateData'
      );

      component['data'] = { id: '1' } as AlertRule;
      component['updateData'](updatedData as any);

      expect(getRowNodeSpy).toHaveBeenCalledWith('abc');
      expect(nodeUpdateDataSpy).toHaveBeenCalledWith(updatedData);
    });

    it('should not fail if node is not found', () => {
      const updatedData = { id: '1', name: 'Updated Rule' };
      jest.spyOn(component['params'].api, 'getRowNode').mockReturnValue(null);

      expect(() => {
        component['updateData'](updatedData as any);
      }).not.toThrow();
    });
  });

  describe('handleClose', () => {
    it('should be defined', () => {
      expect(component['handleClose']).toBeDefined();
    });

    it('should be callable without errors', () => {
      expect(() => component['handleClose']()).not.toThrow();
    });
  });
});
