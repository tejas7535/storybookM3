import { BehaviorSubject, of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { PowerSupply } from '@lsa/shared/constants';
import { UserTier } from '@lsa/shared/constants/user-tier.enum';
import {
  Accessory,
  Lubricator,
  RecommendationResponse,
} from '@lsa/shared/models';
import { MediasCallbackResponse } from '@lsa/shared/models/price-availibility.model';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import {
  FontResolverService,
  ImageResolverService,
} from '@schaeffler/pdf-generator';

import { AddToCartService } from '../add-to-cart.service';
import { LsaFormService } from '../lsa-form.service';
import { PriceAvailabilityService } from '../price-availability.service';
import { RestService } from '../rest.service';
import { ResultInputsService } from '../result-inputs.service';
import { FormDataType, PDFGeneratorService } from './pdf-generator.service';
import { MOCK_RECOMMENDATION_FORM } from './recommendation-form.mock';

const MOCK_LUBRICATOR: Lubricator = {
  matNr: '12345',
  name: 'HIGHEND_LUBRICATOR',
  outputDiameter: 1,
  maxOperatingPressure: 100,
  noOfOutlets: 2,
  minTemp: -100,
  maxTemp: 100,
  volume: '250 ml',
  bundle: [
    {
      matnr: '12',
      fifteen_digit: '12',
      designation: 'Acc #1',
      qty: 5,
      pim_code: '12',
      class: 'Lubricators',
    },
    {
      matnr: '32',
      designation: 'Acc #2',
      fifteen_digit: '12',
      qty: 1,
      pim_code: '32',
      class: 'Cartridges',
    },
  ] as Accessory[],
  technicalAttributes: {
    func_principle: 'Piston Pump',
    dimensions: '20x20x20mm',
    voltage: '30v',
    medium_general: 'Grease',
    mounting_position: 'Arbitrary',
  },
} as unknown as Lubricator;

const MOCK_TABLE_DATA: FormDataType = {
  Lubricators: {
    '12': 5,
  },
};

const MOCK_RECOMMENDATION_RESPONSE: RecommendationResponse = {
  lubricators: {
    recommendedLubricator: MOCK_LUBRICATOR,
    minimumRequiredLubricator: MOCK_LUBRICATOR,
  },
} as RecommendationResponse;

describe('PDFGeneratorService', () => {
  let spectator: SpectatorService<PDFGeneratorService>;
  let service: PDFGeneratorService;
  const createService = createServiceFactory({
    service: PDFGeneratorService,
    providers: [
      mockProvider(TranslocoService),
      mockProvider(RestService, {
        recommendation$: new BehaviorSubject<RecommendationResponse>(
          MOCK_RECOMMENDATION_RESPONSE
        ),
      }),
      mockProvider(ImageResolverService, {
        fetchImages: jest.fn((i) => of(i)),
        fetchImageObject: jest.fn((i) => of(i)),
      }),
      mockProvider(FontResolverService, {
        fetchForLocale: jest.fn(() => of()),
      }),
      mockProvider(LsaFormService, {
        getRecommendationForm: jest.fn(() => ({
          getRawValue: jest.fn(() => MOCK_RECOMMENDATION_FORM),
        })),
      }),
      mockProvider(ResultInputsService, {
        getPipeLengthTranslation: jest.fn((a) => of(a)),
      }),
      mockProvider(AddToCartService, {
        getUserTier: jest.fn(() => UserTier.Business),
      }),
      mockProvider(PriceAvailabilityService, {
        priceAndAvailabilityResponse$: of<MediasCallbackResponse>({
          items: { '32': { available: true, price: 1, currency: 'EUR' } },
        }),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(PDFGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('convertPipeLengthString', () => {
    const mock = service['resultInputsService'][
      'getPipeLengthTranslation'
    ] as jest.Mock;
    mock.mockReturnValue('test');
    service['convertPipeLengthString'](0);
    expect(mock).toHaveBeenCalled();
  });

  it('getPowerSupplyTranslation', () => {
    const options = [
      PowerSupply.Battery,
      PowerSupply.NoPreference,
      PowerSupply.External,
    ];
    for (const opt of options) {
      service['getPowerSupplyTranslation'](opt);
    }
    expect(service['translocoService'].translate).toHaveBeenCalledTimes(
      options.length
    );
  });

  it('calling generate should call loadig', () => {
    const loadingSpy = jest.spyOn(service['loading$$'], 'next');
    service.generatePDF(true);
    service['recommendedLubData'].subscribe();
    expect(loadingSpy).toHaveBeenCalledWith(true);
  });

  it('setFormData should emit the data subjec5', () => {
    const dataSubj = jest.spyOn(service['tableData$$'], 'next');
    service.setFormData({} as FormDataType);
    expect(dataSubj).toHaveBeenCalled();
  });

  it('should select the proper lubricator', (done) => {
    const testResponse: RecommendationResponse = {
      lubricators: {
        minimumRequiredLubricator: { ...MOCK_LUBRICATOR, name: 'MINIMUM' },
        recommendedLubricator: { ...MOCK_LUBRICATOR, name: 'RECOMMENDATION' },
      },
    } as unknown as RecommendationResponse;

    service['recommendedLubData'].subscribe((lubricator) => {
      expect(lubricator).toMatchSnapshot();
      done();
    });
    service.setFormData(MOCK_TABLE_DATA);
    service['restService'].recommendation$.next(testResponse);
    service.generatePDF(true);
  });

  it('should format the groups for proper filtering in pdf', (done) => {
    const testResponse: RecommendationResponse = {
      lubricators: {
        minimumRequiredLubricator: { ...MOCK_LUBRICATOR, name: 'MINIMUM' },
        recommendedLubricator: { ...MOCK_LUBRICATOR, name: 'RECOMMENDATION' },
      },
    } as unknown as RecommendationResponse;

    service['productGroups$'].subscribe((groups) => {
      expect(groups).toMatchSnapshot();
      done();
    });
    service.setFormData(MOCK_TABLE_DATA);
    service['restService'].recommendation$.next(testResponse);
    service.generatePDF(true);
  });
});
