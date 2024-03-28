import { FormControl } from '@angular/forms';

export const assignDialogValues = (component: any, overrides = {}) => {
  const base = {
    materialStandardIdControl: new FormControl(),
    standardDocumentsControl: new FormControl(),
    materialNamesControl: new FormControl(),

    // Supplier
    manufacturerSupplierIdControl: new FormControl(),
    supplierControl: new FormControl(),
    supplierPlantControl: new FormControl({ value: undefined, disabled: true }),
    supplierCountryControl: new FormControl({
      value: undefined,
      disabled: true,
    }),

    // CO2
    co2Scope1Control: new FormControl(),
    co2Scope2Control: new FormControl(),
    co2Scope3Control: new FormControl(),
    co2TotalControl: new FormControl(),
    co2ClassificationControl: new FormControl({
      value: undefined,
      disabled: true,
    }),

    // Material
    categoriesControl: new FormControl(),
    releaseRestrictionsControl: new FormControl(),
  };

  const assign = {
    ...base,
    ...overrides,
  };

  for (const { key, value } of Object.entries(assign).map(([k, v]) => ({
    key: k,
    value: v,
  }))) {
    component[key] = value;
  }
};
