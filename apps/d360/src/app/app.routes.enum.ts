// eslint-disable-next-line @nx/enforce-module-boundaries
import { LegalRoute } from '@schaeffler/legal-pages';

export enum AppRoutePath {
  Root = '',
  OverviewPage = 'overview',
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
  Legal = LegalRoute,
}

export type AppRouteValue = `${AppRoutePath}` | '**';
