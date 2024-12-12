import { Observable, of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { AlertService } from '../../feature/alerts/alert.service';
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

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
