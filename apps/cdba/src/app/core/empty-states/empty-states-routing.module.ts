import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NO_ACCESS_ACTION } from '@cdba/shared/constants/forbidden-action';

import { ForbiddenRoute } from '@schaeffler/empty-states';

import { EmptyStatesComponent } from './components/empty-states.component';
import { EmptyStatesPath } from './empty-states-path.enum';

/**
 * Show this page when the user does not have the basic access rights for the app
 */
const forbiddenRouteBasic: ForbiddenRoute = {
  path: EmptyStatesPath.NoAccessPath,
  loadChildren: async () =>
    import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
  data: {
    headingText: 'forbidden.noBasicAccess.heading',
    messageText: 'forbidden.noBasicAccess.message',
    action: encodeURI(NO_ACCESS_ACTION),
    hideHomeButton: true,
  },
};

/**
 * Show this page when the user does not have access rights for a specific feature
 */
const forbiddenRouteFeature: ForbiddenRoute = {
  path: EmptyStatesPath.ForbiddenPath,
  loadChildren: async () =>
    import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
  data: {
    headingText: 'forbidden.noFeatureAccess.heading',
    messageText: 'forbidden.noFeatureAccess.message',
    action: 'event',
    actionButtonText: 'forbidden.noFeatureAccess.actionButton',
    homeButtonText: 'forbidden.noFeatureAccess.homeButton',
  },
};

/**
 * Show this page when the user is missing one of the necessary descriptive roles
 */
const forbiddenRouteMissingRoles: ForbiddenRoute = {
  path: EmptyStatesPath.MissingRolesPath,
  loadChildren: async () =>
    import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
  data: {
    headingText: 'forbidden.descriptiveRolesMissing.heading',
    messageText: 'forbidden.descriptiveRolesMissing.message',
    action: 'event',
    actionButtonText: 'forbidden.descriptiveRolesMissing.actionButton',
    hideHomeButton: true,
  },
};

const routes: Routes = [
  {
    path: '',
    component: EmptyStatesComponent,
    children: [
      forbiddenRouteBasic,
      forbiddenRouteFeature,
      forbiddenRouteMissingRoles,
      {
        path: '**',
        loadChildren: async () =>
          import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmptyStatesRoutingModule {}
