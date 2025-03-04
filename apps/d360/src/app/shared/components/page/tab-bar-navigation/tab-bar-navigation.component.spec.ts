import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable, of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { appRoutes } from 'apps/d360/src/app/app.routes';

import { AppRoutePath } from '../../../../app.routes.enum';
import { AlertService } from '../../../../feature/alerts/alert.service';
import { Alert } from '../../../../feature/alerts/model';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../utils/auth/auth.service';
import { Role } from '../../../utils/auth/roles';
import {
  TabBarNavigationComponent,
  TabItem,
} from './tab-bar-navigation.component';

const mockRouter = {
  get events() {
    return of([]);
  },
};

describe('TabBarNavigationComponent', () => {
  let spectator: Spectator<TabBarNavigationComponent>;
  const roleSubject = new BehaviorSubject<Role[]>([]);

  const createComponent = createComponentFactory({
    component: TabBarNavigationComponent,
    providers: [
      mockProvider(Router, mockRouter),
      mockProvider(ActivatedRoute),
      mockProvider(AuthService, {
        getUserRoles(): Observable<Role[]> {
          return roleSubject;
        },
      }),
      mockProvider(AlertService, { allActiveAlerts: signal<Alert[]>(null) }),
      mockProvider(UserService, {
        filterVisibleRoutes: jest.fn(() => []),
        startPage: signal(AppRoutePath.OverviewPage),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        activeUrl: '',
      },
    });
  });

  describe('functions menu', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });
  });

  describe('active tab', () => {
    it('should mark the start-page tab as active, when the user navigates to the root route', () => {
      spectator.setInput({ activeUrl: AppRoutePath.OverviewPage });
      expect(spectator.component['activeTab']()).toBe(TabItem.StartPage);
    });

    it('should mark the function tab as active, when the user navigates to a function route', () => {
      spectator.setInput({
        activeUrl: appRoutes.functions.demandSuite[0].path,
      });
      expect(spectator.component['activeTab']()).toBe(TabItem.Functions);
    });

    it('should mark the to-dos tab as active, when the user navigates to the to-dos route', () => {
      spectator.setInput({
        activeUrl: 'to-dos',
      });
      expect(spectator.component['activeTab']()).toBe(TabItem.ToDos);
    });

    it('should not mark the functions tab as active, when the user clicks on the functions tab', () => {
      spectator.setInput({
        activeUrl: AppRoutePath.OverviewPage,
      });
      const functionsTab = spectator.debugElement.query(
        By.css('.navigation-tab.functions')
      );
      functionsTab.nativeElement.click();

      expect(spectator.component['activeTab']()).toBe(TabItem.StartPage);
    });
  });
});
