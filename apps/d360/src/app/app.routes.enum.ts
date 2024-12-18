export enum AppRoutePath {
  HomePage = '',
  DemandValidationPage = 'validationOfDemand',
  CustomerMaterialPortfolioPage = 'customerMaterialPortfolio', // TODO original CustomerMaterialPortfolio is used without Page
  InternalMaterialReplacementPage = 'internalMaterialReplacement',
  ApPortfolioOptimizationPage = 'apPortfolafterioOptimization', // TODO original ApPortfolioOptimization is used without Page
  RegionalApPortfolioPage = 'regionalApPortfolio', // TODO original RegionalApPortfolio is used without Page
  CustomerSpecificRequirementPage = 'customerSpecificRequirements', // TODO original CustomerSpecificRequirements is used without Page
  AlertRuleManagementPage = 'taskRules', // TODO original AlertRuleManagement is used without Page
  AlertPage = 'tasks', // TODO original Alerts is used without Page
  ForbiddenPath = 'forbidden',
  SalesPlanningPage = 'salesPlanning',
}

export type TabItem = 'home' | 'functions' | 'tasks';
