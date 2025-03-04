import { EMPTY, Observable, of, Subject } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { GridReadyEvent, IServerSideDatasource } from 'ag-grid-enterprise';

import {
  AlertDataResult,
  AlertService,
} from '../../../../feature/alerts/alert.service';
import {
  Alert,
  AlertStatus,
  OpenFunction,
  Priority,
} from '../../../../feature/alerts/model';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import {
  OptionsLoadingResult,
  SelectableOptionsService,
} from '../../../../shared/services/selectable-options.service';
import { AlertTableComponent, ContextMenuEntry } from './alert-table.component';

describe('AlertTableComponent', () => {
  let spectator: Spectator<AlertTableComponent>;
  let alertService: SpyObject<AlertService>;
  const refreshSubject = new Subject<void>();
  const createComponent = createComponentFactory({
    component: AlertTableComponent,
    providers: [
      mockProvider(AlertService, {
        getDataFetchedEvent(): Observable<AlertDataResult> {
          return EMPTY;
        },
        getRefreshEvent(): Observable<void> {
          return refreshSubject.asObservable();
        },
        refreshHashTimer: jest.fn(),
        completeAlert: (id: string) => of(id),
        activateAlert: (id: string) => of(id),
        deactivateAlert: (id: string) => of(id),
        loadActiveAlerts: jest.fn(() => of()),
        createAlertDatasource: jest.fn(() => ({}) as IServerSideDatasource),
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

  describe('refresh on action buttons', () => {
    const refreshTest = (alert: Alert, menuText: string) => {
      spectator.component['onGridReady']({
        api: {
          applyServerSideTransaction: jest.fn(),
          setGridOption: jest.fn(),
        },
      } as unknown as GridReadyEvent<Alert>);
      const menu: ContextMenuEntry[] = spectator.component['context'].getMenu({
        data: alert,
      });
      const completeButton = menu.find(
        (element: ContextMenuEntry) => element.text === menuText
      );

      completeButton.onClick();

      expect(alertService.refreshHashTimer).toHaveBeenCalled();
      expect(alertService.loadActiveAlerts).toHaveBeenCalled();
    };

    // eslint-disable-next-line jest/expect-expect
    it('should refresh the counter and refresh the hash, when a complete action in the menu is executed', () => {
      refreshTest(
        {
          alertPriority: undefined,
          deactivated: false,
          open: true,
          priority: false,
          openFunction: OpenFunction.Validation_Of_Demand,
        },
        'alert.action_menu.complete'
      );
    });

    // eslint-disable-next-line jest/expect-expect
    it('should refresh the counter and refresh the hash, when a activate action in the menu is executed', () => {
      refreshTest(
        {
          alertPriority: undefined,
          deactivated: true,
          open: true,
          priority: false,
          openFunction: OpenFunction.Validation_Of_Demand,
        },
        'alert.action_menu.activate'
      );
    });

    // eslint-disable-next-line jest/expect-expect
    it('should refresh the counter and refresh the hash, when a deactivate action in the menu is executed', () => {
      refreshTest(
        {
          alertPriority: undefined,
          deactivated: false,
          open: true,
          priority: false,
          openFunction: OpenFunction.Validation_Of_Demand,
        },
        'alert.action_menu.deactivate'
      );
    });
  });
  it('should refresh alert table and refresh the hash, when the refresh event is dispatched', () => {
    const api = { setGridOption: jest.fn() };
    spectator.component['onGridReady']({
      api,
    } as unknown as GridReadyEvent<Alert>);
    refreshSubject.next();

    expect(alertService.createAlertDatasource).toHaveBeenCalledWith(
      AlertStatus.ACTIVE,
      [Priority.Priority1, Priority.Priority2, Priority.Priority3]
    );
    expect(alertService.refreshHashTimer).toHaveBeenCalled();
  });
});
