import { Route } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { LegalRoute } from '@schaeffler/legal-pages';

import { AppRoutePath, AppRouteValue } from './app.routes.enum';
import { Region } from './feature/global-selection/model';
import { ProductType } from './shared/components/page/tab-bar-navigation/tab-bar-navigation.component';
import { CanDeactivateGuard } from './shared/utils/auth/can-deactivate-guard.service';
import { RegionGuard } from './shared/utils/auth/region-guard.service';
import { RoleGuard } from './shared/utils/auth/role-guard.service';
import {
  internalMaterialReplacementAllowedRoles,
  Role,
  salesPlanningAllowedRoles,
  workflowManagementAllowedRoles,
} from './shared/utils/auth/roles';

export interface CustomRoute extends Route {
  label?: string;
  visible?: boolean;
  data?: {
    allowedRoles?: Role[];
    allowedRegions?: Region[];
    titles?: string[];
    hasGlobalSelection?: boolean;
    hasSalesValidationSelection?: boolean;
  };
  path: AppRouteValue;
}

export interface RouteConfig {
  root: CustomRoute;
  functions: Record<ProductType, CustomRoute[]>;
  todos: CustomRoute;
  others: CustomRoute[];
}

export const appRoutes: RouteConfig = {
  root: {
    pathMatch: 'full',
    path: AppRoutePath.Root,
    canActivate: [MsalGuard],
    loadComponent: /* istanbul ignore next */ () =>
      import('../app/pages/root/root.component').then((m) => m.RootComponent),
  },
  functions: {
    [ProductType.SalesSuite]: [
      {
        path: AppRoutePath.SalesValidationPage,
        label: 'tabbarMenu.sales-planning.label',
        canActivate: [MsalGuard, RoleGuard, RegionGuard],
        visible: true,
        data: {
          allowedRoles: salesPlanningAllowedRoles,
          allowedRegions: [Region.Europe],
          titles: ['header.title', 'tabbarMenu.sales-planning.label'],
          hasSalesValidationSelection: true,
        },
        loadComponent: /* istanbul ignore next */ () =>
          import('../app/pages/sales-planning/sales-planning.component').then(
            (m) => m.SalesPlanningComponent
          ),
      },
      // {
      //   path: AppRoutePath.ApPortfolioOptimizationPage,
      //   label: 'tabbarMenu.ap-portfolio-optimization.label',
      //   canActivate: [MsalGuard, RoleGuard],
      //   visible: false,
      //   data: {
      //     allowedRoles: apPortfolioAllowedRoles,
      //   },
      //   loadComponent: () => null, // TODO implement component (empty react component before)
      // },
      // {
      //   path: AppRoutePath.RegionalApPortfolioPage,
      //   label: 'tabbarMenu.regional-ap-portfolio.label',
      //   canActivate: [MsalGuard],
      //   visible: false,
      //   loadComponent: () => null, // TODO implement component (empty react component before)
      // },
      // {
      //   path: AppRoutePath.CustomerSpecificRequirementPage,
      //   label: 'tabbarMenu.customer-specific-requirements.label',
      //   canActivate: [MsalGuard],
      //   visible: false,
      //   loadComponent: () => null, // TODO implement component (empty react component before)
      // },
    ],
    [ProductType.DemandSuite]: [
      {
        path: AppRoutePath.DemandValidationPage,
        label: 'tabbarMenu.validation-of-demand.label',
        canActivate: [MsalGuard],
        visible: true,
        data: {
          titles: ['header.title', 'tabbarMenu.validation-of-demand.label'],
          hasGlobalSelection: true,
        },
        canDeactivate: [CanDeactivateGuard],
        loadComponent: /* istanbul ignore next */ () =>
          import(
            '../app/pages/demand-validation/demand-validation.component'
          ).then((m) => m.DemandValidationComponent),
      },
      {
        path: AppRoutePath.CustomerMaterialPortfolioPage,
        label: 'tabbarMenu.customer-material-portfolio.label',
        canActivate: [MsalGuard],
        visible: true,
        data: {
          titles: [
            'header.title',
            'tabbarMenu.customer-material-portfolio.label',
          ],
          hasGlobalSelection: true,
        },
        loadComponent: /* istanbul ignore next */ () =>
          import(
            '../app/pages/customer-material-portfolio/customer-material-portfolio.component'
          ).then((m) => m.CustomerMaterialPortfolioComponent),
      },
      {
        path: AppRoutePath.CentralPhaseInPhaseOutPage,
        label: 'tabbarMenu.internal-material-replacement.label',
        canActivate: [MsalGuard, RoleGuard],
        visible: true,
        data: {
          allowedRoles: internalMaterialReplacementAllowedRoles,
          titles: [
            'header.title',
            'tabbarMenu.internal-material-replacement.label',
          ],
        },
        loadComponent: /* istanbul ignore next */ () =>
          import(
            '../app/pages/internal-material-replacement/internal-material-replacement.component'
          ).then((m) => m.InternalMaterialReplacementComponent),
      },
      {
        label: 'tabbarMenu.customer-material-details.label',
        data: {
          titles: [
            'header.title',
            'tabbarMenu.customer-material-details.label',
          ],
          hasGlobalSelection: true,
        },
        visible: true,
        path: AppRoutePath.CustomerMaterialDetailsPage,
        canActivate: [MsalGuard],
        loadComponent: /* istanbul ignore next */ () =>
          import('../app/pages/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
    ],
    [ProductType.General]: [
      {
        path: AppRoutePath.OverviewPage,
        label: 'tabbarMenu.overview.label',
        canActivate: [MsalGuard, RegionGuard],
        visible: true,
        data: {
          allowedRegions: [Region.Europe],
          titles: ['header.title', 'tabbarMenu.overview.label'],
        },
        loadComponent: /* istanbul ignore next */ () =>
          import('./pages/overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
      },
      {
        path: AppRoutePath.AlertRuleManagementPage,
        label: 'tabbarMenu.alert-rule-editor.label',
        canActivate: [MsalGuard, RoleGuard],
        visible: true,
        data: {
          allowedRoles: workflowManagementAllowedRoles,
          titles: ['header.title', 'tabbarMenu.alert-rule-editor.label'],
        },
        loadComponent: /* istanbul ignore next */ () =>
          import('../app/pages/alert-rules/alert-rules.component').then(
            (m) => m.AlertRulesComponent
          ),
      },
    ],
  },
  todos: {
    path: AppRoutePath.TodoPage,
    label: 'tabbar.tasks.label',
    data: {
      titles: ['header.title', 'tabbar.tasks.label'],
    },
    canActivate: [MsalGuard],
    visible: true,
    loadComponent: /* istanbul ignore next */ () =>
      import('../app/pages/alerts/alerts.component').then(
        (m) => m.AlertsComponent
      ),
  },
  others: [
    {
      path: AppRoutePath.TestPage,
      canActivate: [MsalGuard],
      loadComponent: /* istanbul ignore next */ () =>
        import('../app/pages/test-page/test-page.component').then(
          (m) => m.TestPageComponent
        ),
    },
    {
      path: LegalRoute,
      loadChildren: /* istanbul ignore next */ () =>
        import('@schaeffler/legal-pages').then((m) => m.LegalModule),
    },
    {
      path: AppRoutePath.ForbiddenPage,
      loadChildren: /* istanbul ignore next */ () =>
        import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
    },
    {
      path: '**',
      loadChildren: /* istanbul ignore next */ () =>
        import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
    },
  ],
} as const;

export function getAllRoutes(): CustomRoute[] {
  return [
    appRoutes.root,
    ...Object.values(appRoutes.functions).flat(),
    appRoutes.todos,
    ...appRoutes.others,
  ];
}
