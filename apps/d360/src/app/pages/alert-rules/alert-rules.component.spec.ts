import { isEmpty, of, take, throwError } from 'rxjs';

import { GridApi } from 'ag-grid-enterprise';

import { AlertRule, AlertRuleResponse } from '../../feature/alert-rules/model';
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

  describe('hasFilters', () => {
    it('should return false if gridApi is null', () => {
      component['gridApi'] = null;
      const result = component['hasFilters']();
      expect(result).toBe(false);
    });

    it('should return false if gridApi has no filters', () => {
      component['gridApi'] = {
        getFilterModel: jest.fn().mockReturnValue({}),
      } as unknown as GridApi;
      const result = component['hasFilters']();
      expect(result).toBe(false);
    });

    it('should return true if gridApi has filters', () => {
      component['gridApi'] = {
        getFilterModel: jest.fn().mockReturnValue({ filter1: true }),
      } as unknown as GridApi;
      const result = component['hasFilters']();
      expect(result).toBe(true);
    });

    it('should call getFilterModel on gridApi', () => {
      const getFilterModelSpy = jest.fn().mockReturnValue({});
      component['gridApi'] = {
        getFilterModel: getFilterModelSpy,
      } as unknown as GridApi;
      component['hasFilters']();
      expect(getFilterModelSpy).toHaveBeenCalled();
    });
  });

  describe('getApi', () => {
    it('sets gridApi correctly', () => {
      component['getApi']({ foo: 'bar' } as any);

      expect(component['gridApi']).toEqual({ foo: 'bar' } as any);
    });
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
    let loadDataSpy: jest.SpyInstance;

    beforeEach(() => {
      afterClosedSpy = jest.fn().mockReturnValue(of(true));
      dialogOpenSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: afterClosedSpy,
      } as any);
      loadDataSpy = jest
        .spyOn(component as any, 'loadData$')
        .mockReturnValue(of({} as AlertRuleResponse));
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

    it('should call loadData$ if afterClosed returns true', (done) => {
      component['handleCreateMultiAlertRule']();

      setTimeout(() => {
        expect(afterClosedSpy).toHaveBeenCalled();
        expect(loadDataSpy).toHaveBeenCalled();
        done();
      });
    });

    it('should not call loadData$ if afterClosed returns false', (done) => {
      afterClosedSpy.mockReturnValue(of(false));
      component['handleCreateMultiAlertRule']();

      setTimeout(() => {
        expect(afterClosedSpy).toHaveBeenCalled();
        expect(loadDataSpy).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('handleDeleteMultiAlertRule', () => {
    let dialogOpenSpy: jest.SpyInstance;
    let afterClosedSpy: jest.SpyInstance;
    let loadDataSpy: jest.SpyInstance;

    beforeEach(() => {
      afterClosedSpy = jest.fn().mockReturnValue(of(true));
      dialogOpenSpy = jest.spyOn(component['dialog'], 'open').mockReturnValue({
        afterClosed: afterClosedSpy,
      } as any);
      loadDataSpy = jest
        .spyOn(component as any, 'loadData$')
        .mockReturnValue(of({} as AlertRuleResponse));
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

    it('should call loadData$ if afterClosed returns true', (done) => {
      component['handleDeleteMultiAlertRule']();

      setTimeout(() => {
        expect(afterClosedSpy).toHaveBeenCalled();
        expect(loadDataSpy).toHaveBeenCalled();
        done();
      });
    });

    it('should not call loadData$ if afterClosed returns false', (done) => {
      afterClosedSpy.mockReturnValue(of(false));
      component['handleDeleteMultiAlertRule']();

      setTimeout(() => {
        expect(afterClosedSpy).toHaveBeenCalled();
        expect(loadDataSpy).not.toHaveBeenCalled();
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

  describe('loadData$', () => {
    let setGridOptionSpy: jest.SpyInstance;
    let getAlertRuleDataSpy: jest.SpyInstance;

    beforeEach(() => {
      setGridOptionSpy = jest.fn();
      component['gridApi'] = {
        setGridOption: setGridOptionSpy,
      } as unknown as GridApi;
      getAlertRuleDataSpy = jest.spyOn(
        component['alertRuleService'],
        'getAlertRuleData'
      );
    });

    it('should set grid option loading to true initially', () => {
      getAlertRuleDataSpy.mockReturnValue(of({} as AlertRuleResponse));
      component['loadData$']().pipe(take(1)).subscribe();
      expect(setGridOptionSpy).toHaveBeenCalledWith('loading', true);
    });

    it('should set grid option rowData and loading to false on success', (done) => {
      const mockResponse: AlertRuleResponse = {
        count: 1,
        content: [{ id: '1', name: 'Test Rule' } as any],
      };
      getAlertRuleDataSpy.mockReturnValue(of(mockResponse));

      component['loadData$']()
        .pipe(take(1))
        .subscribe(() => {
          expect(setGridOptionSpy).toHaveBeenCalledWith(
            'rowData',
            mockResponse.content
          );
          expect(setGridOptionSpy).toHaveBeenCalledWith('loading', false);
          done();
        });
    });

    it('should set grid option loading to false on error', (done) => {
      getAlertRuleDataSpy.mockReturnValue(throwError(() => new Error('Error')));

      component['loadData$']()
        .pipe(take(1), isEmpty())
        .subscribe({
          next: (result) => {
            expect(result).toEqual(true);
            done();
          },
          error: () => {
            expect(setGridOptionSpy).toHaveBeenCalledWith('loading', false);
            done();
          },
        });
    });

    it('should handle empty response gracefully', (done) => {
      getAlertRuleDataSpy.mockReturnValue(of({} as AlertRuleResponse));

      component['loadData$']()
        .pipe(take(1))
        .subscribe(() => {
          expect(setGridOptionSpy).toHaveBeenCalledWith('loading', false);
          done();
        });
    });
  });
});
