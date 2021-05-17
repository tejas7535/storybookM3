import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { InfoIconModule } from '../../../shared/info-icon/info-icon.module';
import { ComparableTransactionsComponent } from './comparable-transactions.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
  replace: jest.fn(),
}));

describe('ComparableTransactionsComponent', () => {
  let component: ComparableTransactionsComponent;
  let spectator: Spectator<ComparableTransactionsComponent>;

  const createComponent = createComponentFactory({
    component: ComparableTransactionsComponent,
    imports: [
      AgGridModule,
      InfoIconModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('currency input', () => {
    test('should set tableContext', () => {
      const currency = 'USD';
      component.currency = currency;

      expect(component.tableContext.currency).toEqual(currency);
    });
  });
  describe('columnChange', () => {
    test('should set column state', () => {
      const event = {
        columnApi: {
          getColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].setColumnState = jest.fn();
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnState
      ).toHaveBeenCalledTimes(1);
    });
  });
  describe('onGridReady', () => {
    test('should set columnState', () => {
      const event = {
        columnApi: {
          setColumnState: jest.fn(),
        },
      } as any;

      component['agGridStateService'].getColumnState = jest
        .fn()
        .mockReturnValue('state');
      component.onGridReady(event);
      expect(
        component['agGridStateService'].getColumnState
      ).toHaveBeenCalledTimes(1);
      expect(event.columnApi.setColumnState).toHaveBeenCalledTimes(1);
    });
    test('should not set columnState', () => {
      const event = {
        columnApi: {
          setColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].getColumnState = jest.fn();
      component.onGridReady(event);
      expect(
        component['agGridStateService'].getColumnState
      ).toHaveBeenCalledTimes(1);
      expect(event.columnApi.setColumnState).toHaveBeenCalledTimes(0);
    });
  });
  describe('onFirstDataRendered', () => {
    test('should autoSize customerId with skipHeader', () => {
      const id = 'customerId';
      const element = {
        getColId: jest.fn(() => id),
      };
      const params = {
        columnApi: {
          getAllColumns: jest.fn(() => [element]),
          autoSizeColumn: jest.fn(),
        },
      } as any;

      component.onFirstDataRendered(params);

      expect(params.columnApi.autoSizeColumn).toHaveBeenCalledTimes(1);
      expect(params.columnApi.autoSizeColumn).toBeCalledWith(id, true);
    });
    test('should autoSize without skipHeader', () => {
      const id = 'any';
      const element = {
        getColId: jest.fn(() => id),
      };
      const params = {
        columnApi: {
          getAllColumns: jest.fn(() => [element]),
          autoSizeColumn: jest.fn(),
        },
      } as any;

      component.onFirstDataRendered(params);

      expect(params.columnApi.autoSizeColumn).toHaveBeenCalledTimes(1);
      expect(params.columnApi.autoSizeColumn).toBeCalledWith(id, false);
    });
  });
});
