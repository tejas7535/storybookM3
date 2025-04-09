import { HashMap, translate, TranslateParams } from '@jsverse/transloco';
import { ValueFormatterFunc, ValueFormatterParams } from 'ag-grid-enterprise';

import { DemandValidationBatch } from '../../feature/demand-validation/model';
import {
  ReplacementType,
  replacementTypeValues,
} from '../../feature/internal-material-replacement/model';
import { parseToStringLiteralTypeIfPossible } from '../utils/parse-values';

export function portfolioStatusValueFormatter() {
  return (params: any): string =>
    translateOr(
      `material_customer.portfolio_status.${params.value}`,
      undefined,
      translate('material_customer.portfolio_status.unknown')
    );
}

export function demandCharacteristicValueFormatter() {
  return (params: any): string =>
    translateOr(
      `demand_characteristics.${params.value}`,
      undefined,
      translate('error.valueUnknown')
    );
}

export function translateOr(
  key: TranslateParams,
  params?: HashMap,
  alternative?: string
) {
  const translated: string = translate(key, params);

  if (translated === key && typeof alternative === 'string') {
    return alternative;
  }

  return translated;
}

export function replacementTypeValueFormatter() {
  return (params: any): string => {
    if (params.value === null || params.value === undefined) {
      return null;
    }

    const value = params.value;

    if (value === undefined) {
      return null;
    }

    const localizationKeyCreation = (val: ReplacementType) =>
      translate(`replacement_type.${val}`);
    const parsed = parseToStringLiteralTypeIfPossible<ReplacementType>(
      value,
      replacementTypeValues,
      localizationKeyCreation
    );

    if (parsed === undefined) {
      return value;
    }

    return translate(`replacement_type.${parsed}`);
  };
}

export function listUploadPeriodTypeValueFormatter(): ValueFormatterFunc<DemandValidationBatch> {
  return (params: ValueFormatterParams<DemandValidationBatch>): string => {
    const value = params?.value;

    if ([null, undefined, ''].includes(value)) {
      return '';
    }

    return translateOr(
      `validation_of_demand.upload_modal.list.menu_item_${value}`,
      undefined,
      value
    );
  };
}
