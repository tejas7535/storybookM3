import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { FilterDropdownComponent } from '../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { AgGridLocalizationService } from '../../shared/services/ag-grid-localization.service';
import { SelectableOptionsService } from '../../shared/services/selectable-options.service';
import { InternalMaterialReplacementComponent } from './internal-material-replacement.component';

describe('InternalMaterialReplacementComponent', () => {
  let spectator: Spectator<InternalMaterialReplacementComponent>;
  const createComponent = createComponentFactory({
    component: InternalMaterialReplacementComponent,
    componentMocks: [
      InternalMaterialReplacementComponent,
      FilterDropdownComponent,
    ],
    providers: [
      mockProvider(MatDialog, {
        open: jest.fn(),
      }),
      mockProvider(HttpClient, { get: () => of({}) }),
      mockProvider(AgGridLocalizationService, { lang: () => {} }),
      mockProvider(SelectableOptionsService, {
        get: jest.fn().mockReturnValue({
          options: ['option1', 'option2'],
          loading: false,
          loadingError: null,
        }),
        loading$: of(false),
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
