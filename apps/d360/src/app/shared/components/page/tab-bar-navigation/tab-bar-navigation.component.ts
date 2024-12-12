import {
  Component,
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
import { Data, Router, RouterModule } from '@angular/router';

import { Observable, of } from 'rxjs';

import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { appRoutes } from '../../../../app.routes';
import { AlertService } from '../../../../feature/alerts/alert.service';
import { AlertNotificationCount } from '../../../../feature/alerts/model';
import { AuthService } from '../../../utils/auth/auth.service';

type TabItem = 'start-page' | 'functions' | 'tasks';

/**
 * Component to handle the tab bar navigation in the application.
 *
 * @export
 * @class TabBarNavigationComponent
 */
@Component({
  selector: 'd360-tab-bar-navigation',
  standalone: true,
  imports: [
    RouterModule,
    SharedTranslocoModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    PushPipe,
    LetDirective,
  ],
  templateUrl: './tab-bar-navigation.component.html',
  styleUrl: './tab-bar-navigation.component.scss',
})
export class TabBarNavigationComponent {
  private readonly alertService: AlertService = inject(AlertService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected notificationCount$: Observable<AlertNotificationCount> =
    this.alertService.getNotificationCount();

  /**
   * Reference to route configuration
   *
   * @protected
   * @memberof TabBarNavigationComponent
   */
  protected routeConfig = appRoutes;

  /**
   * Signal to keep track of active tab
   *
   * @protected
   * @type {WritableSignal<TabItem>}
   * @memberof TabBarNavigationComponent
   */
  protected activeTab: WritableSignal<TabItem> = signal('start-page');

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
    effect(
      () => this.activeTab.set(this.getTabItemForRoute(this.activeUrl())),
      { allowSignalWrites: true }
    );
  }

  /**
   * Method to navigate to a specific path using the router service.
   *
   * @protected
   * @param {string} path - The target URL for navigation.
   * @memberof TabBarNavigationComponent
   */
  protected navigateTo(path: string) {
    this.router.navigate([path]);
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
    if (['/', ''].includes(route)) {
      return 'start-page';
    } else if (['/tasks', 'tasks'].includes(route)) {
      return 'tasks';
    }

    return 'functions';
  }

  /**
   * Method to check whether navigation is allowed based on the provided data.
   *
   * @protected
   * @param {Data} data - The data object containing information about required access roles.
   * @returns {Observable<boolean>} - An observable that emits a boolean value indicating the authorization status.
   * @memberof TabBarNavigationComponent
   */
  protected canNavigateTo$(data: Data): Observable<boolean> {
    return !data || !data.allowedRoles
      ? of(true)
      : this.authService.hasUserAccess(data.allowedRoles);
  }
}
