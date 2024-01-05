import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MATERIAL_SANITY_CHECKS,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { of } from 'rxjs';

import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { RowNode } from 'ag-grid-community';

import { APP_STATE_MOCK } from '../../../testing/mocks/app-state-mock';
import { salesSummaryMock } from '../../../testing/mocks/sales-summary.mock';
import { UpdateDatesParams } from '../../shared/models/dates-update.model';
import { UpdateIgnoreFlagParams } from '../../shared/models/ignore-flag-update.model';
import { SalesSummary } from '../../shared/models/sales-summary.model';
import { DataService } from '../../shared/services/data/data.service';
import { IgnoreFlag } from './enums/ignore-flag.enum';
import { IgnoreFlagDialogComponent } from './ignore-flag-dialog/ignore-flag-dialog.component';
import { SalesRowDetailsComponent } from './sales-row-details.component';

describe('SalesRowDetailsComponent', () => {
  let component: SalesRowDetailsComponent;
  let spectator: Spectator<SalesRowDetailsComponent>;
  let dataService: DataService;
  let snackBar: MatSnackBar;
  let matDialog: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: SalesRowDetailsComponent,
    declarations: [SalesRowDetailsComponent],
    imports: [
      MatFormFieldModule,
      MatInputModule,
      ReactiveFormsModule,
      MatListModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatButtonModule,
      MatDialogModule,
      BrowserDynamicTestingModule,
      HttpClientTestingModule,
      MatSnackBarModule,
    ],
    providers: [
      {
        provide: MatDialog,
        useValue: {
          open: jest.fn(),
        },
      },
      provideMockStore({
        initialState: APP_STATE_MOCK,
      }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    dataService = spectator.inject(DataService);
    snackBar = spectator.inject(MatSnackBar);
    matDialog = spectator.inject(MatDialog);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    it('should set rowData and call setInitialFormValues', () => {
      component['setInitialFormValues'] = jest.fn();
      component['setSubscription'] = jest.fn();

      const fakeParams = {
        data: salesSummaryMock,
      };

      component.agInit(fakeParams);

      expect(component.rowData).toEqual(salesSummaryMock);

      expect(component['setInitialFormValues']).toHaveBeenCalledTimes(1);
      expect(component['setSubscription']).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component['shutDown$$'].next = jest.fn();

      component.ngOnDestroy();

      expect(component['shutDown$$'].next).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh({})).toBeFalsy();
    });
  });

  describe('setSubscription', () => {
    it('should add subscription', () => {
      component['handleUserAccess'] = jest.fn();

      component['setSubscription']();

      expect(component['handleUserAccess']).toHaveBeenCalled();
    });
  });

  describe('setInitialFormValues', () => {
    it('should set formcontrol values with eopDateTemp', () => {
      component.rowData = {
        eopDateTemp: salesSummaryMock.eopDateTemp,
        edoDate: salesSummaryMock.edoDate,
      } as unknown as SalesSummary;

      component['setInitialFormValues']();

      expect(component.datesFormGroup.get('eopDateControl').value).toEqual(
        salesSummaryMock.eopDateTemp
      );
      expect(component.datesFormGroup.get('edoDateControl').value).toEqual(
        salesSummaryMock.edoDate
      );
    });

    it('should set formcontrol values with eopDateVerified', () => {
      component.rowData = {
        // Values are comming as null from API
        // eslint-disable-next-line unicorn/no-null
        eopDateTemp: null,
        eopDateVerified: salesSummaryMock.eopDateVerified,
        edoDate: salesSummaryMock.edoDate,
      } as unknown as SalesSummary;

      component['setInitialFormValues']();

      expect(component.datesFormGroup.get('eopDateControl').value).toEqual(
        salesSummaryMock.eopDateTemp
      );
      expect(component.datesFormGroup.get('edoDateControl').value).toEqual(
        salesSummaryMock.edoDate
      );
    });
  });

  describe('handleUserAccess', () => {
    beforeEach(() => {
      component['superUser'] = 'superUser';
    });
    it('should disable the form group because missing rowData.lastModifier', () => {
      component.datesFormGroup.disable = jest.fn();
      component.rowData = {
        // Values are comming as null from API
        // eslint-disable-next-line unicorn/no-null
        lastModifier: null,
      } as unknown as SalesSummary;
      component['handleUserAccess']('');

      expect(component.datesFormGroup.disable).toHaveBeenCalledTimes(1);
    });

    it('should disable the datesFormGroup because of wrong user', () => {
      component.datesFormGroup.disable = jest.fn();
      component.rowData = {
        lastModifier: 'wrong user',
      } as unknown as SalesSummary;
      component['handleUserAccess']('user');

      expect(component.datesFormGroup.disable).toHaveBeenCalledTimes(1);
    });

    it('should disable the form group because missing rowData.lastModifier and missing rowData.keyUser', () => {
      component.datesFormGroup.disable = jest.fn();
      component.rowData = {
        // Values are comming as null from API
        // eslint-disable-next-line unicorn/no-null
        lastModifier: null,
        // eslint-disable-next-line unicorn/no-null
        keyUser: null,
      } as unknown as SalesSummary;
      component['handleUserAccess']('userid');

      expect(component.datesFormGroup.disable).toHaveBeenCalledTimes(1);
    });

    it('should disable the datesFormGroup because of wrong user and not keyUser', () => {
      component.datesFormGroup.disable = jest.fn();
      component.rowData = {
        lastModifier: 'wrong user',
        keyUser: 'keyUser',
      } as unknown as SalesSummary;
      component['handleUserAccess']('user');

      expect(component.datesFormGroup.disable).toHaveBeenCalledTimes(1);
    });

    it('should disable the datesFormGroup because of wrong user and not keyUser and not superUser', () => {
      component.datesFormGroup.disable = jest.fn();
      component['superUser'] = 'mySuperUser';
      component.rowData = {
        lastModifier: 'wrong user',
        keyUser: 'keyUser',
      } as unknown as SalesSummary;
      component['handleUserAccess']('user');

      expect(component.datesFormGroup.disable).toHaveBeenCalledTimes(1);
    });

    it('should not disable the form group', () => {
      component.datesFormGroup.disable = jest.fn();
      component.rowData = {
        lastModifier: 'USER',
      } as unknown as SalesSummary;
      component['handleUserAccess']('user');

      expect(component.datesFormGroup.disable).toHaveBeenCalledTimes(0);
    });
    it('should not disable the form group when user is keyUser', () => {
      component.datesFormGroup.disable = jest.fn();
      component.rowData = {
        lastModifier: 'USER',
        keyUser: 'KEYUSER',
      } as unknown as SalesSummary;
      component['handleUserAccess']('keyUser');

      expect(component.datesFormGroup.disable).toHaveBeenCalledTimes(0);
    });

    it('should not disable the form group when user is superUser', () => {
      component.datesFormGroup.disable = jest.fn();
      component.rowData = {
        lastModifier: 'USER',
        keyUser: 'KEYUSER',
      } as unknown as SalesSummary;
      component['handleUserAccess']('superUser');

      expect(component.datesFormGroup.disable).toHaveBeenCalledTimes(0);
    });
  });

  describe('convertToIsoDateString', () => {
    it('should return input if string', () => {
      const dateString = 'date string';
      expect(
        SalesRowDetailsComponent['convertToIsoDateString'](dateString)
      ).toEqual(dateString);
    });

    it('should return date ISO string without offset', () => {
      const inputDate = new Date('2020-01-01 10:00');
      const expectedString = new Date(
        Date.UTC(2020, 0, 1, 10, 0)
      ).toISOString();
      expect(
        SalesRowDetailsComponent['convertToIsoDateString'](inputDate)
      ).toEqual(expectedString);
    });
  });

  describe('sendUpdatedDates', () => {
    it('should send update, reload grid and show success message', waitForAsync(() => {
      component['rowNode'] = {
        setDataValue: jest.fn(),
      } as unknown as RowNode;

      dataService.updateDates = jest.fn().mockResolvedValue({});
      snackBar.open = jest.fn();

      component.rowData = {
        combinedKey: salesSummaryMock.combinedKey,
      } as unknown as SalesSummary;

      const dateString = new Date(Date.UTC(2020, 0, 1, 10, 0)).toISOString();

      SalesRowDetailsComponent['convertToIsoDateString'] = jest
        .fn()
        .mockReturnValue(dateString);

      component.datesFormGroup.setValue({
        eopDateControl: dateString,
        edoDateControl: dateString,
      });

      component.sendUpdatedDates().then(() => {
        expect(
          SalesRowDetailsComponent['convertToIsoDateString']
        ).toHaveBeenCalledTimes(2);
        expect(
          SalesRowDetailsComponent['convertToIsoDateString']
        ).toHaveBeenCalledWith(dateString);

        const expectedUpdateParams = new UpdateDatesParams(
          salesSummaryMock.combinedKey,
          dateString,
          dateString
        );
        expect(dataService.updateDates).toHaveBeenCalledTimes(1);
        expect(dataService.updateDates).toHaveBeenCalledWith(
          expectedUpdateParams
        );

        expect(component['rowNode'].setDataValue).toHaveBeenCalledTimes(2);
        expect(component['rowNode'].setDataValue).toHaveBeenCalledWith(
          'eopDateVerified',
          dateString
        );
        expect(component['rowNode'].setDataValue).toHaveBeenCalledWith(
          'edoDate',
          dateString
        );

        expect(snackBar.open).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledWith(
          'Success: Update successful'
        );
      });
    }));

    it('should show an error message on error', waitForAsync(() => {
      dataService.updateDates = jest.fn().mockRejectedValue({});
      snackBar.open = jest.fn();

      component.rowData = {
        combinedKey: salesSummaryMock.combinedKey,
      } as unknown as SalesSummary;

      const dateString = new Date(Date.UTC(2020, 0, 1, 10, 0)).toISOString();

      SalesRowDetailsComponent['convertToIsoDateString'] = jest
        .fn()
        .mockReturnValue(dateString);

      component.datesFormGroup.setValue({
        eopDateControl: dateString,
        edoDateControl: dateString,
      });

      component.sendUpdatedDates().then(() => {
        expect(
          SalesRowDetailsComponent['convertToIsoDateString']
        ).toHaveBeenCalledTimes(2);
        expect(
          SalesRowDetailsComponent['convertToIsoDateString']
        ).toHaveBeenCalledWith(dateString);

        const expectedUpdateParams = new UpdateDatesParams(
          salesSummaryMock.combinedKey,
          dateString,
          dateString
        );
        expect(dataService.updateDates).toHaveBeenCalledTimes(1);
        expect(dataService.updateDates).toHaveBeenCalledWith(
          expectedUpdateParams
        );

        expect(snackBar.open).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledWith('Error: Update failed');
      });
    }));

    it('should do nothing if datesFormGroup is not valid and show warning for EOP field', async () => {
      snackBar.open = jest.fn();
      dataService.updateDates = jest.fn();

      SalesRowDetailsComponent['convertToIsoDateString'] = jest.fn();

      component.datesFormGroup
        .get('eopDateControl')
        .setErrors({ incorrect: true });

      await component.sendUpdatedDates();
      expect(dataService.updateDates).toHaveBeenCalledTimes(0);
      expect(
        SalesRowDetailsComponent['convertToIsoDateString']
      ).toHaveBeenCalledTimes(0);

      expect(snackBar.open).toHaveBeenCalledTimes(1);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Warning: Cannot update with invalid or empty EOP Date field'
      );
    });

    it('should do nothing if datesFormGroup is not valid and show warning for EDO field', async () => {
      snackBar.open = jest.fn();
      dataService.updateDates = jest.fn();

      SalesRowDetailsComponent['convertToIsoDateString'] = jest.fn();

      component.datesFormGroup.get('eopDateControl').setValue('07/15/2021');

      component.datesFormGroup
        .get('edoDateControl')
        .setErrors({ incorrect: true });

      await component.sendUpdatedDates();
      expect(dataService.updateDates).toHaveBeenCalledTimes(0);
      expect(
        SalesRowDetailsComponent['convertToIsoDateString']
      ).toHaveBeenCalledTimes(0);

      expect(snackBar.open).toHaveBeenCalledTimes(1);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Warning: Cannot update with invalid or empty EDO Date field'
      );
    });
  });

  describe('sendUpdatedIgnoreFlag', () => {
    it('should send update, update grid and show success message', waitForAsync(() => {
      component['rowNode'] = {
        setDataValue: jest.fn(),
      } as unknown as RowNode;

      dataService.updateIgnoreFlag = jest.fn().mockResolvedValue({});
      snackBar.open = jest.fn();

      component.rowData = {
        combinedKey: salesSummaryMock.combinedKey,
      } as unknown as SalesSummary;

      const mockIgnoreFlag = IgnoreFlag.CustomerNumberChange;

      component.sendUpdatedIgnoreFlag(mockIgnoreFlag).then(() => {
        const expectedUpdateParams = new UpdateIgnoreFlagParams(
          salesSummaryMock.combinedKey,
          mockIgnoreFlag
        );

        expect(dataService.updateIgnoreFlag).toHaveBeenCalledTimes(1);
        expect(dataService.updateIgnoreFlag).toHaveBeenCalledWith(
          expectedUpdateParams
        );

        expect(component['rowNode'].setDataValue).toHaveBeenCalledTimes(1);
        expect(component['rowNode'].setDataValue).toHaveBeenCalledWith(
          'ignoreFlag',
          mockIgnoreFlag
        );

        expect(snackBar.open).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledWith(
          'Success: Update successful'
        );
      });
    }));

    it('should show an error message on error', waitForAsync(() => {
      dataService.updateIgnoreFlag = jest.fn().mockRejectedValue({});
      snackBar.open = jest.fn();

      component.rowData = {
        combinedKey: salesSummaryMock.combinedKey,
      } as unknown as SalesSummary;

      const mockIgnoreFlag = IgnoreFlag.CustomerNumberChange;

      component.sendUpdatedIgnoreFlag(mockIgnoreFlag).then(() => {
        const expectedUpdateParams = new UpdateIgnoreFlagParams(
          salesSummaryMock.combinedKey,
          mockIgnoreFlag
        );

        expect(dataService.updateIgnoreFlag).toHaveBeenCalledTimes(1);
        expect(dataService.updateIgnoreFlag).toHaveBeenCalledWith(
          expectedUpdateParams
        );

        expect(snackBar.open).toHaveBeenCalledTimes(1);
        expect(snackBar.open).toHaveBeenCalledWith('Error: Update failed');
      });
    }));
  });

  describe('openIgnoreDialog', () => {
    it('should open ignore flag dialog', () => {
      component.rowData = {
        ignoreFlag: IgnoreFlag.None,
      } as SalesSummary;

      const mockDialogRef = {
        afterClosed: jest.fn(() => of(IgnoreFlag.CustomerNumberChange)),
      } as any;

      matDialog.open = jest.fn(() => mockDialogRef) as any;

      component.sendUpdatedIgnoreFlag = jest.fn();

      component.openIgnoreDialog();
      expect(matDialog.open).toHaveBeenCalledTimes(1);
      expect(matDialog.open).toHaveBeenCalledWith(IgnoreFlagDialogComponent, {
        data: IgnoreFlag.None,
      });

      expect(component.sendUpdatedIgnoreFlag).toHaveBeenCalledTimes(1);
      expect(component.sendUpdatedIgnoreFlag).toHaveBeenCalledWith(
        IgnoreFlag.CustomerNumberChange
      );
    });

    it('should do nothing if ignoreFlag is undefined', () => {
      component.rowData = {
        ignoreFlag: IgnoreFlag.None,
      } as SalesSummary;

      const mockDialogRef = {
        afterClosed: jest.fn(() => of(undefined)),
      } as any;

      matDialog.open = jest.fn(() => mockDialogRef) as any;

      component.sendUpdatedIgnoreFlag = jest.fn();

      component.openIgnoreDialog();
      expect(matDialog.open).toHaveBeenCalledTimes(1);
      expect(matDialog.open).toHaveBeenCalledWith(IgnoreFlagDialogComponent, {
        data: IgnoreFlag.None,
      });

      expect(component.sendUpdatedIgnoreFlag).toHaveBeenCalledTimes(0);
    });
  });

  describe('edoValidator', () => {
    it('should return undefined', () => {
      SalesRowDetailsComponent['convertToIsoDateString'] = jest
        .fn()
        .mockReturnValueOnce('2021-08-25T11:43:01.067Z')
        .mockReturnValueOnce('2021-08-25T11:44:18.877Z');

      const validation = component['edoValidator']();

      expect(validation).toBeUndefined();
    });

    it('should return validation error', () => {
      SalesRowDetailsComponent['convertToIsoDateString'] = jest
        .fn()
        .mockReturnValueOnce('2021-08-25T11:44:18.877Z')
        .mockReturnValueOnce('2021-08-25T11:43:01.067Z');

      const validation = component['edoValidator']();
      const expected = { disallowedEdo: true };

      expect(validation).toEqual(expected);
    });
  });

  describe('iconEnter', () => {
    it('should open the menu', () => {
      const menuTrigger: any = { openMenu: jest.fn() };
      component.iconEnter(menuTrigger);
      expect(menuTrigger.openMenu).toHaveBeenCalled();
    });
  });

  describe('iconLeave', () => {
    it('should close the menu after the timeout', () => {
      jest.useFakeTimers();
      const menuTrigger: any = { closeMenu: jest.fn() };

      component.iconLeave(menuTrigger);

      jest.advanceTimersByTime(1501);
      expect(menuTrigger.closeMenu).toHaveBeenCalled();
    });
  });
});
