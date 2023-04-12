import { MatTooltipModule } from '@angular/material/tooltip';

import { isTextTruncatedDirective } from '@gq/shared/directives/show-tooltip-when-truncated/show-tooltip-when-truncated.directive';
import {
  QuotationSearchResult,
  QuotationStatus,
} from '@gq/shared/models/quotation';
import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { HelperService } from '@gq/shared/services/helper/helper.service';
import { PriceService } from '@gq/shared/services/price/price.service';
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
      MockPipe(NumberCurrencyPipe),
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
      const MOCK_GPI = 0.078_91;
      const MOCK_GPI_PERCENTAGE = '7.89 %';

      PriceService.roundValue = jest.fn().mockImplementation((val) => val);
      PriceService.roundToTwoDecimals = jest
        .fn()
        .mockImplementation((val) => val);
      PriceService.calculateMargin = jest.fn().mockReturnValue(MOCK_GPI);
      helperService.transformPercentage = jest
        .fn()
        .mockReturnValue(MOCK_GPI_PERCENTAGE);

      spectator.setInput('searchResult', searchResult);
      spectator.detectChanges();

      expect(PriceService.roundValue).toHaveBeenCalledTimes(2);
      expect(PriceService.roundValue).toHaveBeenCalledWith(
        searchResult.materialPrice,
        searchResult.materialQuantity
      );
      expect(PriceService.roundValue).toHaveBeenCalledWith(
        searchResult.materialGpc,
        searchResult.materialQuantity
      );
      expect(PriceService.calculateMargin).toHaveBeenCalledTimes(1);
      expect(PriceService.roundToTwoDecimals).toBeCalledTimes(1);
      expect(PriceService.roundToTwoDecimals).toHaveBeenCalledWith(MOCK_GPI);
      expect(helperService.transformPercentage).toHaveBeenCalledTimes(1);
      expect(helperService.transformPercentage).toHaveBeenCalledWith(MOCK_GPI);
      expect(component.materialGpi).toEqual(MOCK_GPI_PERCENTAGE);
    });
  });
});
