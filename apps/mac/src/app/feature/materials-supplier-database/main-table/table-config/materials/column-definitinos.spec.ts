import { TranslocoModule } from '@ngneat/transloco';
import {
  ColDef,
  HeaderValueGetterFunc,
  HeaderValueGetterParams,
  ITooltipParams,
  ValueFormatterFunc,
  ValueFormatterParams,
  ValueGetterFunc,
  ValueGetterParams,
} from 'ag-grid-community';

import {
  DATA_DATE,
  HISTORY,
  MANUFACTURER_SUPPLIER_COUNTRY,
  MANUFACTURER_SUPPLIER_REGION,
  MATERIAL_STANDARD_STANDARD_DOCUMENT,
  MATERIAL_STANDARD_STOFF_ID,
  RECENT_STATUS,
} from '@mac/feature/materials-supplier-database/constants';
import { COLUMN_DEFINITIONS_MAPPING } from '@mac/msd/main-table/table-config/materials';
import {
  BASE_COLUMN_DEFINITIONS,
  BASE_MATERIAL_STANDARDS_COLUMN_DEFINITIONS,
  BASE_SUPPLIERS_COLUMN_DEFINITIONS,
  HISTORY_COLUMN_DEFINITION,
} from '@mac/msd/main-table/table-config/materials/base';

import { LUBRICANT_COLUMN_DEFINITIONS } from './lubricant';
import { SAP_MATERIALS_COLUMN_DEFINITIONS } from './sap-materials';
import { STEEL_COLUMN_DEFINITIONS } from './steel';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn((string) => string),
}));

jest.mock('../../util', () => ({
  ...jest.requireActual('../../util'),
  getStatus: jest.fn(),
}));

const lookup = (columnDef: ColDef[], field: string): ColDef =>
  columnDef.find((c) => c.field === field);

