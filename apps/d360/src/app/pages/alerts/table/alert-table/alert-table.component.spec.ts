import { EMPTY, Observable } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { GridReadyEvent } from 'ag-grid-enterprise';

import {
  AlertDataResult,
  AlertService,
} from '../../../../feature/alerts/alert.service';
import { Alert, AlertStatus, Priority } from '../../../../feature/alerts/model';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import {
  OptionsLoadingResult,
  SelectableOptionsService,
} from '../../../../shared/services/selectable-options.service';
import { AlertTableComponent } from './alert-table.component';

describe('AlertTableComponent', () => {
  let spectator: Spectator<AlertTableComponent>;
  let alertService: AlertService;
  const createComponent = createComponentFactory({
    component: AlertTableComponent,
    providers: [
      mockProvider(AlertService, {
        getDataFetchedEvent(): Observable<AlertDataResult> {
          return EMPTY;
        },
      }),
      mockProvider(GlobalSelectionStateService),
      mockProvider(SelectableOptionsService, {
        get: (): OptionsLoadingResult => ({ options: [] }),
      }),
    ],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        status: AlertStatus.ACTIVE,
        priorities: [
          Priority.Priority1,
          Priority.Priority2,
          Priority.Priority3,
        ],
      },
    });
    alertService = spectator.inject(AlertService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create initial datasource', () => {
    spectator.component['onGridReady']({
      api: { setGridOption: jest.fn() },
    } as unknown as GridReadyEvent<Alert>);
    expect(alertService.createAlertDatasource).toHaveBeenCalledWith(
      AlertStatus.ACTIVE,
      [Priority.Priority1, Priority.Priority2, Priority.Priority3]
    );
  });

  it('should reload the data when an input changes', () => {
    spectator.setInput({
      status: AlertStatus.COMPLETED,
      priorities: [Priority.Priority1, Priority.Priority2],
    });
    spectator.component['onGridReady']({
      api: { setGridOption: jest.fn() },
    } as unknown as GridReadyEvent<Alert>);
    expect(alertService.createAlertDatasource).lastCalledWith(
      AlertStatus.COMPLETED,
      [Priority.Priority1, Priority.Priority2]
    );
  });

  it('should show the no-data overlay, when the row count is 0', () => {
    const showNoRowsOverlayMock = jest.fn();
    spectator.component['onGridReady']({
      api: {
        setGridOption: jest.fn(),
        getDisplayedRowCount: () => 0,
        showNoRowsOverlay: showNoRowsOverlayMock,
      },
    } as unknown as GridReadyEvent<Alert>);
    spectator.component['onDataUpdated']();
    expect(showNoRowsOverlayMock).toHaveBeenCalled();
  });

  it('should show the no-data overlay, when the row count greater than 0', () => {
    const hideOverlayMock = jest.fn();
    spectator.component['onGridReady']({
      api: {
        setGridOption: jest.fn(),
        getDisplayedRowCount: () => 2,
        hideOverlay: hideOverlayMock,
      },
    } as unknown as GridReadyEvent<Alert>);
    spectator.component['onDataUpdated']();
    expect(hideOverlayMock).toHaveBeenCalled();
  });
});
