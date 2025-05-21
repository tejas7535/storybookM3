import { of } from 'rxjs';

import { GridApi } from 'ag-grid-enterprise';

import { AppRoutePath } from '../../app.routes.enum';
import { AlertRule } from '../../feature/alert-rules/model';
import { Stub } from '../../shared/test/stub.class';
import { AlertRulesComponent } from './alert-rules.component';
import { AlertRuleDeleteMultiModalComponent } from './table/components/modals/alert-rule-delete-multi-modal/alert-rule-delete-multi-modal.component';
import { AlertRuleEditMultiModalComponent } from './table/components/modals/alert-rule-edit-multi-modal/alert-rule-edit-multi-modal.component';
import {
  AlertRuleEditSingleModalComponent,
  AlertRuleModalProps,
} from './table/components/modals/alert-rule-edit-single-modal/alert-rule-edit-single-modal.component';

describe('AlertRulesComponent', () => {
  let component: AlertRulesComponent;
  beforeEach(() => {
    component = Stub.get<AlertRulesComponent>({
      component: AlertRulesComponent,
      providers: [
        Stub.getMatDialogProvider(),
        Stub.getAlertRulesServiceProvider(),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleCreateSingleAlertRule', () => {
    let dialogOpenSpy: jest.SpyInstance;
    let afterClosedSpy: jest.SpyInstance;
    let applyTransactionSpy: jest.SpyInstance;

    beforeEach(() => {
      afterClosedSpy = jest
        .fn()
        .mockReturnValue(of([{ id: '1', name: 'Test Rule' }]));
      dialogOpenSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: afterClosedSpy,
      } as any);
      applyTransactionSpy = jest.fn();
      component['gridApi'] = {
        applyTransaction: applyTransactionSpy,
      } as unknown as GridApi;
    });

    it('should open the dialog with correct data for creating a new alert rule', () => {
      component['handleCreateSingleAlertRule']();

      expect(dialogOpenSpy).toHaveBeenCalledWith(
        AlertRuleEditSingleModalComponent,
        {
          data: {
            alertRule: {
              deactivated: false,
              id: '00000000-0000-0000-0000-000000000000',
              startDate: expect.any(Date),
              endDate: new Date('9999-12-31'),
              generation: 'R',
            },
            title: 'create',
          } as AlertRuleModalProps,
          disableClose: true,
          autoFocus: false,
          panelClass: ['form-dialog', 'alert-rule'],
        }
      );
    });

    it('should open the dialog with correct data for editing an existing alert rule', () => {
      const existingAlertRule: AlertRule = {
        id: '1',
        deactivated: false,
        startDate: new Date(),
        endDate: new Date(),
        generation: 'R',
      };

      component['handleCreateSingleAlertRule'](existingAlertRule);

      expect(dialogOpenSpy).toHaveBeenCalledWith(
        AlertRuleEditSingleModalComponent,
        {
          data: {
            alertRule: existingAlertRule,
            title: 'edit',
          } as AlertRuleModalProps,
          disableClose: true,
          autoFocus: false,
          panelClass: ['form-dialog', 'alert-rule'],
        }
      );
    });

    it('should apply transaction to gridApi with add operation if creating a new alert rule', () => {
      component['handleCreateSingleAlertRule']();

      expect(afterClosedSpy).toHaveBeenCalled();
      expect(applyTransactionSpy).toHaveBeenCalledWith({
        add: [{ id: '1', name: 'Test Rule' }],
      });
    });

    it('should apply transaction to gridApi with update operation if editing an existing alert rule', () => {
      const existingAlertRule: AlertRule = {
        id: '1',
        deactivated: false,
        startDate: new Date(),
        endDate: new Date(),
        generation: 'R',
      };

      component['handleCreateSingleAlertRule'](existingAlertRule);

      expect(afterClosedSpy).toHaveBeenCalled();
      expect(applyTransactionSpy).toHaveBeenCalledWith({
        update: [{ id: '1', name: 'Test Rule' }],
      });
    });
  });

  describe('handleCreateMultiAlertRule', () => {
    let dialogOpenSpy: jest.SpyInstance;
    let afterClosedSpy: jest.SpyInstance;
    let reloadSpy: jest.SpyInstance;

    beforeEach(() => {
      afterClosedSpy = jest.fn().mockReturnValue(of(true));
      dialogOpenSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: afterClosedSpy,
      } as any);
      reloadSpy = jest.spyOn(component['reload$'], 'next');
    });

    it('should open the dialog with correct configuration', () => {
      component['handleCreateMultiAlertRule']();

      expect(dialogOpenSpy).toHaveBeenCalledWith(
        AlertRuleEditMultiModalComponent,
        {
          disableClose: true,
          panelClass: ['table-dialog', 'alert-rule'],
          autoFocus: false,
          maxHeight: 'calc(100% - 64px)',
          maxWidth: 'none',
          width: 'calc(100% - 64px)',
        }
      );
    });

    it('should call reload$ if afterClosed returns true', (done) => {
      component['handleCreateMultiAlertRule']();

      setTimeout(() => {
        expect(afterClosedSpy).toHaveBeenCalled();
        expect(reloadSpy).toHaveBeenCalled();
        done();
      });
    });

    it('should not call reload$ if afterClosed returns false', (done) => {
      afterClosedSpy.mockReturnValue(of(false));
      component['handleCreateMultiAlertRule']();

      setTimeout(() => {
        expect(afterClosedSpy).toHaveBeenCalled();
        expect(reloadSpy).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('handleDeleteMultiAlertRule', () => {
    let dialogOpenSpy: jest.SpyInstance;
    let afterClosedSpy: jest.SpyInstance;
    let reloadSpy: jest.SpyInstance;

    beforeEach(() => {
      afterClosedSpy = jest.fn().mockReturnValue(of(true));
      dialogOpenSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: afterClosedSpy,
      } as any);
      reloadSpy = jest.spyOn(component['reload$'], 'next');
    });

    it('should open the dialog with correct configuration', () => {
      component['handleDeleteMultiAlertRule']();

      expect(dialogOpenSpy).toHaveBeenCalledWith(
        AlertRuleDeleteMultiModalComponent,
        {
          disableClose: true,
          panelClass: ['table-dialog', 'alert-rule'],
          autoFocus: false,
          maxHeight: 'calc(100% - 64px)',
          maxWidth: 'none',
          width: 'calc(100% - 64px)',
        }
      );
    });

    it('should call reload$ if afterClosed returns true', (done) => {
      component['handleDeleteMultiAlertRule']();

      setTimeout(() => {
        expect(afterClosedSpy).toHaveBeenCalled();
        expect(reloadSpy).toHaveBeenCalled();
        done();
      });
    });

    it('should not call reload$ if afterClosed returns false', (done) => {
      afterClosedSpy.mockReturnValue(of(false));
      component['handleDeleteMultiAlertRule']();

      setTimeout(() => {
        expect(afterClosedSpy).toHaveBeenCalled();
        expect(reloadSpy).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should call closeAll on dialog service', () => {
      const closeAllSpy = jest.spyOn(component['dialog'], 'closeAll');
      component.ngOnDestroy();
      expect(closeAllSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    let handleCreateSingleAlertRuleSpy: jest.SpyInstance;

    beforeEach(() => {
      handleCreateSingleAlertRuleSpy = jest.spyOn(
        component as any,
        'handleCreateSingleAlertRule'
      );
    });

    it('should call handleCreateSingleAlertRule with parsed sessionStorage data if data exists', () => {
      const mockUrlData = {
        customerNumber: '123',
        materialNumber: '456',
        createNewTask: true,
      };
      sessionStorage.setItem(
        AppRoutePath.AlertRuleManagementPage,
        JSON.stringify(mockUrlData)
      );

      component.ngOnInit();

      expect(handleCreateSingleAlertRuleSpy).toHaveBeenCalledWith(mockUrlData);
    });

    it('should not call handleCreateSingleAlertRule if createNewTask data is false', () => {
      sessionStorage.setItem(
        AppRoutePath.AlertRuleManagementPage,
        JSON.stringify({
          customerNumber: '123',
          materialNumber: '456',
          createNewTask: false,
        })
      );

      component.ngOnInit();

      expect(handleCreateSingleAlertRuleSpy).not.toHaveBeenCalled();
    });

    it('should not call handleCreateSingleAlertRule if createNewTask data is missing', () => {
      sessionStorage.setItem(
        AppRoutePath.AlertRuleManagementPage,
        JSON.stringify({
          customerNumber: '123',
          materialNumber: '456',
        })
      );

      component.ngOnInit();

      expect(handleCreateSingleAlertRuleSpy).not.toHaveBeenCalled();
    });

    it('should not call handleCreateSingleAlertRule if sessionStorage data is null', () => {
      sessionStorage.removeItem(AppRoutePath.AlertRuleManagementPage);

      component.ngOnInit();

      expect(handleCreateSingleAlertRuleSpy).not.toHaveBeenCalled();
    });

    it('should handle invalid JSON in sessionStorage gracefully', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      sessionStorage.setItem(
        AppRoutePath.AlertRuleManagementPage,
        'invalid-json'
      );

      expect(() => component.ngOnInit()).not.toThrow();
      expect(handleCreateSingleAlertRuleSpy).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
