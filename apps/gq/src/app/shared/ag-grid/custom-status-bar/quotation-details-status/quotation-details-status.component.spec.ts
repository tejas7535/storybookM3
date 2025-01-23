import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { IStatusPanelParams } from 'ag-grid-enterprise';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  ACTIVE_CASE_STATE_MOCK,
  AUTH_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
} from '../../../../../testing/mocks';
import { QUOTATION_MOCK } from '../../../../../testing/mocks/models/quotation';
import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { StatusBarModalComponent } from './component/status-bar-modal/status-bar-modal.component';
import { QuotationDetailsStatusComponent } from './quotation-details-status.component';
import { SelectedQuotationDetailsKpiActions } from './store/selected-quotation-details-kpi.actions';

describe('QuotationDetailsStatusComponent', () => {
  let component: QuotationDetailsStatusComponent;
  let spectator: Spectator<QuotationDetailsStatusComponent>;
  let params: IStatusPanelParams;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: QuotationDetailsStatusComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      PushPipe,
      SharedPipesModule,
      StoreModule.forRoot({}),
      EffectsModule.forRoot([]),
      HttpClientTestingModule,
    ],
    mocks: [MatDialog],
    providers: [
      {
        provide: TransformationService,
        useValue: {
          transformNumberCurrency: jest.fn(),
          transformPercentage: jest.fn(),
        },
      },
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
          processCase: PROCESS_CASE_STATE_MOCK,
          activeCase: ACTIVE_CASE_STATE_MOCK,
        },
      }),
      {
        provide: TransformationService,
        useValue: {
          transformPercentage: jest.fn(),
          transformNumberCurrency: jest.fn(),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    matDialogSpyObject = spectator.inject(MatDialog);
    params = {
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn().mockReturnValue([QUOTATION_DETAIL_MOCK]),
        forEachNode: jest.fn(),
      },
    } as unknown as IStatusPanelParams;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should initalize observables',
      marbles((m) => {
        component.ngOnInit();
        m.expect(component.showGPI$).toBeObservable('a', { a: true });
        m.expect(component.showGPM$).toBeObservable('a', { a: true });
        m.expect(component.quotationCurrency$).toBeObservable('a', {
          a: QUOTATION_MOCK.currency,
        });
        m.expect(component.simulationModeEnabled$).toBeObservable('a', {
          a: false,
        });
        m.expect(component.simulatedQuotation$).toBeObservable('a', {
          a: undefined,
        });
      })
    );
  });
  describe('onRowDataUpdated', () => {
    beforeEach(() => {
      component['params'] = params;
      component.onSelectionChange = jest.fn();
    });
    test('should set margin and Value if data exists', () => {
      component.rowValueChanges();

      expect(component.onSelectionChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component['store'].dispatch = jest.fn();

      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
      expect(component['store'].dispatch).toHaveBeenCalledTimes(1);
      expect(component['store'].dispatch).toHaveBeenCalledWith(
        SelectedQuotationDetailsKpiActions.loadQuotationKPI({
          data: [QUOTATION_DETAIL_MOCK],
        })
      );
    });

    test('should not call api if selections didnt change', () => {
      component['params'] = params;
      component['store'].dispatch = jest.fn();
      component.selections = [QUOTATION_DETAIL_MOCK];

      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
      expect(component['store'].dispatch).not.toHaveBeenCalled();
    });
  });

  describe('onFilterChanged', () => {
    test('should set filtered rows', () => {
      component['params'] = params;
      component['totalRowCount'] = 10;
      params.api.getDisplayedRowCount = jest.fn().mockReturnValue(5);
      component.onFilterChanged();

      expect(params.api.getDisplayedRowCount).toHaveBeenCalled();
      expect(component.filteredRows).toEqual(5);
    });
  });
  describe('showAll', () => {
    test('should open dialog', () => {
      component.showAll();

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        StatusBarModalComponent,
        {
          width: '600px',
          data: { filteredAmount: component.filteredRows },
        }
      );
    });
  });
});
