import { Stub } from '../../shared/test/stub.class';
import { OverviewComponent } from './overview.component';

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
  });

  describe('onOverviewFilterReset', () => {
    it('should reset the filter when the overview filter is reset', () => {
      const resetSpy = jest.spyOn(component as any, 'onOverviewFilterReset');
      expect(resetSpy).not.toHaveBeenCalled();
    });

    it('should call resetSelection on customerSalesPlanningGrid when filter is reset', () => {
      // Mock the viewChild reference
      const mockGrid = { resetSelection: jest.fn() };
      jest
        .spyOn(component as any, 'customerSalesPlanningGrid')
        .mockReturnValue(mockGrid);

      component['onOverviewFilterReset']();

      expect(mockGrid.resetSelection).toHaveBeenCalled();
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

    it('should set isAssignedToMe to true if no user settings exist', () => {
      // Override the userSettings stub to return null for the overviewPage
      jest.spyOn(component['userService'], 'userSettings').mockReturnValue({
        systemMessage: null,
        demandValidation: null,
        startPage: null,
        overviewPage: null,
      });

      component.ngOnInit();
      component['userService'].settingsLoaded$.next(true);

      expect(component['isAssignedToMe']()).toBe(true);
    });
  });

  describe('globalSelection', () => {
    it('should compute global selection state correctly', () => {
      component['overviewFilterValue'].set({
        gkams: [{ id: 'gkam-1', text: 'GKAM 1' }],
        customers: [{ id: 'customer-1', text: 'Customer 1' }],
      });

      const globalSelection = component['globalSelection']();

      expect(globalSelection.gkamNumber).toEqual([
        { id: 'gkam-1', text: 'GKAM 1' },
      ]);
      expect(globalSelection.customerNumber).toEqual([
        { id: 'customer-1', text: 'Customer 1' },
      ]);
      expect(globalSelection.region).toEqual([]);
      expect(globalSelection.salesArea).toEqual([]);
      expect(globalSelection.materialNumber).toEqual([]);
    });

    it('should handle empty filter values', () => {
      component['overviewFilterValue'].set({
        gkams: [],
        customers: [],
      });

      const globalSelection = component['globalSelection']();

      expect(globalSelection.gkamNumber).toEqual([]);
      expect(globalSelection.customerNumber).toEqual([]);
    });

    it('should handle null filter values', () => {
      component['overviewFilterValue'].set(null);

      const globalSelection = component['globalSelection']();

      expect(globalSelection.gkamNumber).toEqual([]);
      expect(globalSelection.customerNumber).toEqual([]);
    });
  });

  describe('selectedCustomer', () => {
    it('should initialize with null value', () => {
      expect(component['selectedCustomer']()).toBeNull();
    });
  });
});
