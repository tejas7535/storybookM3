import { translate } from '@jsverse/transloco';

import { Stub } from '../../shared/test/stub.class';
import {
  CustomerSalesPlanningLayout,
  OverviewComponent,
} from './overview.component';

describe('OverviewComponent', () => {
  let component: OverviewComponent;

  beforeEach(() => {
    component = Stub.get<OverviewComponent>({
      component: OverviewComponent,
      providers: [Stub.getAlertServiceProvider()],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('init', () => {
    it('should compute the filters for the priority grid', () => {
      component['overviewFilterValue'].set({
        gkams: [{ id: 'gkam-id', text: 'gkam-name' }],
        customers: [{ id: 'customer-id', text: 'customer-name' }],
      });
      expect(component['gkamFilterIds']()).toEqual(['gkam-id']);
      expect(component['customerFilterIds']()).toEqual(['customer-id']);
    });

    it('should have the previousToCurrent layout by default', () => {
      expect(component['selectedLayout']()).toBe(
        CustomerSalesPlanningLayout.PreviousToCurrent
      );
    });
  });

  describe('onLayoutSelectionChange', () => {
    it('should select the column layout', () => {
      component['onLayoutSelectionChange']({
        id: CustomerSalesPlanningLayout.CurrentToNext,
        text: translate('overview.yourCustomer.layout.currentToNext'),
      });
      expect(component['selectedLayout']()).toBe(
        CustomerSalesPlanningLayout.CurrentToNext
      );
    });
  });

  describe('onOverviewFilterReset', () => {
    it('should reset the filter when the overview filter is reset', () => {
      const resetSpy = jest.spyOn(component as any, 'onOverviewFilterReset');
      expect(resetSpy).not.toHaveBeenCalled();
    });
  });
});
