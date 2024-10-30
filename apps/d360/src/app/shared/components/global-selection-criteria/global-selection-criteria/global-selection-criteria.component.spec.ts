import { FormGroup } from '@angular/forms';

import { of } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { GlobalSelectionHelperService } from '../../../../feature/global-selection/global-selection.service';
import { SelectableOptionsService } from '../../../services/selectable-options.service';
import { SnackbarService } from '../../../utils/service/snackbar.service';
import { GlobalSelectionStateService } from '../global-selection-state.service';
import { MinimizedGlobalSelectionCriteriaComponent } from '../minimized-global-selection-criteria/minimized-global-selection-criteria.component';
import { GlobalSelectionCriteriaComponent } from './global-selection-criteria.component';

describe('GlobalSelectionCriteriaComponent', () => {
  let spectator: Spectator<GlobalSelectionCriteriaComponent>;

  const createComponent = createComponentFactory({
    component: GlobalSelectionCriteriaComponent,
    imports: [MockComponent(MinimizedGlobalSelectionCriteriaComponent)],
    providers: [
      mockProvider(SelectableOptionsService),
      mockProvider(SnackbarService),
      mockProvider(TranslocoLocaleService),
      mockProvider(GlobalSelectionStateService, {
        form: jest.fn().mockReturnValue(new FormGroup({})),
      }),
      mockProvider(GlobalSelectionHelperService, {
        getResultCount: jest.fn().mockReturnValue(of(0)),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
