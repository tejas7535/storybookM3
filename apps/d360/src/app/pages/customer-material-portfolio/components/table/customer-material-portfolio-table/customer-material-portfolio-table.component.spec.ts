import { of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { AgGridModule } from 'ag-grid-angular';

import { CMPService } from '../../../../../feature/customer-material-portfolio/cmp.service';
import { GlobalSelectionState } from '../../../../../shared/components/global-selection-criteria/global-selection-state.service';
import { AgGridLocalizationService } from '../../../../../shared/services/ag-grid-localization.service';
import { CustomerMaterialPortfolioTableComponent } from './customer-material-portfolio-table.component';

describe('CustomerMaterialPortfolioTableComponent', () => {
  let spectator: Spectator<CustomerMaterialPortfolioTableComponent>;
  const createComponent = createComponentFactory({
    component: CustomerMaterialPortfolioTableComponent,
    imports: [AgGridModule],
    providers: [
      mockProvider(CMPService, {
        getCMPCriteriaData: jest.fn().mockReturnValue(
          of({
            filterableFields: [],
            sortableFields: [],
          })
        ),
      }),
      mockProvider(AgGridLocalizationService, {
        lang: jest.fn(),
      }),
      mockProvider(Store, {
        select: jest.fn().mockReturnValue(of([])),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        selectedCustomer: {
          customerNumber: '123',
        },
        globalSelection: {} as GlobalSelectionState,
        filterModel: {},
        refreshCounter: 0,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
