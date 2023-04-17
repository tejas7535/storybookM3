import { MatTooltipModule } from '@angular/material/tooltip';

import { isTextTruncatedDirective } from '@gq/shared/directives/show-tooltip-when-truncated/show-tooltip-when-truncated.directive';
import {
  QuotationSearchResult,
  QuotationStatus,
} from '@gq/shared/models/quotation';
import { MultiplyWithPriceUnitPipe } from '@gq/shared/pipes/multiply-with-price-unit/multiply-with-price-unit.pipe';
import { HelperService } from '@gq/shared/services/helper/helper.service';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockDirective, MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { GlobalSearchResultsItemComponent } from './global-search-results-item.component';

describe('GlobalSearchResultsItemComponent', () => {
  let component: GlobalSearchResultsItemComponent;
  let spectator: Spectator<GlobalSearchResultsItemComponent>;
  let helperService: HelperService;

  const createComponent = createComponentFactory({
    component: GlobalSearchResultsItemComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), MatTooltipModule],
    providers: [
      {
        provide: HelperService,
        useValue: {
          transformPercentage: jest.fn(),
        },
      },
    ],
    declarations: [
      GlobalSearchResultsItemComponent,
      MockDirective(isTextTruncatedDirective),
      MockPipe(MultiplyWithPriceUnitPipe),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    helperService = spectator.inject(HelperService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set searchResult', () => {
    const searchResult = {
      gqId: 123,
      customerSalesOrg: 'customerSalesOrg',
      customerName: 'customerName',
      customerId: '12345678',
      currency: 'EUR',
      materialNumber: '000178349006210',
      materialPrice: 123.45,
      materialQuantity: 1000,
      materialGpc: 1.23,
      materialPriceUnit: 1,
      status: QuotationStatus.ACTIVE,
    } as QuotationSearchResult;

    it('should set quotationSummary', () => {
      spectator.setInput('searchResult', searchResult);
      spectator.detectChanges();

      expect(component.quotationSummary).toEqual(searchResult);
    });

    it('should set materialGpi', () => {
      const MOCK_GPI = 7.89;
      const MOCK_GPI_PERCENTAGE = '7.89 %';

      jest.spyOn(pricingUtils, 'roundValue').mockImplementation((val) => val);
      jest.spyOn(pricingUtils, 'calculateMargin').mockReturnValue(MOCK_GPI);

      helperService.transformPercentage = jest
        .fn()
        .mockReturnValue(MOCK_GPI_PERCENTAGE);

      spectator.setInput('searchResult', searchResult);
      spectator.detectChanges();

      expect(pricingUtils.calculateMargin).toHaveBeenCalledTimes(1);
      expect(pricingUtils.calculateMargin).toBeCalledWith(
        searchResult.materialPrice,
        searchResult.materialGpc
      );
      expect(helperService.transformPercentage).toHaveBeenCalledTimes(1);
      expect(helperService.transformPercentage).toHaveBeenCalledWith(MOCK_GPI);
      expect(component.materialGpi).toEqual(MOCK_GPI_PERCENTAGE);
    });
  });
});
