import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { LetDirective } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { IStatusPanelParams } from 'ag-grid-enterprise';
import { MockDirective } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SelectedQuotationDetailsKpiState } from '../quotation-details-status/store/selected-quotation-details-kpi.reducer';
import { TotalRowCountComponent } from './total-row-count.component';

describe('TotalRowCountComponent', () => {
  let component: TotalRowCountComponent;
  let spectator: Spectator<TotalRowCountComponent>;
  let params: IStatusPanelParams;
  const expectedRowCount = 1;

  const store: SelectedQuotationDetailsKpiState = {
    loading: false,
    error: undefined,
    selectedQuotationDetailsKpi: {
      amountOfQuotationDetails: 0,
      totalNetValue: null,
      totalWeightedAveragePriceDiff: null,
      totalWeightedAverageGpi: null,
      totalWeightedAverageGpm: null,
      avgGqRating: null,
    },
  };
  const createComponent = createComponentFactory({
    component: TotalRowCountComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockDirective(LetDirective),
    ],
    providers: [
      provideMockStore({
        initialState: {
          selectedQuotationDetailsKpi: store,
          activeCase: {
            simulatedItem: undefined,
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    params = {
      api: {
        addEventListener: jest.fn(),
        getDisplayedRowCount: jest.fn(() => expectedRowCount),
        getSelectedRows: jest.fn(() => [1]),
      },
    } as any as IStatusPanelParams;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('agInit', () => {
    test('should set params and add event listener', () => {
      component.agInit(params);

      expect(component['params']).toEqual(params);
      expect(component['params'].api.addEventListener).toHaveBeenCalledTimes(1);
      expect(component.simulationModeEnabled$).toBeDefined();
    });
  });

  describe('onFilterChange', () => {
    test('should set filteredRowCount', () => {
      component['params'] = params;
      component['params'].api.getDisplayedRowCount = jest.fn(() => 5);
      component['totalRowCount'] = 10;
      component.onFilterChange();

      expect(
        component['params'].api.getDisplayedRowCount
      ).toHaveBeenCalledTimes(1);
      expect(component.filteredRowCount).toEqual(5);
    });
  });
});
