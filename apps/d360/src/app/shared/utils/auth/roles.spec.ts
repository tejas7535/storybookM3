import {
  adminsOnly,
  apPortfolioAllowedRoles,
  checkRoles,
  customerMaterialPortfolioChangeAllowedRoles,
  demandValidationChangeAllowedRoles,
  internalMaterialReplacementAllowedRoles,
  Role,
  salesPlanningAllowedEditRoles,
  salesPlanningAllowedRoles,
  workflowManagementAllowedRoles,
} from './roles';

describe('roles.ts', () => {
  describe('checkRoles function', () => {
    it('should return true if user has an allowed role', () => {
      const givenRoles = ['SD-D360_SALES_DIR'];
      const allowedRoles: Role[] = ['salesUser'];

      expect(checkRoles(givenRoles, allowedRoles)).toBe(true);
    });

    it('should return false if user does not have an allowed role', () => {
      const givenRoles = ['SD-D360_SALES_DIR'];
      const allowedRoles: Role[] = ['demandPlanning'];

      expect(checkRoles(givenRoles, allowedRoles)).toBe(false);
    });

    it('should handle multiple allowed roles correctly', () => {
      const givenRoles = ['SD-D360_SALES_DIR'];
      const allowedRoles: Role[] = ['demandPlanning', 'salesUser'];

      expect(checkRoles(givenRoles, allowedRoles)).toBe(true);
    });

    it('should handle roles with territory information', () => {
      const givenRoles = ['SD-D360_SALES_DIR=EU'];
      const allowedRoles: Role[] = ['salesUser'];

      expect(checkRoles(givenRoles, allowedRoles)).toBe(true);
    });

    it('should handle roles with business area information', () => {
      const givenRoles = ['SD-D360_SALES_DIR=EU=SomeBusinessArea'];
      const allowedRoles: Role[] = ['salesUser'];

      expect(checkRoles(givenRoles, allowedRoles)).toBe(true);
    });

    it('should return false when given roles is empty', () => {
      const givenRoles: string[] = [];
      const allowedRoles: Role[] = ['salesUser'];

      expect(checkRoles(givenRoles, allowedRoles)).toBe(false);
    });

    it('should return false when allowed roles is empty', () => {
      const givenRoles = ['SD-D360_SALES_DIR'];
      const allowedRoles: Role[] = [];

      expect(checkRoles(givenRoles, allowedRoles)).toBe(false);
    });

    it('should match alternative roles for the same role type', () => {
      const givenRoles = ['SD-D360_SALES_IND'];
      const allowedRoles: Role[] = ['salesUser'];

      expect(checkRoles(givenRoles, allowedRoles)).toBe(true);
    });
  });

  describe('role constants', () => {
    it('should define demandValidationChangeAllowedRoles correctly', () => {
      expect(demandValidationChangeAllowedRoles).toContain('salesUser');
      expect(demandValidationChangeAllowedRoles).toContain('demandPlanning');
      expect(demandValidationChangeAllowedRoles).toContain('superUser');
      expect(demandValidationChangeAllowedRoles.length).toBe(3);
    });

    it('should define customerMaterialPortfolioChangeAllowedRoles correctly', () => {
      expect(customerMaterialPortfolioChangeAllowedRoles).toContain(
        'salesUser'
      );
      expect(customerMaterialPortfolioChangeAllowedRoles).toContain(
        'demandPlanning'
      );
      expect(customerMaterialPortfolioChangeAllowedRoles).toContain(
        'superUser'
      );
      expect(customerMaterialPortfolioChangeAllowedRoles.length).toBe(3);
    });

    it('should define apPortfolioAllowedRoles correctly', () => {
      expect(apPortfolioAllowedRoles).toContain('salesManagement');
      expect(apPortfolioAllowedRoles).toContain('demandPlanning');
      expect(apPortfolioAllowedRoles).toContain('readOnly');
      expect(apPortfolioAllowedRoles).toContain('superUser');
      expect(apPortfolioAllowedRoles.length).toBe(4);
    });

    it('should define internalMaterialReplacementAllowedRoles correctly', () => {
      expect(internalMaterialReplacementAllowedRoles).toContain(
        'demandPlanning'
      );
      expect(internalMaterialReplacementAllowedRoles).toContain('superUser');
      expect(internalMaterialReplacementAllowedRoles.length).toBe(2);
    });

    it('should define workflowManagementAllowedRoles correctly', () => {
      expect(workflowManagementAllowedRoles).toContain('demandPlanning');
      expect(workflowManagementAllowedRoles).toContain('superUser');
      expect(workflowManagementAllowedRoles.length).toBe(2);
    });

    it('should define salesPlanningAllowedRoles correctly', () => {
      expect(salesPlanningAllowedRoles).toContain('salesUser');
      expect(salesPlanningAllowedRoles).toContain('salesManagement');
      expect(salesPlanningAllowedRoles).toContain('readOnly');
      expect(salesPlanningAllowedRoles).toContain('readOnlyRestricted');
      expect(salesPlanningAllowedRoles).toContain('demandPlanning');
      expect(salesPlanningAllowedRoles).toContain('superUser');
      expect(salesPlanningAllowedRoles.length).toBe(6);
    });

    it('should define salesPlanningAllowedEditRoles correctly', () => {
      expect(salesPlanningAllowedEditRoles).toContain('salesUser');
      expect(salesPlanningAllowedEditRoles).toContain('superUser');
      expect(salesPlanningAllowedEditRoles.length).toBe(2);
    });

    it('should define adminsOnly correctly', () => {
      expect(adminsOnly).toContain('superUser');
      expect(adminsOnly.length).toBe(1);
    });
  });
});
