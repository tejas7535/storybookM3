import { createIndentExcelStyles } from '@cdba/shared/components/bom-table/config/excel';

describe('BomTableExcelConfig', () => {
  describe('createIndentExcelStyles', () => {
    it('should create fifteen excel styles for all indent levels', () => {
      const result = createIndentExcelStyles();

      expect(result.length).toBe(15);
    });

    it('should use string as datatype for all excel styles', () => {
      const result = createIndentExcelStyles();

      result.forEach((excelStyle: any) => {
        expect(excelStyle.dataType).toBe('string');
      });
    });

    it('should indent child elements based on their level', () => {
      const result = createIndentExcelStyles();

      result.forEach((excelStyle: any, index: number) => {
        expect(excelStyle.alignment.indent).toBe(index + 1);
      });
    });
  });
});
