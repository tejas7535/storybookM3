import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { appRoutes, RouteConfig } from '../../../../app.routes';
import { AppRoutePath } from '../../../../app.routes.enum';
import { AlertService } from '../../../../feature/alerts/alert.service';
import { Alert } from '../../../../feature/alerts/model';
import { UserSettingsKey } from '../../../models/user-settings.model';
import { UserService } from '../../../services/user.service';

export enum TabItem {
  StartPage = 'start-page',
  Functions = 'functions',
  ToDos = 'to-dos',
}

export const enum ProductType {
  SalesSuite = 'salesSuite',
  DemandSuite = 'demandSuite',
  General = 'general',
}

/**
 * Component to handle the tab bar navigation in the application.
 *
 * @export
 * @class TabBarNavigationComponent
 */
@Component({
  selector: 'd360-tab-bar-navigation',
  imports: [
    RouterModule,
    SharedTranslocoModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './tab-bar-navigation.component.html',
  styleUrl: './tab-bar-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabBarNavigationComponent {
  protected readonly alertService: AlertService = inject(AlertService);
  private readonly userService = inject(UserService);

  /**
   * Generate RouteConfig with all visible routes
   *
   * @protected
   * @memberof TabBarNavigationComponent
   */
  protected routeConfig = computed<RouteConfig>(() => ({
    ...appRoutes,
    functions: {
      salesSuite: this.userService.filterVisibleRoutes(
        appRoutes.functions.salesSuite
      ),
      demandSuite: this.userService.filterVisibleRoutes(
        appRoutes.functions.demandSuite
      ),
      general: [
        ...this.userService.filterVisibleRoutes(appRoutes.functions.general),
        appRoutes.todos,
      ],
    },
  }));

  private readonly prioFilter = (priority: number, alert: Alert) =>
    alert.alertPriority === priority;
  protected prio1Count = computed(
    () =>
      this.alertService
        .allActiveAlerts()
        ?.filter((alert) => this.prioFilter(1, alert)).length
  );
  protected prio2Count = computed(
    () =>
      this.alertService
        .allActiveAlerts()
        ?.filter((alert) => this.prioFilter(2, alert)).length
  );
  protected infoCount = computed(
    () =>
      this.alertService
        .allActiveAlerts()
        ?.filter((alert) => this.prioFilter(3, alert)).length
  );

  /**
   * Signal to keep track of active tab
   *
   * @protected
   * @type {WritableSignal<TabItem>}
   * @memberof TabBarNavigationComponent
   */
  protected activeTab: WritableSignal<TabItem> = signal(null);
  protected readonly Object = Object;
  protected readonly TabItem = TabItem;

  /**
   * Input signal for the active URL
   *
   * @type {InputSignal<string>}
   * @memberof TabBarNavigationComponent
   */
  public activeUrl: InputSignal<string> = input.required();

  /**
   * Creates an instance of TabBarNavigationComponent.
   * The constructor sets up an effect to update the active tab based on the route changes.
   *
   * @memberof TabBarNavigationComponent
   */
  public constructor() {
    effect(() => {
      this.activeTab.set(this.getTabItemForRoute(this.activeUrl()));

      // HINT: This call is normally not needed, but we need to trigger the activeTab signal change detection.
      // If we are not doing this, then we select the clicked tab also, if the navigation was canceled.
      // E.g.: CanDeactivateGuard with click on cancel.
      this.activeTab();
    });
  }

  /**
   * Private method to determine the current tab item based on the given route.
   *
   * @private
   * @param {string} route - The active URL for which the tab item needs to be identified.
   * @returns {TabItem} - The corresponding tab item for the provided route.
   * @memberof TabBarNavigationComponent
   */
  private getTabItemForRoute(route: string): TabItem {
    if (
      [
        `/${this.userService.userSettings()?.[UserSettingsKey.StartPage]}`,
        `${this.userService.userSettings()?.[UserSettingsKey.StartPage]}`,
      ].includes(route)
    ) {
      return TabItem.StartPage;
    } else if (
      [`/${AppRoutePath.TodoPage}`, `${AppRoutePath.TodoPage}`].includes(route)
    ) {
      return TabItem.ToDos;
    }

    return TabItem.Functions;
  }
}
