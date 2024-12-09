import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { MockComponent, MockModule } from 'ng-mocks';

import { MaterialCustomerService } from '../../../../../feature/material-customer/material-customer.service';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import { MaterialCustomerTableService } from '../../services/material-customer-table.service';
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
      mockProvider(MaterialCustomerTableService, {
        useMaterialCustomerColumnLayouts: jest.fn(),
      }),
      mockProvider(AgGridLocalizationService, {
        lang: jest.fn(),
      }),
      mockProvider(HttpClient, { get: () => of({}) }),
    ],
  });
  beforeEach(() => {
    spectator = createComponent({
      props: {
        selectionFilter: null,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
