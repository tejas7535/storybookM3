import { mockProvider } from '@ngneat/spectator/jest';

import { AlertService } from '../../../../feature/alerts/alert.service';
import { SelectableOptionsService } from '../../../../shared/services/selectable-options.service';
import { Stub } from '../../../../shared/test/stub.class';
import { OverviewFilterComponent } from './overview-filter.component';

describe('OverviewFilterComponent', () => {
  let component: OverviewFilterComponent;
  const overviewFilter = {
    customers: [{ id: 'customer-id', text: 'customer-name' }],
    gkams: [{ id: 'gkam-id', text: 'gkam-name' }],
  };

  beforeEach(() => {
    component = Stub.get<OverviewFilterComponent>({
      component: OverviewFilterComponent,
      providers: [
        mockProvider(AlertService, {
          loadActiveAlerts: jest.fn(),
          refreshHashTimer: jest.fn(),
        }),
        mockProvider(SelectableOptionsService, {
          get: jest.fn().mockReturnValue({
            options: [],
            loading: false,
            loadingError: null,
          }),
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should output the filter when the load button is clicked', (done) => {
    component['filterForm'].patchValue(overviewFilter);
    component.onFilterChange.subscribe((filter) => {
      expect(filter).toEqual(overviewFilter);
      done();
    });
    component['applyFilters']();
  });

  it('should output the reseted filter when the rest button is clicked', (done) => {
    component['filterForm'].patchValue(overviewFilter);
    component.onFilterChange.subscribe((filter) => {
      expect(filter).toEqual({ customers: undefined, gkams: undefined });
      done();
    });
    component['resetFilters']();
  });
});
