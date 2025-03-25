import { appRoutes } from '../../../../app.routes';
import { AppRoutePath } from '../../../../app.routes.enum';
import { Stub } from '../../../test/stub.class';
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
});
