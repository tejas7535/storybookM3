import { mockProvider } from '@ngneat/spectator/jest';

import { AlertService } from '../../../../feature/alerts/alert.service';
import { SelectableOptionsService } from '../../../../shared/services/selectable-options.service';
import { Stub } from '../../../../shared/test/stub.class';
import {
  OverviewFilterComponent,
  OverviewFilterValue,
} from './overview-filter.component';

describe('OverviewFilterComponent', () => {
  let component: OverviewFilterComponent;
  const overviewFilter = {
    customers: [{ id: 'customer-id', text: 'customer-name' }],
    gkams: [{ id: 'gkam-id', text: 'gkam-name' }],
  };
  let filterChangeSpy: jest.SpyInstance;

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
    filterChangeSpy = jest.spyOn(component['onFilterChange'], 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('applyFilters', () => {
    it('should output the filter when the load button is clicked', () => {
      component['filterForm'].patchValue(overviewFilter);

      component['applyFilters']();
      expect(filterChangeSpy).toHaveBeenCalledWith(overviewFilter);
    });
  });

  describe('resetFilters', () => {
    it('should output the reseted filter when the rest button is clicked', () => {
      component['filterForm'].patchValue(overviewFilter);
      component['resetFilters']();
      expect(filterChangeSpy).toHaveBeenCalledWith({
        customers: undefined,
        gkams: undefined,
      });
    });
  });

  describe('computeReturnFilter', () => {
    it('return the correct filter', () => {
      const result = component['computeReturnFilter'](overviewFilter);
      expect(result).toEqual(overviewFilter);
    });

    it('return undefined when empty', () => {
      const filter: OverviewFilterValue = {
        gkams: [],
        customers: [],
      };
      const result = component['computeReturnFilter'](filter);
      expect(result).toEqual({ customers: undefined, gkams: undefined });
    });
  });
});
