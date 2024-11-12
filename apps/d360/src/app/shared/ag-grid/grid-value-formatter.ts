import { translate } from '@jsverse/transloco';

import { PortfolioStatus } from '../../feature/customer-material-portfolio/cmp-modal-types';
import {
  ReplacementType,
  replacementTypeValues,
} from '../../feature/internal-material-replacement/model';
import { DemandCharacteristic } from '../../feature/material-customer/model';
import { parseToStringLiteralTypeIfPossible } from '../utils/parse-values';

export function portfolioStatusValueFormatter() {
  return (params: any): string =>
    translate(
      `material_customer.portfolio_status.${params.value as PortfolioStatus}`,
      {},
      ''
    );
}

export function demandCharacteristicValueFormatter() {
  return (params: any): string =>
    translate(
      `demand_characteristics.${params.value as DemandCharacteristic}`,
      {},
      ''
    );
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
      translate(`replacement_type.${val}`, {});
    const parsed = parseToStringLiteralTypeIfPossible<ReplacementType>(
      value,
      replacementTypeValues,
      localizationKeyCreation
    );

    if (parsed === undefined) {
      return value;
    }

    return translate(`replacement_type.${parsed}`, {});
  };
}
