import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

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
import { GlobalSelectionStateService } from '../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { SelectableOptionsService } from '../../../../shared/services/selectable-options.service';
import { MaterialListTableComponent } from './material-list-table.component';

describe('MaterialListTableComponent', () => {
  let spectator: Spectator<MaterialListTableComponent>;

  const createComponent = createComponentFactory({
    component: MaterialListTableComponent,
    imports: [MockModule(AgGridModule)],
    componentMocks: [TableToolbarComponent],
    providers: [
      mockProvider(HttpClient, { get: () => of({}) }),
      mockProvider(SelectableOptionsService, {
        get: () => of({}),
        loading$: of(false),
      }),
      mockProvider(GlobalSelectionStateService),
      mockProvider(DemandValidationService, {
        getDataFetchedEvent: jest.fn(),
        createDemandMaterialCustomerDatasource: jest.fn(),
      }),
      mockProvider(GlobalSelectionHelperService),
      mockProvider(AgGridLocalizationService, {
        lang: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        visible: true,
        selectedCustomerNumber: '42',
        demandValidationFilters: {} as any,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
