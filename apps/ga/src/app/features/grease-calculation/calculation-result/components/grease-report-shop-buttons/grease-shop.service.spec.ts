import { TranslocoService } from '@jsverse/transloco';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { PartnerVersion } from '@ga/shared/models';

import { GreaseShopService } from './grease-shop.service';

describe('GreaseShopService', () => {
  let spectator: SpectatorService<GreaseShopService>;
  let service: GreaseShopService;

  const createService = createServiceFactory({
    service: GreaseShopService,
    providers: [
      {
        provide: TranslocoService,
        useValue: {
          translate: jest.fn((input) => input),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    jest.resetAllMocks();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getPartnerVersionAffiliateCode()', () => {
    it('should add known affiliate codes', () => {
      const code = service['getPartnerVersionAffiliateCode'](
        'schmeckthal-gruppe' as PartnerVersion
      );
      expect(code).toEqual('&affiliateid=A100101248');
    });

    it('ignore undefined and unknown affiliate codes', () => {
      const code = service['getPartnerVersionAffiliateCode'](undefined);

      expect(code).toEqual('');
    });
  });

  describe('getShopUrl()', () => {
    beforeEach(() => {
      jest.mock('../../helpers/grease-helpers', () => ({
        greaseShopQuery: jest.fn((input) => input),
      }));
      service['getPartnerVersionAffiliateCode'] = jest.fn(() => '');
    });

    it('should build the URL properly', () => {
      const url = service.getShopUrl('Arcanol MOTION 2');
      expect(service['translocoService'].translate).toHaveBeenCalledWith(
        'calculationResult.shopBaseUrl'
      );
      expect(url).toMatch(
        'undefined/p/Arcanol-MOTION-2-1kg?utm_source=grease-app'
      );
    });
  });
});
