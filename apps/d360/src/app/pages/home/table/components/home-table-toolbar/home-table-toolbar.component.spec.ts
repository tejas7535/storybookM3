import { MatDialog } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { MaterialCustomerService } from '../../../../../feature/material-customer/material-customer.service';
import { GlobalSelectionStateService } from '../../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { FilterDropdownComponent } from '../../../../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { HomeTableToolbarComponent } from './home-table-toolbar.component';

describe('HomeTableToolbar', () => {
  let spectator: Spectator<HomeTableToolbarComponent>;
  const createComponent = createComponentFactory({
    component: HomeTableToolbarComponent,
    componentMocks: [FilterDropdownComponent],
    providers: [
      {
        provide: MaterialCustomerService,
        useValue: {
          closeAll: jest.fn(),
        },
      },
      {
        provide: GlobalSelectionStateService,
        useValue: {
          isEmpty: jest.fn(),
        },
      },
      {
        provide: MatDialog,
        useValue: {
          open: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        resetLayout: jest.fn(),
        saveLayout: jest.fn(),
        loadLayout: jest.fn(),
        currentLayoutId: '1',
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
