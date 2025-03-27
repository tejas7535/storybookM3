import { MsalGuard } from '@azure/msal-angular';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { LegalRoute } from '@schaeffler/legal-pages';

import { appRoutes, getAllRoutes } from './app.routes';
import { AppRoutePath } from './app.routes.enum';
import { Region } from './feature/global-selection/model';
import { ProductType } from './shared/components/page/tab-bar-navigation/tab-bar-navigation.component';
import { CanDeactivateGuard } from './shared/utils/auth/can-deactivate-guard.service';
import { RegionGuard } from './shared/utils/auth/region-guard.service';
import { RoleGuard } from './shared/utils/auth/role-guard.service';
import { salesPlanningAllowedRoles } from './shared/utils/auth/roles';

describe('appRoutes', () => {
  it('should define a root route with correct configuration', () => {
    expect(appRoutes.root).toEqual({
      pathMatch: 'full',
      path: AppRoutePath.Root,
      canActivate: [MsalGuard],
      loadComponent: expect.any(Function),
    });
  });

  it('should define SalesSuite routes with correct configuration', () => {
    const salesSuiteRoutes = appRoutes.functions[ProductType.SalesSuite];
    expect(salesSuiteRoutes).toBeDefined();
    expect(salesSuiteRoutes).toContainEqual(
      expect.objectContaining({
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
        loadComponent: expect.any(Function),
      })
    );
  });

  it('should define DemandSuite routes with correct configuration', () => {
    const demandSuiteRoutes = appRoutes.functions[ProductType.DemandSuite];
    expect(demandSuiteRoutes).toBeDefined();
    expect(demandSuiteRoutes).toContainEqual(
      expect.objectContaining({
        path: AppRoutePath.DemandValidationPage,
        label: 'tabbarMenu.validation-of-demand.label',
        canActivate: [MsalGuard],
        visible: true,
        data: {
          titles: ['header.title', 'tabbarMenu.validation-of-demand.label'],
          hasGlobalSelection: true,
        },
        canDeactivate: [CanDeactivateGuard],
        loadComponent: expect.any(Function),
      })
    );
  });

  it('should define General routes with correct configuration', () => {
    const generalRoutes = appRoutes.functions[ProductType.General];
    expect(generalRoutes).toBeDefined();
    expect(generalRoutes).toContainEqual(
      expect.objectContaining({
        path: AppRoutePath.OverviewPage,
        label: 'tabbarMenu.overview.label',
        canActivate: [MsalGuard, RegionGuard],
        visible: true,
        data: {
          allowedRegions: [Region.Europe],
          titles: ['header.title', 'tabbarMenu.overview.label'],
        },
        loadComponent: expect.any(Function),
      })
    );
  });

  it('should define a todos route with correct configuration', () => {
    expect(appRoutes.todos).toEqual({
      path: AppRoutePath.TodoPage,
      label: 'tabbar.tasks.label',
      data: {
        titles: ['header.title', 'tabbar.tasks.label'],
      },
      canActivate: [MsalGuard],
      visible: true,
      loadComponent: expect.any(Function),
    });
  });

  it('should define other routes with correct configuration', () => {
    const otherRoutes = appRoutes.others;
    expect(otherRoutes).toContainEqual(
      expect.objectContaining({
        path: AppRoutePath.TestPage,
        canActivate: [MsalGuard],
        loadComponent: expect.any(Function),
      })
    );
    expect(otherRoutes).toContainEqual(
      expect.objectContaining({
        path: LegalRoute,
        loadChildren: expect.any(Function),
      })
    );
    expect(otherRoutes).toContainEqual(
      expect.objectContaining({
        path: AppRoutePath.ForbiddenPage,
        loadChildren: expect.any(Function),
      })
    );
    expect(otherRoutes).toContainEqual(
      expect.objectContaining({
        path: '**',
        loadChildren: expect.any(Function),
      })
    );
  });

  it('should return all routes from getAllRoutes', () => {
    const allRoutes = getAllRoutes();
    expect(allRoutes).toContain(appRoutes.root);
    expect(allRoutes).toEqual(
      expect.arrayContaining([
        ...Object.values(appRoutes.functions).flat(),
        appRoutes.todos,
        ...appRoutes.others,
      ])
    );
  });
});
