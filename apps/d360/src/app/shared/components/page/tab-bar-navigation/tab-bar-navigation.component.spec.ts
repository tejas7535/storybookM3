import { provideHttpClient } from '@angular/common/http';
import { Signal, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable, of } from 'rxjs';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { appRoutes, RouteConfig } from 'apps/d360/src/app/app.routes';

import { AppRoutePath } from '../../../../app.routes.enum';
import { AlertService } from '../../../../feature/alerts/alert.service';
import { Region } from '../../../../feature/global-selection/model';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../utils/auth/auth.service';
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
  let mockService: SpyObject<UserService>;
  let routeConfig: Signal<RouteConfig>;
  const roleSubject = new BehaviorSubject([]);

  const createComponent = createComponentFactory({
    component: TabBarNavigationComponent,
    providers: [
      mockProvider(Router, mockRouter),
      mockProvider(ActivatedRoute),
      mockProvider(AuthService, {
        getUserRoles(): Observable<any> {
          return roleSubject;
        },
      }),
      mockProvider(AlertService),
      provideHttpClient(),
      mockProvider(UserService, {
        region: signal(''),
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
    mockService = spectator.inject(UserService);
    routeConfig = spectator.component['routeConfig'];
  });

  describe('functions menu', () => {
    it('should create', () => {
      expect(spectator.component).toBeTruthy();
    });

    it('should not show the overview menu entry in the general section for chinese users', () => {
      mockService.region.set(Region.GreaterChina);
      expect(routeConfig().functions.general.length).toBe(0);
    });

    it('should show the overview menu entry in the general section for EU users', () => {
      mockService.region.set(Region.Europe);

      const generalMenuEntries = routeConfig().functions.general;
      expect(generalMenuEntries.length).toBe(1);
      expect(generalMenuEntries[0].path).toEqual(AppRoutePath.OverviewPage);
    });

    it('should not show the alert-rule menu items when the user has no roles', () => {
      mockService.region.set(Region.GreaterChina);
      expect(spectator.component['userRoles']()).toEqual([]);
      expect(routeConfig().functions.general.length).toBe(0);
    });

    it('should show the restricted menu items when user has on of the the needed roles', () => {
      mockService.region.set(Region.GreaterChina);
      roleSubject.next(['SD-D360_RO', 'SD-D360_ADMIN=SW']);
      expect(routeConfig().functions.general.length).toBe(1);
      expect(routeConfig().functions.general[0].path).toBe(
        AppRoutePath.AlertRuleManagementPage
      );
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
