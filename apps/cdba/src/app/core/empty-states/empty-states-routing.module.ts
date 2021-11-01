import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ForbiddenRoute } from '@schaeffler/empty-states';

import { NO_ACCESS_ACTION } from '@cdba/shared/constants/forbidden-action';

import { EmptyStatesPath } from './empty-states-path.enum';
import { EmptyStatesComponent } from './components/empty-states.component';

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

const routes: Routes = [
  {
    path: '',
    component: EmptyStatesComponent,
    children: [
      forbiddenRouteBasic,
      forbiddenRouteFeature,
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
