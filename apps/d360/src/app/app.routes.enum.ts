export enum AppRoutePath {
  Root = '',
  BannerSettings = 'admin-settings/notification-banner',
  OverviewPage = 'overview-page',
  DemandValidationPage = 'demand-validation',
  CustomerMaterialPortfolioPage = 'customer-material-portfolio',
  CustomerMaterialDetailsPage = 'customer-material-details',
  CentralPhaseInPhaseOutPage = 'central-phase-in-phase-out',
  ApPortfolioOptimizationPage = 'ap-portfolio-after-io-optimization',
  RegionalApPortfolioPage = 'regional-ap-portfolio',
  CustomerSpecificRequirementPage = 'customer-specific-requirements',
  AlertRuleManagementPage = 'task-rules',
  TodoPage = 'to-dos',
  ForbiddenPage = 'forbidden',
  SalesValidationPage = 'sales-validation',
  TestPage = 'test-page',
  Legal = 'legal',
}

export type AppRouteValue = `${AppRoutePath}` | '**';
