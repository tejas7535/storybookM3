import { translate } from '@jsverse/transloco';

import { PortfolioStatus } from '../../feature/customer-material-portfolio/cmp-modal-types';
import { ReplacementType } from '../../feature/internal-material-replacement/model';
import { DemandCharacteristic } from '../../feature/material-customer/model';

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
  return (params: any): string =>
    translate(`replacement_type.${params.value as ReplacementType}`, {});
}
