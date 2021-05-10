import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { translate } from '@ngneat/transloco';

import {
  DATA_POINT_MOCK,
  TRANSACTION_MOCK,
} from '../../../../../testing/mocks';
import { SalesIndication } from '../../../../core/store/reducers/transactions/models/sales-indication.enum';
import { PriceService } from '../../../../shared/services/price-service/price.service';
import { DataPoint } from '../models/data-point.model';
import { ToolTipItems } from '../models/tooltip-items.enum';
import { TOOLTIP_CONFIG } from './chart.config';
import { ChartConfigService } from './chart.config.service';
import { DataPointColor } from './data-point-color.enum';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('ChartConfigService', () => {
  let service: ChartConfigService;
  let spectator: SpectatorService<ChartConfigService>;

  const createService = createServiceFactory({
    service: ChartConfigService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('getLineForToolTipFormatter', () => {
    test('should return Line', () => {
      const translateKey = 'translateKey';
      const salesIndication = SalesIndication.LOST_QUOTE;
      service.getDataPointStyle = jest.fn();
      service.getLineForToolTipFormatter(
        salesIndication,
        translateKey,
        'testValue'
      );

      expect(translate).toBeCalledWith(
        `transactionView.graph.tooltip.${translateKey}`
      );
    });
  });
  describe('getRegressionForToolTipFormatter', () => {
    test('should return regression line', () => {
      const data = { value: [0, 1] } as any;
      service.regressionData = [[0, 100]];

      service.getLineForToolTipFormatter = jest.fn(() => '');

      const result = service.getRegressionForToolTipFormatter(data);

      expect(
        service.getLineForToolTipFormatter(
          DataPointColor.REGRESSION,
          'regression',
          '100%'
        )
      );
      expect(result).toEqual(
        `<hr style="margin-top: 5px; margin-bottom:5px; opacity: 0.6">`
      );
    });
  });

  describe('getToolTipConfig', () => {
    test('should return tooltipconfig', () => {
      service.tooltipFormatter = jest.fn();
      const formatter = service.tooltipFormatter;
      const result = service.getToolTipConfig();

      expect(result).toEqual({ ...TOOLTIP_CONFIG, formatter });
    });
  });
  describe('getValueForToolTipItem', () => {
    const data: DataPoint = DATA_POINT_MOCK;
    test('should return price', () => {
      const result = service.getValueForToolTipItem(ToolTipItems.PRICE, data);

      expect(result).toEqual(`${data.price} EUR`);
    });
    test('should return year', () => {
      const result = service.getValueForToolTipItem(ToolTipItems.YEAR, data);

      expect(result).toEqual(data.year);
    });
    test('should return quantity', () => {
      const result = service.getValueForToolTipItem(
        ToolTipItems.QUANTITY,
        data
      );

      expect(result).toEqual(data.value[service.INDEX_X_AXIS]);
    });
    test('should return profitMargin', () => {
      const result = service.getValueForToolTipItem(
        ToolTipItems.PROFIT_MARGIN,
        data
      );

      expect(result).toEqual(`${data.value[service.INDEX_Y_AXIS]}%`);
    });
  });

  describe('tooltipFormatter', () => {
    test('should create tooltip', () => {
      const param = { data: DATA_POINT_MOCK };
      service.getRegressionForToolTipFormatter = jest.fn(() => '');
      service.getValueForToolTipItem = jest.fn();
      service.getLineForToolTipFormatter = jest.fn(() => '');

      const result = service.tooltipFormatter(param);

      expect(result).toEqual(`${param.data.customerName}<br>`);
      expect(service.getValueForToolTipItem).toHaveBeenCalledTimes(4);
      expect(service.getLineForToolTipFormatter).toHaveBeenCalledTimes(4);
      expect(service.getRegressionForToolTipFormatter).toHaveBeenCalledTimes(1);
    });
  });

  describe('calculateAxisMax', () => {
    test('should calculate axisMax for X', () => {
      const datapoints = [DATA_POINT_MOCK];

      const result = service.calculateAxisMax(datapoints, service.INDEX_X_AXIS);

      expect(result).toEqual(140);
    });
  });

  describe('getXAxisConfig', () => {
    test('should return X_AXIS_CONFIG', () => {
      const max = 10;
      service.calculateAxisMax = jest.fn(() => max);

      const result = service.getXAxisConfig([DATA_POINT_MOCK]);

      expect(result).toEqual({ ...service.X_AXIS_CONFIG, max });
    });
  });

  describe('getSeriesConfig', () => {
    test('should return series config', () => {
      const data = [DATA_POINT_MOCK];
      const regressionData = [
        [0, 100],
        [1, 50],
      ];
      const color = DataPointColor.LOST_QUOTE;
      const name = 'dataPointName';

      service.getDataPointStyle = jest.fn(() => color);
      service.getDataPointName = jest.fn(() => name);

      const result = service.getSeriesConfig(data, regressionData);

      expect(result).toEqual([
        {
          data,
          color,
          name,
          type: 'scatter',
        },
        {
          type: 'line',
          data: regressionData,
          color: DataPointColor.REGRESSION,
          symbol: 'none',
          name: 'translate it',
        },
      ]);
    });
  });

  describe('buildDataPoints', () => {
    test('should build dataPoints from transactions', () => {
      const transactions = [TRANSACTION_MOCK];
      const result = service.buildDataPoints(transactions);

      const expected: DataPoint = {
        salesIndication: TRANSACTION_MOCK.salesIndication,
        customerName: TRANSACTION_MOCK.customerName,
        price: TRANSACTION_MOCK.price,
        year: TRANSACTION_MOCK.year,
        value: [
          TRANSACTION_MOCK.quantity,
          PriceService.roundToTwoDecimals(TRANSACTION_MOCK.profitMargin),
        ],
      };

      expect(result).toEqual([expected]);
    });
  });

  describe('getDataPointStyle', () => {
    test('should get color for INVOICE', () => {
      const color = service.getDataPointStyle(SalesIndication.INVOICE);

      expect(color).toEqual(DataPointColor.INVOICE);
    });
    test('should get color for LOST_QUOTE', () => {
      const color = service.getDataPointStyle(SalesIndication.LOST_QUOTE);

      expect(color).toEqual(DataPointColor.LOST_QUOTE);
    });
    test('should get color for INVOICE', () => {
      const color = service.getDataPointStyle(SalesIndication.ORDER);

      expect(color).toEqual(DataPointColor.ORDER);
    });
  });

  describe('getDataPointName', () => {
    test('should return Name for INVOICE', () => {
      service.getDataPointName(SalesIndication.INVOICE);

      expect(translate).toHaveBeenCalledWith(
        `transactionView.graph.salesIndication.invoice`
      );
    });
    test('should return Name for LOST_QUOTE', () => {
      service.getDataPointName(SalesIndication.LOST_QUOTE);

      expect(translate).toHaveBeenCalledWith(
        `transactionView.graph.salesIndication.lostQuote`
      );
    });
    test('should return Name for ORDER', () => {
      service.getDataPointName(SalesIndication.ORDER);

      expect(translate).toHaveBeenCalledWith(
        `transactionView.graph.salesIndication.order`
      );
    });
  });
});
