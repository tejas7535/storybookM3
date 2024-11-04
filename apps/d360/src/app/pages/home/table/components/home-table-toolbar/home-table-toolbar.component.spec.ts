import { MatDialog } from '@angular/material/dialog';

import { of } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { MaterialCustomerService } from '../../../../../feature/material-customer/material-customer.service';
import { GlobalSelectionStateService } from '../../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { FilterDropdownComponent } from '../../../../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { MaterialCustomerTableService } from '../../services/material-customer-table.service';
import { HomeTableToolbarComponent } from './home-table-toolbar.component';

describe('HomeTableToolbar', () => {
  let spectator: Spectator<HomeTableToolbarComponent>;
  const createComponent = createComponentFactory({
    component: HomeTableToolbarComponent,
    componentMocks: [FilterDropdownComponent],
    providers: [
      mockProvider(MaterialCustomerService),
      mockProvider(MaterialCustomerTableService, {
        getDataFetchedEvent: jest.fn().mockReturnValue(of({})),
      }),
      mockProvider(TranslocoLocaleService),
      mockProvider(GlobalSelectionStateService, {
        isEmpty: jest.fn(),
      }),
      mockProvider(MatDialog, {
        open: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        resetLayout: jest.fn(),
        saveLayout: jest.fn(),
        loadLayout: jest.fn(),
        globalSelection: null,
        gridApi: null,
        columnApi: null,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
