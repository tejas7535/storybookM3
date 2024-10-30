import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { MockComponent, MockModule } from 'ng-mocks';

import { MaterialCustomerService } from '../../../../../feature/material-customer/material-customer.service';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import { MaterialCustomerColumnLayoutsService } from '../../services/material-customer-column-layout.service';
import { HomeTableToolbarComponent } from '../home-table-toolbar/home-table-toolbar.component';
import { MaterialCustomerTableComponent } from './material-customer-table.component';

describe('MaterialCustomerTableComponent', () => {
  let spectator: Spectator<MaterialCustomerTableComponent>;
  const createComponent = createComponentFactory({
    component: MaterialCustomerTableComponent,
    imports: [
      MockModule(AgGridModule),
      MockComponent(HomeTableToolbarComponent),
    ],
    providers: [
      {
        provide: MaterialCustomerService,
        useValue: {
          getCriteriaData: jest.fn().mockReturnValue(
            of({
              filterableFields: [],
              sortableFields: [],
            })
          ),
          createMaterialCustomerDatasource: jest.fn(),
        },
      },
      {
        provide: MaterialCustomerColumnLayoutsService,
        useValue: {
          useMaterialCustomerColumnLayouts: jest.fn(),
        },
      },
      {
        provide: AgGridLocalizationService,
        useValue: {
          lang: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
