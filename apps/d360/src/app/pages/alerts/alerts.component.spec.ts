import { Observable, of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { AlertService } from '../../feature/alerts/alert.service';
import { AlertStatus } from '../../feature/alerts/model';
import { GlobalSelectionStateService } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import {
  OptionsLoadingResult,
  SelectableOptionsService,
} from '../../shared/services/selectable-options.service';
import { AlertsComponent } from './alerts.component';

describe('AlertsComponent', () => {
  let spectator: Spectator<AlertsComponent>;
  const createComponent = createComponentFactory({
    component: AlertsComponent,
    providers: [
      mockProvider(GlobalSelectionStateService),
      mockProvider(AlertService, {
        getRefreshEvent: (): Observable<void> => of(),
      }),
      mockProvider(SelectableOptionsService, {
        get: (): OptionsLoadingResult => ({ options: [] }),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should update the signal when the alert status is changed', () => {
    const component = spectator.component;
    component['updateStatus']({ id: 'COMPLETED', text: 'Completed' });
    expect(component['selectedStatus']()).toEqual(AlertStatus.COMPLETED);
  });
});
