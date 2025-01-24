import { Route } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { LegalRoute } from '@schaeffler/legal-pages';

import { AppRoutePath } from './app.routes.enum';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { RoleGuard } from './shared/utils/auth/role-guard.service';
import {
  apPortfolioAllowedRoles,
  internalMaterialReplacementAllowedRoles,
  salesPlanningAllowedRoles,
  workflowManagementAllowedRoles,
} from './shared/utils/auth/roles';

export interface CustomRoute extends Route {
  label?: string;
  visible?: boolean;
}

export interface RouteConfig {
  startPage: CustomRoute;
  dashboard: CustomRoute;
  functions: CustomRoute[];
  tasks: CustomRoute;
  others: CustomRoute[];
}

export const appRoutes: RouteConfig = {
  startPage: {
    label: 'tabbar.start-page.label',
    path: AppRoutePath.HomePage,
    canActivate: [MsalGuard],
    component: HomeComponent,
  },
  dashboard: {
    label: 'tabbar.dashboard.label',
    path: AppRoutePath.Dashboard,
    component: DashboardComponent,
  },
  functions: [
    {
      path: AppRoutePath.DemandValidationPage,
      label: 'tabbarMenu.validation-of-demand.label',
      canActivate: [MsalGuard],
      visible: true,
      loadComponent: () =>
        import(
          '../app/pages/demand-validation/demand-validation.component'
        ).then((m) => m.DemandValidationComponent),
    },
    {
      path: AppRoutePath.CustomerMaterialPortfolioPage,
      label: 'tabbarMenu.customer-material-portfolio.label',
      canActivate: [MsalGuard],
      visible: true,
      loadComponent: () =>
        import(
          '../app/pages/customer-material-portfolio/customer-material-portfolio.component'
        ).then((m) => m.CustomerMaterialPortfolioComponent),
    },
    {
      path: AppRoutePath.InternalMaterialReplacementPage,
      label: 'tabbarMenu.internal-material-replacement.label',
      canActivate: [MsalGuard, RoleGuard],
      visible: true,
      data: {
        allowedRoles: internalMaterialReplacementAllowedRoles,
      },
      loadComponent: () =>
        import(
          '../app/pages/internal-material-replacement/internal-material-replacement.component'
        ).then((m) => m.InternalMaterialReplacementComponent),
    },
    {
      path: AppRoutePath.AlertRuleManagementPage,
      label: 'tabbarMenu.alert-rule-editor.label',
      canActivate: [MsalGuard, RoleGuard],
      visible: true,
      data: {
        allowedRoles: workflowManagementAllowedRoles,
      },
      loadComponent: () =>
        import('../app/pages/alert-rules/alert-rules.component').then(
          (m) => m.AlertRulesComponent
        ),
    },
    {
      path: AppRoutePath.SalesPlanningPage,
      label: 'tabbarMenu.sales-planning.label',
      canActivate: [MsalGuard, RoleGuard],
      visible: true,
      data: {
        allowedRoles: salesPlanningAllowedRoles,
      },
      loadComponent: () =>
        import('../app/pages/sales-planning/sales-planning.component').then(
          (m) => m.SalesPlanningComponent
        ),
    },
    {
      path: AppRoutePath.Dashboard,
      label: 'tabbarMenu.dashboard.label',
      canActivate: [MsalGuard],
      visible: true,
      loadComponent: () =>
        import('../app/pages/dashboard/dashboard.component').then(
          (m) => m.DashboardComponent
        ),
    },
    {
      path: AppRoutePath.ApPortfolioOptimizationPage,
      label: 'tabbarMenu.ap-portfolio-optimization.label',
      canActivate: [MsalGuard, RoleGuard],
      visible: false,
      data: {
        allowedRoles: apPortfolioAllowedRoles,
      },
      loadComponent: () => null, // TODO implement component (empty react component before)
    },
    {
      path: AppRoutePath.RegionalApPortfolioPage,
      label: 'tabbarMenu.regional-ap-portfolio.label',
      canActivate: [MsalGuard],
      visible: false,
      loadComponent: () => null, // TODO implement component (empty react component before)
    },
    {
      path: AppRoutePath.CustomerSpecificRequirementPage,
      label: 'tabbarMenu.customer-specific-requirements.label',
      canActivate: [MsalGuard],
      visible: false,
      loadComponent: () => null, // TODO implement component (empty react component before)
    },
  ],
  tasks: {
    path: AppRoutePath.AlertPage,
    label: 'tabbar.tasks.label',
    canActivate: [MsalGuard],
    visible: true,
    loadComponent: () =>
      import('../app/pages/alerts/alerts.component').then(
        (m) => m.AlertsComponent
      ),
  },
  others: [
    {
      path: 'testPage',
      canActivate: [MsalGuard],
      loadComponent: () =>
        import('../app/pages/test-page/test-page.component').then(
          (m) => m.TestPageComponent
        ),
    },
    {
      path: LegalRoute,
      loadChildren: () =>
        import('@schaeffler/legal-pages').then((m) => m.LegalModule),
    },
    {
      path: AppRoutePath.ForbiddenPath,
      loadChildren: () =>
        import('@schaeffler/empty-states').then((m) => m.ForbiddenModule),
    },
    {
      path: '**',
      loadChildren: () =>
        import('@schaeffler/empty-states').then((m) => m.PageNotFoundModule),
    },
  ],
} as const;
