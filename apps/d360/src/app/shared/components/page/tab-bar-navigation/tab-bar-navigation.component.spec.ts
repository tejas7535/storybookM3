import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { of } from 'rxjs';

import { MockProvider } from 'ng-mocks';

import { appRoutes } from '../../../../app.routes';
import { AppRoutePath } from '../../../../app.routes.enum';
import { AlertService } from '../../../../feature/alerts/alert.service';
import { Alert } from '../../../../feature/alerts/model';
import { UserService } from '../../../services/user.service';
import { Stub } from '../../../test/stub.class';
import { AuthService } from '../../../utils/auth/auth.service';
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
        MockProvider(
          Router,
          {
            get events() {
              return of([]);
            },
          },
          'useValue'
        ),
        MockProvider(ActivatedRoute),
        MockProvider(AuthService, {
          getUserRoles: () => of([]),
        }),
        MockProvider(AlertService, { allActiveAlerts: signal<Alert[]>(null) }),
        MockProvider(HttpClient),
        MockProvider(
          UserService,
          {
            region: signal(''),
            startPage: signal(AppRoutePath.OverviewPage),
            filterVisibleRoutes: jest.fn(() => [] as any),
          },
          'useValue'
        ),
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
