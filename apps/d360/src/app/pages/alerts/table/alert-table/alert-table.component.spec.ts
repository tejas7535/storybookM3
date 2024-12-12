import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { AlertService } from '../../../../feature/alerts/alert.service';
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import {
  OptionsLoadingResult,
  SelectableOptionsService,
} from '../../../../shared/services/selectable-options.service';
import { AlertTableComponent } from './alert-table.component';

describe('AlertTableComponent', () => {
  let spectator: Spectator<AlertTableComponent>;
  const createComponent = createComponentFactory({
    component: AlertTableComponent,
    providers: [
      mockProvider(AlertService),
      mockProvider(GlobalSelectionStateService),
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
