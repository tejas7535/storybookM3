import { inject, Injectable } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';

import { PartnerAffiliateCode, PartnerVersion } from '@ga/shared/models';

import { greaseShopQuery } from '../../helpers/grease-helpers';

@Injectable({ providedIn: 'root' })
export class GreaseShopService {
  private readonly translocoService = inject(TranslocoService);

  public getShopUrl(greaseTitle: string, partner?: PartnerVersion) {
    const affiliateParameter = this.getPartnerVersionAffiliateCode(partner);

    const productParameter = greaseShopQuery(greaseTitle);

    return `${this.translocoService.translate('calculationResult.shopBaseUrl')}/p/${productParameter}?utm_source=grease-app${affiliateParameter}`;
  }

  private getPartnerVersionAffiliateCode(
    partnerVersion?: PartnerVersion
  ): string {
    const code: string = PartnerAffiliateCode[partnerVersion];

    return code ? `&${code}` : '';
  }
}
