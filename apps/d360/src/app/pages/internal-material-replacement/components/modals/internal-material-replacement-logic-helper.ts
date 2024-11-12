import {
  IMRSubstitution,
  ReplacementType,
} from '../../../../feature/internal-material-replacement/model';

export interface ReplacementTypeLogic {
  replacementType: ReplacementType;
  mandatoryFields: (keyof IMRSubstitution)[];
  deactivatedFields: (keyof IMRSubstitution)[];
}

export function getReplacementTypeLogic(
  isNewSubstitution: boolean,
  replacementType: ReplacementType
): ReplacementTypeLogic {
  const replacementLogicForNew =
    getReplacementTypeLogicForNewSubstitution(replacementType);

  return isNewSubstitution
    ? replacementLogicForNew
    : getReplacementTypeLogicForEdit(replacementLogicForNew);
}

function getReplacementTypeLogicForNewSubstitution(
  replacementType: ReplacementType
): ReplacementTypeLogic {
  switch (replacementType) {
    case 'RELOCATION': {
      return {
        replacementType: 'RELOCATION',
        mandatoryFields: [
          'replacementType',
          'region',
          'predecessorMaterial',
          'successorMaterial',
          'startOfProduction',
          'cutoverDate',
        ],
        deactivatedFields: [
          'salesArea',
          'salesOrg',
          'customerNumber',
          'replacementDate',
        ],
      };
    }
    case 'PARTIAL_RELOCATION': {
      return {
        replacementType: 'PARTIAL_RELOCATION',
        mandatoryFields: [
          'replacementType',
          'region',
          'predecessorMaterial',
          'successorMaterial',
          'customerNumber',
          'startOfProduction',
          'cutoverDate',
        ],
        deactivatedFields: ['salesArea', 'salesOrg', 'replacementDate'],
      };
    }
    case 'PACKAGING_CHANGE': {
      return {
        replacementType: 'PACKAGING_CHANGE',
        mandatoryFields: [
          'replacementType',
          'region',
          'predecessorMaterial',
          'successorMaterial',
          'replacementDate',
          'cutoverDate',
        ],
        deactivatedFields: ['customerNumber', 'startOfProduction'],
      };
    }
    case 'PRODUCT_DEVELOPMENT': {
      return {
        replacementType: 'PRODUCT_DEVELOPMENT',
        mandatoryFields: [
          'replacementType',
          'region',
          'predecessorMaterial',
          'successorMaterial',
          'replacementDate',
          'cutoverDate',
        ],
        deactivatedFields: ['customerNumber', 'startOfProduction'],
      };
    }
    case 'DISCONTINUED': {
      return {
        replacementType: 'DISCONTINUED',
        mandatoryFields: [
          'replacementType',
          'region',
          'predecessorMaterial',
          'replacementDate',
        ],
        deactivatedFields: [
          'salesArea',
          'salesOrg',
          'customerNumber',
          'successorMaterial',
          'cutoverDate',
          'startOfProduction',
        ],
      };
    }
    case 'CUSTOMER_DROPOUT': {
      return {
        replacementType: 'CUSTOMER_DROPOUT',
        mandatoryFields: [
          'replacementType',
          'region',
          'customerNumber',
          'replacementDate',
        ],
        deactivatedFields: [
          'salesArea',
          'salesOrg',
          'predecessorMaterial',
          'successorMaterial',
          'cutoverDate',
          'startOfProduction',
        ],
      };
    }
    default: {
      throw new Error(`Unknown replacement type: ${replacementType}`);
    }
  }
}

export function checkForbiddenFieldsForNewSubstitution(
  substitution: IMRSubstitution
): (keyof IMRSubstitution)[] | undefined {
  if (!substitution.replacementType) {
    return undefined;
  }

  const forbiddenFields = getReplacementTypeLogicForNewSubstitution(
    substitution.replacementType
  ).deactivatedFields;

  const wronglyFilledFields: (keyof IMRSubstitution)[] = [];
  forbiddenFields.forEach((field: keyof IMRSubstitution) => {
    if (
      Object.hasOwn(substitution, field) &&
      substitution[field] &&
      substitution[field] !== ''
    ) {
      wronglyFilledFields.push(field);
    }
  });

  return wronglyFilledFields;
}

export function checkMissingFields(
  substitution: IMRSubstitution
): (keyof IMRSubstitution)[] | undefined {
  if (!substitution.replacementType) {
    return undefined;
  }

  // For mandatory fields it is not important if we editing or creating a new substitution, mandatory fields are still mandatory
  const mandatoryFields = getReplacementTypeLogicForNewSubstitution(
    substitution.replacementType
  ).mandatoryFields;

  const missingFields: (keyof IMRSubstitution)[] = [];
  mandatoryFields.forEach((field: keyof IMRSubstitution) => {
    try {
      const value = substitution[field];
      if (value == null || value === '' || value === undefined) {
        missingFields.push(field);
      }
    } catch {
      missingFields.push(field);
    }
  });

  return missingFields;
}

function getReplacementTypeLogicForEdit(
  defaultLogic: ReplacementTypeLogic
): ReplacementTypeLogic {
  // For editing, the key fields are not editable, but they are still mandatory
  const keyFields: (keyof IMRSubstitution)[] = [
    'region',
    'replacementType',
    'salesArea',
    'salesOrg',
    'customerNumber',
    'predecessorMaterial',
  ];
  // Combine old deactivated and key fields and dedupe array using set
  const newDeactivated = [
    ...new Set([...defaultLogic.deactivatedFields, ...keyFields]),
  ];

  return {
    replacementType: defaultLogic.replacementType,
    mandatoryFields: defaultLogic.mandatoryFields,
    deactivatedFields: newDeactivated,
  };
}
