import { appRoutes } from '../../../app.routes';
import { AppRoutePath } from '../../../app.routes.enum';
import { Alert } from '../../../feature/alerts/model';
import { Stub } from '../../test/stub.class';
import {
  TabBarNavigationComponent,
  TabItem,
} from './tab-bar-navigation.component';

describe('TabBarNavigationComponent', () => {
  let component: TabBarNavigationComponent;

  beforeEach(() => {
    component = Stub.getForEffect<TabBarNavigationComponent>({
      component: TabBarNavigationComponent,
      providers: [
        Stub.getAlertServiceProvider(),
        Stub.getUserServiceProvider({
          userSettings: { startPage: AppRoutePath.OverviewPage },
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('functions menu', () => {
    it('should show the todo page in the general section of the function menu', () => {
      const generalSection = component['routeConfig']().functions.general;
      expect(
        generalSection.findIndex(
          (entry) => entry.label === 'tabbar.tasks.label'
        )
      ).not.toBe(-1);
    });
  });

  describe('active tab', () => {
    it('should mark the start-page tab as active, when the user navigates to the root route', () => {
      Stub.setInput('activeUrl', AppRoutePath.OverviewPage);
      Stub.detectChanges();

      expect(component['activeTab']()).toBe(TabItem.StartPage);
    });

    it('should mark the function tab as active, when the user navigates to a function route', () => {
      Stub.setInput('activeUrl', appRoutes.functions.demandSuite[0].path);
      Stub.detectChanges();

      expect(component['activeTab']()).toBe(TabItem.Functions);
    });

    it('should mark the to-dos tab as active, when the user navigates to the to-dos route', () => {
      Stub.setInput('activeUrl', AppRoutePath.TodoPage);
      Stub.detectChanges();

      expect(component['activeTab']()).toBe(TabItem.ToDos);
    });
  });

  describe('getTabItemForRoute method', () => {
    it('should return TabItem.StartPage for start page route without leading slash', () => {
      const result = component['getTabItemForRoute'](AppRoutePath.OverviewPage);
      expect(result).toBe(TabItem.StartPage);
    });

    it('should return TabItem.StartPage for start page route with leading slash', () => {
      const result = component['getTabItemForRoute'](
        `/${AppRoutePath.OverviewPage}`
      );
      expect(result).toBe(TabItem.StartPage);
    });

    it('should return TabItem.ToDos for todo page route without leading slash', () => {
      const result = component['getTabItemForRoute'](AppRoutePath.TodoPage);
      expect(result).toBe(TabItem.ToDos);
    });

    it('should return TabItem.ToDos for todo page route with leading slash', () => {
      const result = component['getTabItemForRoute'](
        `/${AppRoutePath.TodoPage}`
      );
      expect(result).toBe(TabItem.ToDos);
    });

    it('should return TabItem.Functions for any other route', () => {
      const result = component['getTabItemForRoute']('/some-other-route');
      expect(result).toBe(TabItem.Functions);
    });

    it('should handle route changes correctly when userSettings are updated', () => {
      // Mock updated user settings with a different start page
      const mockUserSettings = { startPage: 'custom-start-page' } as any;
      component['userService'].userSettings.set(mockUserSettings);

      // Test with the new start page
      const result = component['getTabItemForRoute']('custom-start-page');
      expect(result).toBe(TabItem.StartPage);
    });
  });

  describe('alert counts', () => {
    it('should calculate priority 1 alert count correctly', () => {
      const mockAlerts: Alert[] = [
        { alertPriority: 1, id: '1' } as Alert,
        { alertPriority: 1, id: '2' } as Alert,
        { alertPriority: 2, id: '3' } as Alert,
      ];

      component['alertService'].allActiveAlerts.set(mockAlerts);
      expect(component['prio1Count']()).toBe(2);
    });

    it('should calculate priority 2 alert count correctly', () => {
      const mockAlerts: Alert[] = [
        { alertPriority: 1, id: '1' } as Alert,
        { alertPriority: 2, id: '2' } as Alert,
        { alertPriority: 2, id: '3' } as Alert,
      ];

      component['alertService'].allActiveAlerts.set(mockAlerts);
      expect(component['prio2Count']()).toBe(2);
    });

    it('should calculate info alert count correctly', () => {
      const mockAlerts: Alert[] = [
        { alertPriority: 1, id: '1' } as Alert,
        { alertPriority: 3, id: '2' } as Alert,
        { alertPriority: 3, id: '3' } as Alert,
      ];

      component['alertService'].allActiveAlerts.set(mockAlerts);
      expect(component['infoCount']()).toBe(2);
    });

    it('should return zero when no alerts are available', () => {
      component['alertService'].allActiveAlerts.set([]);
      expect(component['prio1Count']()).toBe(0);
      expect(component['prio2Count']()).toBe(0);
      expect(component['infoCount']()).toBe(0);
    });
  });

  describe('routeConfig computation', () => {
    it('should include filtered visible routes from userService', () => {
      const mockSalesSuiteRoutes = [{ path: 'test-sales', label: 'Sales' }];
      const mockDemandSuiteRoutes = [{ path: 'test-demand', label: 'Demand' }];
      const mockGeneralRoutes = [{ path: 'test-general', label: 'General' }];

      jest
        .spyOn(component['userService'], 'filterVisibleRoutes')
        .mockImplementation((routes: any): any[] => {
          if (routes === appRoutes.functions.salesSuite) {
            return mockSalesSuiteRoutes;
          }
          if (routes === appRoutes.functions.demandSuite) {
            return mockDemandSuiteRoutes;
          }
          if (routes === appRoutes.functions.general) {
            return mockGeneralRoutes;
          }

          return [];
        });

      const config = component['routeConfig']();

      expect(config.functions.salesSuite).toEqual(mockSalesSuiteRoutes);
      expect(config.functions.demandSuite).toEqual(mockDemandSuiteRoutes);
      expect(config.functions.general).toContain(mockGeneralRoutes[0]);
      expect(config.functions.general).toContain(appRoutes.todos);
    });
  });

  describe('constructor effect', () => {
    it('should update activeTab when activeUrl changes', () => {
      const getTabItemForRouteSpy = jest.spyOn(
        component as any,
        'getTabItemForRoute'
      );

      Stub.setInput('activeUrl', '/test-route');
      Stub.detectChanges();

      expect(getTabItemForRouteSpy).toHaveBeenCalledWith('/test-route');
      expect(component['activeTab']()).toBe(TabItem.Functions);

      Stub.setInput('activeUrl', AppRoutePath.TodoPage);
      Stub.detectChanges();

      expect(getTabItemForRouteSpy).toHaveBeenCalledWith(AppRoutePath.TodoPage);
      expect(component['activeTab']()).toBe(TabItem.ToDos);
    });

    it('should call activeTab getter during effect to trigger change detection', () => {
      const activeTabSpy = jest.spyOn(component['activeTab'], 'set');

      Stub.setInput('activeUrl', '/new-route');
      Stub.detectChanges();

      expect(activeTabSpy).toHaveBeenCalled();
      // The implementation calls activeTab() which should trigger the getter
      expect(component['activeTab']()).toBeDefined();
    });
  });
});
