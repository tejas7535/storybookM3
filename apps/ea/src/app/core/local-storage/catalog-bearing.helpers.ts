import {
  CATALOG_COMBINED_KEY_VALUES,
  CATALOG_LUBRICATION_METHOD_KEY_MAPPING,
  CATALOG_LUBRICATION_METHOD_VALUE_MAPPING,
  CATALOG_VALUES_DEFAULT_VALUE_SKIP,
} from '../services/catalog.service.constant';
import {
  CalculationParametersOperationConditions,
  LoadCaseData,
  ProductSelectionTemplate,
} from '../store/models';

export const applyTemplateToStoredOperationConditions = (
  storedOperationConditions: Partial<CalculationParametersOperationConditions>,
  loadcaseTemplates: ProductSelectionTemplate[],
  operationConditionsTemplates: ProductSelectionTemplate[]
) => {
  const templates = [...loadcaseTemplates, ...operationConditionsTemplates];

  // flat operation conditions
  const operationConditions: Partial<CalculationParametersOperationConditions> =
    Object.fromEntries(
      mapEntries(Object.entries(storedOperationConditions), templates)
    );

  // lubrication
  operationConditions.lubrication = {
    ...storedOperationConditions.lubrication,
    ...Object.fromEntries(
      mapEntries(
        Object.entries(storedOperationConditions.lubrication),
        templates
      )
    ),
  };
  // check selected lubrication
  const selectedLubricationKey = CATALOG_LUBRICATION_METHOD_VALUE_MAPPING.get(
    storedOperationConditions.lubrication.lubricationSelection
  );

  const lubricationMethodTemplate = templates.find(
    (template) => template.id === 'IDL_LUBRICATION_METHOD'
  );

  operationConditions.lubrication.lubricationSelection = (
    lubricationMethodTemplate?.options.some(
      (option) => option.value === selectedLubricationKey
    )
      ? storedOperationConditions.lubrication.lubricationSelection
      : CATALOG_LUBRICATION_METHOD_KEY_MAPPING.get(
          lubricationMethodTemplate?.defaultValue
        )
  ) as 'grease' | 'oilBath' | 'oilMist' | 'recirculatingOil';
  // load case data
  operationConditions.loadCaseData = storedOperationConditions.loadCaseData.map(
    (storedLoadCaseData) =>
      ({
        ...Object.fromEntries(
          mapEntries(Object.entries(storedLoadCaseData), templates)
        ),
        load: Object.fromEntries(
          mapEntries(Object.entries(storedLoadCaseData.load), templates)
        ),
        rotation: Object.fromEntries(
          mapEntries(Object.entries(storedLoadCaseData.rotation), templates)
        ),
      }) as LoadCaseData
  );

  return operationConditions;
};

export const mapEntries = (
  entries: [key: string, value: any][],
  templates: ProductSelectionTemplate[]
) =>
  entries
    .filter(([key, _value]) =>
      templates.some(
        (template) => template.id === CATALOG_COMBINED_KEY_VALUES.get(key)
      )
    )
    .map(([key, value]) => {
      let defaultValue: string | number;
      if (
        !value &&
        value !== null &&
        !CATALOG_VALUES_DEFAULT_VALUE_SKIP.includes(key)
      ) {
        defaultValue = templates.find(
          (template) => template.id === CATALOG_COMBINED_KEY_VALUES.get(key)
        ).defaultValue;
      }

      if (Number.parseFloat(defaultValue as string) === 0) {
        defaultValue = undefined;
      }

      if (!Number.isNaN(Number.parseFloat(defaultValue as string))) {
        defaultValue = Number.parseFloat(defaultValue as string);
      }

      return [key, value ?? defaultValue];
    });