describe('column definitions', () => {
  it('should fix the import failures', () => {
    // this test is required because of a cyclic dependency within the column mappings
    expect(COLUMN_DEFINITIONS_MAPPING).toBeTruthy();
  });

  describe('base-column-definitions', () => {
    const def = BASE_COLUMN_DEFINITIONS;
    describe('RECENT_STATUS', () => {
      it('should get static value for recent status', () => {
        const params = {} as ValueGetterParams;
        const fkt = lookup(def, RECENT_STATUS).valueGetter as ValueGetterFunc;

        expect(fkt(params)).toBe(1);
      });

      it('should get empty header for status', () => {
        const params = {} as HeaderValueGetterParams;
        const fkt = lookup(def, RECENT_STATUS)
          .headerValueGetter as HeaderValueGetterFunc;

        expect(fkt(params)).toBe('');
      });
    });

    describe('MANUFACTURER_SUPPLIER_COUNTRY', () => {
      it('should translate supplier country', () => {
        const params = {
          data: { manufacturerSupplierCountry: 'DE' },
        } as ValueGetterParams;
        const fkt = lookup(def, MANUFACTURER_SUPPLIER_COUNTRY)
          .filterValueGetter as ValueGetterFunc;

        expect(fkt(params)).toBe(
          'materialsSupplierDatabase.mainTable.tooltip.country.DE (DE)'
        );
      });

      it('should translate supplier country tooltip', () => {
        const params = {
          value: 'DE',
        } as ITooltipParams;
        const fkt = lookup(
          def,
          MANUFACTURER_SUPPLIER_COUNTRY
        ).tooltipValueGetter;

        expect(fkt(params)).toBe('country.DE');
      });
    });

    describe('MANUFACTURER_SUPPLIER_REGION', () => {
      it('should translate supplier region', () => {
        const params = {
          data: { manufacturerSupplierRegion: 'EU' },
        } as ValueGetterParams;
        const fkt = lookup(def, MANUFACTURER_SUPPLIER_REGION)
          .filterValueGetter as ValueGetterFunc;

        expect(fkt(params)).toBe(
          'materialsSupplierDatabase.mainTable.tooltip.region.EU (EU)'
        );
      });

      it('should translate supplier region tooltip', () => {
        const params = {
          value: 'EU',
        } as ITooltipParams;
        const fkt = lookup(
          def,
          MANUFACTURER_SUPPLIER_REGION
        ).tooltipValueGetter;

        expect(fkt(params)).toBe('region.EU');
      });
    });
  });

  describe('BASE_MATERIAL_STANDARDS_COLUMN_DEFINITIONS', () => {
    const def = BASE_MATERIAL_STANDARDS_COLUMN_DEFINITIONS;
    describe('RECENT_STATUS', () => {
      it('should get static value for recent status', () => {
        const params = {} as ValueGetterParams;
        const fkt = lookup(def, RECENT_STATUS).valueGetter as ValueGetterFunc;

        expect(fkt(params)).toBe(1);
      });

      it('should get empty header for status', () => {
        const params = {} as HeaderValueGetterParams;
        const fkt = lookup(def, RECENT_STATUS)
          .headerValueGetter as HeaderValueGetterFunc;

        expect(fkt(params)).toBe('');
      });
    });
  });

  describe('BASE_SUPPLIERS_COLUMN_DEFINITIONS', () => {
    const def = BASE_SUPPLIERS_COLUMN_DEFINITIONS;
    describe('RECENT_STATUS', () => {
      it('should get static value for recent status', () => {
        const params = {} as ValueGetterParams;
        const fkt = lookup(def, RECENT_STATUS).valueGetter as ValueGetterFunc;

        expect(fkt(params)).toBe(1);
      });

      it('should get empty header for status', () => {
        const params = {} as HeaderValueGetterParams;
        const fkt = lookup(def, RECENT_STATUS)
          .headerValueGetter as HeaderValueGetterFunc;

        expect(fkt(params)).toBe('');
      });
    });

    describe('MANUFACTURER_SUPPLIER_COUNTRY', () => {
      it('should translate supplier country', () => {
        const params = {
          data: { manufacturerSupplierCountry: 'DE' },
        } as ValueGetterParams;
        const fkt = lookup(def, MANUFACTURER_SUPPLIER_COUNTRY)
          .filterValueGetter as ValueGetterFunc;

        expect(fkt(params)).toBe(
          'materialsSupplierDatabase.mainTable.tooltip.country.DE (DE)'
        );
      });

      it('should translate supplier country tooltip', () => {
        const params = {
          value: 'DE',
        } as ITooltipParams;
        const fkt = lookup(
          def,
          MANUFACTURER_SUPPLIER_COUNTRY
        ).tooltipValueGetter;

        expect(fkt(params)).toBe('country.DE');
      });
    });

    describe('MANUFACTURER_SUPPLIER_REGION', () => {
      it('should translate supplier region', () => {
        const params = {
          data: { manufacturerSupplierRegion: 'EU' },
        } as ValueGetterParams;
        const fkt = lookup(def, MANUFACTURER_SUPPLIER_REGION)
          .filterValueGetter as ValueGetterFunc;

        expect(fkt(params)).toBe(
          'materialsSupplierDatabase.mainTable.tooltip.region.EU (EU)'
        );
      });

      it('should translate supplier region tooltip', () => {
        const params = {
          value: 'EU',
        } as ITooltipParams;
        const fkt = lookup(
          def,
          MANUFACTURER_SUPPLIER_REGION
        ).tooltipValueGetter;

        expect(fkt(params)).toBe('region.EU');
      });
    });
  });

  describe('HISTORY_COLUMN_DEFINITION', () => {
    const def = [HISTORY_COLUMN_DEFINITION];
    describe('RECENT_STATUS', () => {
      it('should get static value for recent status', () => {
        const params = {} as ValueGetterParams;
        const fkt = lookup(def, HISTORY).valueGetter as ValueGetterFunc;

        expect(fkt(params)).toBe('');
      });

      it('should get empty header for status', () => {
        const params = {} as HeaderValueGetterParams;
        const fkt = lookup(def, HISTORY)
          .headerValueGetter as HeaderValueGetterFunc;

        expect(fkt(params)).toBe('');
      });
    });
  });

  describe('SAP_MATERIALS_COLUMN_DEFINITIONS', () => {
    const def = SAP_MATERIALS_COLUMN_DEFINITIONS;
    describe('DATA_DATE', () => {
      it('should get date as local date string', () => {
        const value = Date.now();
        const params = { value } as ValueFormatterParams;
        const fkt = lookup(def, DATA_DATE).valueFormatter as ValueFormatterFunc;

        expect(fkt(params)).toBe(new Date(value).toLocaleDateString('en-GB'));
      });
    });
  });

  describe('STEEL_COLUMN_DEFINITIONS', () => {
    const def = STEEL_COLUMN_DEFINITIONS;
    describe('MATERIAL_STANDARD_STANDARD_DOCUMENT', () => {
      it('should translate material standard tooltip', () => {
        const params = {
          value: 'DE',
        } as ITooltipParams;
        const fkt = lookup(
          def,
          MATERIAL_STANDARD_STANDARD_DOCUMENT
        ).tooltipValueGetter;

        expect(fkt(params)).toBe('standardLink');
      });

      it('should disable tooltip on empty value', () => {
        const params = {} as ITooltipParams;
        const fkt = lookup(
          def,
          MATERIAL_STANDARD_STANDARD_DOCUMENT
        ).tooltipValueGetter;

        expect(fkt(params)).toBeFalsy();
      });
    });

    describe('MATERIAL_STANDARD_STOFF_ID', () => {
      it('should translate material standard tooltip', () => {
        const params = {
          value: 'DE',
        } as ITooltipParams;
        const fkt = lookup(def, MATERIAL_STANDARD_STOFF_ID).tooltipValueGetter;

        expect(fkt(params)).toBe('wiamLink');
      });

      it('should disable tooltip on empty value', () => {
        const params = {} as ITooltipParams;
        const fkt = lookup(def, MATERIAL_STANDARD_STOFF_ID).tooltipValueGetter;

        expect(fkt(params)).toBeFalsy();
      });
    });
  });

  describe('LUBRICANT_COLUMN_DEFINITIONS', () => {
    const def = LUBRICANT_COLUMN_DEFINITIONS;
    describe('MATERIAL_STANDARD_STOFF_ID', () => {
      it('should translate material standard tooltip', () => {
        const params = {
          value: 'DE',
        } as ITooltipParams;
        const fkt = lookup(def, MATERIAL_STANDARD_STOFF_ID).tooltipValueGetter;

        expect(fkt(params)).toBe('wiamLink');
      });

      it('should disable tooltip on empty value', () => {
        const params = {} as ITooltipParams;
        const fkt = lookup(def, MATERIAL_STANDARD_STOFF_ID).tooltipValueGetter;

        expect(fkt(params)).toBeFalsy();
      });
    });
  });
});
