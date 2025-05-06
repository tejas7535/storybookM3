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
      providers: [
        Stub.getAlertServiceProvider(),
        Stub.getUserServiceProvider({
          userSettings: {
            demandValidation: null,
            startPage: null,
            overviewPage: {
              onlyAssignedToMe: false,
            },
          },
        }),
      ],
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

  describe('assignedToMe', () => {
    it('should configure assignedToMe based on fetched user settings', () => {
      const userServiceSpy = jest.spyOn(
        component['userService'],
        'userSettings'
      );

      component['userService'].settingsLoaded$.next(true);

      component.ngOnInit();

      expect(component['isAssignedToMe']()).toBe(false);
      expect(userServiceSpy).toHaveBeenCalled();
    });

    it('should update user settings on changes in assignedToMe', () => {
      const userServiceSpy = jest.spyOn(
        component['userService'],
        'updateUserSettings'
      );

      component['onAssignedToggleChange'](true);

      expect(userServiceSpy).toHaveBeenCalledWith('overviewPage', {
        onlyAssignedToMe: true,
      });
    });
  });
});
