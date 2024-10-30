import { FormGroup } from '@angular/forms';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import {
  GlobalSelectionFilters,
  GlobalSelectionState,
} from '../global-selection-state.service';
import { MinimizedGlobalSelectionCriteriaComponent } from '../minimized-global-selection-criteria/minimized-global-selection-criteria.component';

describe('MinimizedGlobalSelectionCriteriaComponent', () => {
  let spectator: Spectator<MinimizedGlobalSelectionCriteriaComponent>;

  const createComponent = createComponentFactory({
    component: MinimizedGlobalSelectionCriteriaComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        filters: {} as GlobalSelectionState,
        form: new FormGroup<GlobalSelectionFilters>(
          {} as GlobalSelectionFilters
        ),
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
