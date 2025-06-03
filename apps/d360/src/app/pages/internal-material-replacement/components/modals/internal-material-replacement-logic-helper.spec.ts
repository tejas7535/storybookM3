import {
  IMRSubstitution,
  ReplacementType,
} from '../../../../feature/internal-material-replacement/model';
import * as Helper from './internal-material-replacement-logic-helper';

describe('Internal Material Replacement Logic Helper', () => {
  describe('getReplacementTypeLogic', () => {
    it('should use the correct logic for a new substitution', () => {
      const replacementType: ReplacementType = 'RELOCATION';
      const result = Helper.getReplacementTypeLogic(true, replacementType);

      expect(result).toEqual({
        deactivatedFields: [
          'salesArea',
          'salesOrg',
          'customerNumber',
          'replacementDate',
        ],
        mandatoryFields: [
          'replacementType',
          'region',
          'predecessorMaterial',
          'successorMaterial',
          'startOfProduction',
          'cutoverDate',
        ],
        replacementType,
      });
    });

    it('should return the correct logic for an existing substitution', () => {
      const replacementType: ReplacementType = 'RELOCATION';
      const result = Helper.getReplacementTypeLogic(false, replacementType);

      expect(result).toEqual({
        deactivatedFields: [
          'salesArea',
          'salesOrg',
          'customerNumber',
          'replacementDate',
          'region',
          'replacementType',
          'predecessorMaterial',
        ],
        mandatoryFields: [
          'replacementType',
          'region',
          'predecessorMaterial',
          'successorMaterial',
          'startOfProduction',
          'cutoverDate',
        ],
        replacementType,
      });
    });
  });

  describe('getReplacementTypeLogicForNewSubstitution', () => {
    describe('when replacementType is RELOCATION', () => {
      it('should return correct replacement logic for RELOCATION', () => {
        const result =
          Helper.getReplacementTypeLogicForNewSubstitution('RELOCATION');

        expect(result).toBeDefined();
        expect(result.replacementType).toEqual('RELOCATION');
        expect(result.mandatoryFields).toEqual([
          'replacementType',
          'region',
          'predecessorMaterial',
          'successorMaterial',
          'startOfProduction',
          'cutoverDate',
        ]);
        expect(result.deactivatedFields).toEqual([
          'salesArea',
          'salesOrg',
          'customerNumber',
          'replacementDate',
        ]);
      });
    });

    describe('when replacementType is PARTIAL_RELOCATION', () => {
      it('should return correct replacement logic for PARTIAL_RELOCATION', () => {
        const result =
          Helper.getReplacementTypeLogicForNewSubstitution(
            'PARTIAL_RELOCATION'
          );

        expect(result).toBeDefined();
        expect(result.replacementType).toEqual('PARTIAL_RELOCATION');
        expect(result.mandatoryFields).toEqual([
          'replacementType',
          'region',
          'predecessorMaterial',
          'successorMaterial',
          'customerNumber',
          'startOfProduction',
          'cutoverDate',
        ]);
        expect(result.deactivatedFields).toEqual([
          'salesArea',
          'salesOrg',
          'replacementDate',
        ]);
      });
    });

    describe('when replacementType is PACKAGING_CHANGE', () => {
      it('should return correct replacement logic for PACKAGING_CHANGE', () => {
        const result =
          Helper.getReplacementTypeLogicForNewSubstitution('PACKAGING_CHANGE');

        expect(result).toBeDefined();
        expect(result.replacementType).toEqual('PACKAGING_CHANGE');
        expect(result.mandatoryFields).toEqual([
          'replacementType',
          'region',
          'predecessorMaterial',
          'successorMaterial',
          'replacementDate',
          'cutoverDate',
        ]);
        expect(result.deactivatedFields).toEqual([
          'customerNumber',
          'startOfProduction',
        ]);
      });
    });

    describe('when replacementType is PRODUCT_DEVELOPMENT', () => {
      it('should return correct replacement logic for PRODUCT_DEVELOPMENT', () => {
        const result = Helper.getReplacementTypeLogicForNewSubstitution(
          'PRODUCT_DEVELOPMENT'
        );

        expect(result).toBeDefined();
        expect(result.replacementType).toEqual('PRODUCT_DEVELOPMENT');
        expect(result.mandatoryFields).toEqual([
          'replacementType',
          'region',
          'predecessorMaterial',
          'successorMaterial',
          'replacementDate',
          'cutoverDate',
        ]);
        expect(result.deactivatedFields).toEqual([
          'customerNumber',
          'startOfProduction',
        ]);
      });
    });

    describe('when replacementType is DISCONTINUED', () => {
      it('should return correct replacement logic for DISCONTINUED', () => {
        const result =
          Helper.getReplacementTypeLogicForNewSubstitution('DISCONTINUED');

        expect(result).toBeDefined();
        expect(result.replacementType).toEqual('DISCONTINUED');
        expect(result.mandatoryFields).toEqual([
          'replacementType',
          'region',
          'predecessorMaterial',
          'replacementDate',
        ]);
        expect(result.deactivatedFields).toEqual([
          'salesArea',
          'salesOrg',
          'customerNumber',
          'successorMaterial',
          'cutoverDate',
          'startOfProduction',
        ]);
      });
    });

    describe('when replacementType is CUSTOMER_DROPOUT', () => {
      it('should return correct replacement logic for CUSTOMER_DROPOUT', () => {
        const result =
          Helper.getReplacementTypeLogicForNewSubstitution('CUSTOMER_DROPOUT');

        expect(result).toBeDefined();
        expect(result.replacementType).toEqual('CUSTOMER_DROPOUT');
        expect(result.mandatoryFields).toEqual([
          'replacementType',
          'region',
          'customerNumber',
          'replacementDate',
        ]);
        expect(result.deactivatedFields).toEqual([
          'salesArea',
          'salesOrg',
          'predecessorMaterial',
          'successorMaterial',
          'cutoverDate',
          'startOfProduction',
        ]);
      });
    });

    describe('when replacementType is unknown', () => {
      it('should throw an error for unknown replacementType', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        Helper.getReplacementTypeLogicForNewSubstitution('UNKNOWN' as any);

        expect(spy).toHaveBeenCalledWith('Unknown replacement type: UNKNOWN');

        spy.mockRestore();
      });
    });
  });

  describe('checkForbiddenFieldsForNewSubstitution', () => {
    it('should return undefined if no replacement type is provided', () => {
      const substitution: IMRSubstitution = {
        /* empty substitution */
      } as any;
      const result =
        Helper.checkForbiddenFieldsForNewSubstitution(substitution);

      expect(result).toBeUndefined();
    });

    it('should return the wrongly filled fields for a new substitution', () => {
      const substitution: IMRSubstitution = {
        replacementType: 'RELOCATION',
        salesArea: 'SA123', // Forbidden field for RELOCATION type
      } as any;
      const result =
        Helper.checkForbiddenFieldsForNewSubstitution(substitution);

      expect(result).toEqual(['salesArea']);
    });
  });

  describe('checkMissingFields', () => {
    it('should return undefined if no replacement type is provided', () => {
      const substitution: IMRSubstitution = {
        /* empty substitution */
      } as any;
      const result = Helper.checkMissingFields(substitution);

      expect(result).toBeUndefined();
    });

    it('should return the missing fields for a new substitution', () => {
      const substitution: IMRSubstitution = {
        replacementType: 'RELOCATION',
        region: '', // Missing field for RELOCATION type
        predecessorMaterial: null, // Missing field for RELOCATION type
      } as any;
      const result = Helper.checkMissingFields(substitution);

      expect(result).toEqual([
        'region',
        'predecessorMaterial',
        'successorMaterial',
        'startOfProduction',
        'cutoverDate',
      ]);
    });
  });

  describe('getReplacementTypeLogicForEdit', () => {
    it('should return the correct ReplacementTypeLogic for editing', () => {
      const defaultLogic: Helper.ReplacementTypeLogic = {
        replacementType: 'RELOCATION',
        mandatoryFields: ['field1', 'field2'],
        deactivatedFields: ['deactivatedField1', 'deactivatedField2'],
      } as any;

      const result = Helper.getReplacementTypeLogicForEdit(defaultLogic);

      expect(result.replacementType).toEqual(defaultLogic.replacementType);
      expect(result.mandatoryFields).toEqual(defaultLogic.mandatoryFields);
      // The key fields should be included in the deactivatedFields array, but they are unique and do not duplicate existing entries
      const expectedDeactivatedFields = [
        ...new Set([
          ...defaultLogic.deactivatedFields,
          'region',
          'replacementType',
          'salesArea',
          'salesOrg',
          'customerNumber',
          'predecessorMaterial',
        ]),
      ];
      expect(result.deactivatedFields).toEqual(expectedDeactivatedFields);
    });

    it('should combine deactivatedFields with key fields correctly', () => {
      const defaultLogic: Helper.ReplacementTypeLogic = {
        replacementType: 'PACKAGING_CHANGE',
        mandatoryFields: ['replacementType', 'region', 'predecessorMaterial'],
        deactivatedFields: ['customerNumber', 'startOfProduction'],
      };

      const result = Helper.getReplacementTypeLogicForEdit(defaultLogic);

      // Check that original deactivated fields are preserved
      expect(result.deactivatedFields).toContain('customerNumber');
      expect(result.deactivatedFields).toContain('startOfProduction');

      // Check that all key fields are added
      expect(result.deactivatedFields).toContain('region');
      expect(result.deactivatedFields).toContain('replacementType');
      expect(result.deactivatedFields).toContain('salesArea');
      expect(result.deactivatedFields).toContain('salesOrg');
      expect(result.deactivatedFields).toContain('customerNumber');
      expect(result.deactivatedFields).toContain('predecessorMaterial');
    });

    it('should handle empty deactivatedFields array', () => {
      const defaultLogic: Helper.ReplacementTypeLogic = {
        replacementType: 'PRODUCT_DEVELOPMENT',
        mandatoryFields: ['field1', 'field2'] as any,
        deactivatedFields: [],
      };

      const result = Helper.getReplacementTypeLogicForEdit(defaultLogic);

      // Result should contain exactly the key fields with no duplicates
      expect(result.deactivatedFields.length).toBe(6);
      expect(result.deactivatedFields).toEqual([
        'region',
        'replacementType',
        'salesArea',
        'salesOrg',
        'customerNumber',
        'predecessorMaterial',
      ]);
    });

    it('should handle overlapping fields correctly', () => {
      const defaultLogic: Helper.ReplacementTypeLogic = {
        replacementType: 'DISCONTINUED',
        mandatoryFields: ['replacementType', 'region'],
        deactivatedFields: ['predecessorMaterial', 'region'], // Intentional overlap with key fields
      };

      const result = Helper.getReplacementTypeLogicForEdit(defaultLogic);

      // Should deduplicate the overlapping fields
      expect(
        result.deactivatedFields.filter((f) => f === 'region').length
      ).toBe(1);
      expect(
        result.deactivatedFields.filter((f) => f === 'predecessorMaterial')
          .length
      ).toBe(1);

      // Total length should be 6 (no duplicates)
      expect(result.deactivatedFields.length).toBe(6);
    });

    it('should preserve the original mandatoryFields array', () => {
      const originalFields = ['field1', 'field2', 'field3'];
      const defaultLogic: Helper.ReplacementTypeLogic = {
        replacementType: 'CUSTOMER_DROPOUT',
        mandatoryFields: [...originalFields] as any,
        deactivatedFields: ['deactivatedField1'] as any,
      };

      const result = Helper.getReplacementTypeLogicForEdit(defaultLogic);

      // mandatoryFields should remain unchanged
      expect(result.mandatoryFields).toEqual(originalFields);
    });

    it('should handle undefined defaultLogic.deactivatedFields', () => {
      const defaultLogic = {
        replacementType: 'RELOCATION',
        mandatoryFields: ['field1'],
        // deactivatedFields intentionally missing
      } as any;

      const result = Helper.getReplacementTypeLogicForEdit(defaultLogic);

      // Should still include all key fields
      expect(result.deactivatedFields).toContain('region');
      expect(result.deactivatedFields).toContain('replacementType');
      expect(result.deactivatedFields).toContain('salesArea');
      expect(result.deactivatedFields).toContain('salesOrg');
      expect(result.deactivatedFields).toContain('customerNumber');
      expect(result.deactivatedFields).toContain('predecessorMaterial');
      expect(result.deactivatedFields.length).toBe(6);
    });
  });
});
