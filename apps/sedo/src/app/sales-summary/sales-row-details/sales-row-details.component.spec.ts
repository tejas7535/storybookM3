import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { of } from 'rxjs';

import { GridApi } from '@ag-grid-enterprise/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { SnackBarModule, SnackBarService } from '@schaeffler/snackbar';

import { APP_STATE_MOCK } from '../../../testing/mocks/app-state-mock';
import { salesSummaryMock } from '../../../testing/mocks/sales-summary.mock';
import { SalesSummary } from '../../core/store/reducers/sales-summary/models/sales-summary.model';
import { DataService } from '../../shared/data.service';
import { UpdateDatesParams } from '../../shared/models/dates-update.model';
import { SalesRowDetailsComponent } from './sales-row-details.component';

describe('SalesRowDetailsComponent', () => {
  let component: SalesRowDetailsComponent;
  let spectator: Spectator<SalesRowDetailsComponent>;
  let dataService: DataService;
  let snackBarService: SnackBarService;

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
      BrowserDynamicTestingModule,
      HttpClientTestingModule,
      SnackBarModule,
    ],
    providers: [
      provideMockStore({
        initialState: APP_STATE_MOCK,
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    dataService = spectator.inject(DataService);
    snackBarService = spectator.inject(SnackBarService);
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
      component.subscription.unsubscribe = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalled();
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
      component.rowData = ({
        eopDateTemp: salesSummaryMock.eopDateTemp,
        edoDate: salesSummaryMock.edoDate,
      } as unknown) as SalesSummary;

      component['setInitialFormValues']();

      expect(component.datesFormGroup.get('eopDateControl').value).toEqual(
        salesSummaryMock.eopDateTemp
      );
      expect(component.datesFormGroup.get('edoDateControl').value).toEqual(
        salesSummaryMock.edoDate
      );
    });

    it('should set formcontrol values with eopDateVerified', () => {
      component.rowData = ({
        // tslint:disable-next-line: no-null-keyword
        eopDateTemp: null,
        eopDateVerified: salesSummaryMock.eopDateVerified,
        edoDate: salesSummaryMock.edoDate,
      } as unknown) as SalesSummary;

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
    it('should disable the form group because missing rowData.lastModifier', () => {
      component.datesFormGroup.disable = jest.fn();
      component.rowData = ({
        // tslint:disable-next-line: no-null-keyword
        lastModifier: null,
      } as unknown) as SalesSummary;
      component['handleUserAccess']('');

      expect(component.datesFormGroup.disable).toHaveBeenCalledTimes(1);
    });

    it('should disable the datesFormGroup because of wrong user', () => {
      component.datesFormGroup.disable = jest.fn();
      component.rowData = ({
        lastModifier: 'wrong user',
      } as unknown) as SalesSummary;
      component['handleUserAccess']('user');

      expect(component.datesFormGroup.disable).toHaveBeenCalledTimes(1);
    });

    it('should not disable the form group', () => {
      component.datesFormGroup.disable = jest.fn();
      component.rowData = ({
        // tslint:disable-next-line: no-null-keyword
        lastModifier: 'USER',
      } as unknown) as SalesSummary;
      component['handleUserAccess']('user');

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
    it(
      'should send update, reload grid and show success message',
      waitForAsync(() => {
        dataService.updateDates = jest.fn().mockResolvedValue({});
        component.gridApi = ({
          refreshServerSideStore: jest.fn(),
        } as unknown) as GridApi;
        snackBarService.showSuccessMessage = jest.fn().mockReturnValue(of());
        snackBarService.showErrorMessage = jest.fn();

        component.rowData = ({
          combinedKey: salesSummaryMock.combinedKey,
        } as unknown) as SalesSummary;

        const dateString = new Date(Date.UTC(2020, 0, 1, 10, 0)).toISOString();

        SalesRowDetailsComponent[
          'convertToIsoDateString'
        ] = jest.fn().mockReturnValue(dateString);

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

          expect(
            component.gridApi.refreshServerSideStore
          ).toHaveBeenCalledTimes(1);

          expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(1);
          expect(snackBarService.showSuccessMessage).toHaveBeenCalledWith(
            'Update successful'
          );

          expect(snackBarService.showErrorMessage).toHaveBeenCalledTimes(0);
        });
      })
    );

    it(
      'should show an error message on error',
      waitForAsync(() => {
        dataService.updateDates = jest.fn().mockRejectedValue({});
        component.gridApi = ({
          refreshServerSideStore: jest.fn(),
        } as unknown) as GridApi;
        snackBarService.showSuccessMessage = jest.fn();
        snackBarService.showErrorMessage = jest.fn().mockReturnValue(of());

        component.rowData = ({
          combinedKey: salesSummaryMock.combinedKey,
        } as unknown) as SalesSummary;

        const dateString = new Date(Date.UTC(2020, 0, 1, 10, 0)).toISOString();

        SalesRowDetailsComponent[
          'convertToIsoDateString'
        ] = jest.fn().mockReturnValue(dateString);

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

          expect(
            component.gridApi.refreshServerSideStore
          ).toHaveBeenCalledTimes(0);

          expect(snackBarService.showSuccessMessage).toHaveBeenCalledTimes(0);

          expect(snackBarService.showErrorMessage).toHaveBeenCalledTimes(1);
          expect(snackBarService.showErrorMessage).toHaveBeenCalledWith(
            'Update failed'
          );
        });
      })
    );

    it(
      'should do nothing if datesFormGroup is not valid',
      waitForAsync(() => {
        dataService.updateDates = jest.fn().mockRejectedValue({});

        SalesRowDetailsComponent['convertToIsoDateString'] = jest.fn();

        component.datesFormGroup
          .get('eopDateControl')
          .setErrors({ incorrect: true });

        component.sendUpdatedDates();
        expect(dataService.updateDates).toHaveBeenCalledTimes(0);
        expect(
          SalesRowDetailsComponent['convertToIsoDateString']
        ).toHaveBeenCalledTimes(0);
      })
    );
  });
});
