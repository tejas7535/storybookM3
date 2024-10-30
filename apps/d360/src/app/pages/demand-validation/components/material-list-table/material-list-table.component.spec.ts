import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { MockModule } from 'ng-mocks';

import { DemandValidationService } from '../../../../feature/demand-validation/demand-validation.service';
import { GlobalSelectionHelperService } from '../../../../feature/global-selection/global-selection.service';
import { TableToolbarComponent } from '../../../../shared/components/ag-grid/table-toolbar/table-toolbar.component';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { MaterialListTableComponent } from './material-list-table.component';

describe('MaterialListTableComponent', () => {
  let spectator: Spectator<MaterialListTableComponent>;

  const createComponent = createComponentFactory({
    component: MaterialListTableComponent,
    imports: [MockModule(AgGridModule)],
    componentMocks: [TableToolbarComponent],
    providers: [
      mockProvider(DemandValidationService, {
        getDataFetchedEvent: jest.fn(),
        createDemandMaterialCustomerDatasource: jest.fn(),
      }),
      mockProvider(GlobalSelectionHelperService, {
        getGlobalSelection: jest.fn(),
      }),
      mockProvider(AgGridLocalizationService, {
        lang: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        visible: true,
        selectedCustomer: {
          customerNumber: '42',
        },
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
