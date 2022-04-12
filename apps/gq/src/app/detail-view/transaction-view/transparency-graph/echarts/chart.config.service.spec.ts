import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { translate, TranslocoModule } from '@ngneat/transloco';
import { SeriesOption } from 'echarts';

import {
  COMPARABLE_LINKED_TRANSACTION_MOCK,
  CUSTOMER_MOCK,
  DATA_POINT_MOCK,
} from '../../../../../testing/mocks';
import { SalesIndication } from '../../../../core/store/reducers/transactions/models/sales-indication.enum';
import { PriceService } from '../../../../shared/services/price-service/price.service';
import { DataPoint } from '../models/data-point.model';
import { ToolTipItems } from '../models/tooltip-items.enum';
import { LEGEND, TOOLTIP_CONFIG } from './chart.config';
import { ChartConfigService } from './chart.config.service';
import { DataPointColor } from './data-point-color.enum';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
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

      expect(service.getLineForToolTipFormatter).toHaveBeenCalledWith(
        DataPointColor.REGRESSION,
        'regression',
        '100%'
      );
      expect(result).toEqual(
        `<hr style="margin-top: 5px; margin-bottom:5px; opacity: 0.2">`
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

      expect(result).toEqual(`${data.price} ${data.currency}`);
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

      expect(result).toEqual(
        `<span style="font-family: 'Roboto';color: rgba(0,0,0,0.38); font-weight:bold">${param.data.customerName}</span><br>`
      );
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

      const result = service.getSeriesConfig(
        data,
        regressionData,
        CUSTOMER_MOCK
      );

      expect(result).toEqual({
        options: [SalesIndication.LOST_QUOTE],
        series: [
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
        ],
      });
    });
    test('should build own customer data points', () => {
      const data = [
        DATA_POINT_MOCK,
        {
          ...DATA_POINT_MOCK,
          customerId: CUSTOMER_MOCK.identifier.customerId,
          customerName: CUSTOMER_MOCK.name,
        },
      ];
      const regressionData = [
        [0, 100],
        [1, 50],
      ];
      const color = DataPointColor.LOST_QUOTE;
      const name = 'dataPointName';

      service.getDataPointStyle = jest.fn(() => color);
      service.getDataPointName = jest.fn(() => name);

      const result = service.getSeriesConfig(
        data,
        regressionData,
        CUSTOMER_MOCK
      );

      expect(result).toEqual({
        options: [SalesIndication.LOST_QUOTE],
        series: [
          {
            color,
            data: [data[1]],
            name: CUSTOMER_MOCK.name,
            type: 'scatter',
            itemStyle: { borderColor: DataPointColor.SAME_CUSTOMER_BORDER },
          },
          {
            data: [data[0]],
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
        ],
      });
    });
  });

  describe('buildDataPoints', () => {
    test('should build dataPoints from transactions', () => {
      const transactions = [COMPARABLE_LINKED_TRANSACTION_MOCK];
      const currency = 'EUR';
      const result = service.buildDataPoints(transactions, currency);

      const expected: DataPoint = {
        currency,
        salesIndication: COMPARABLE_LINKED_TRANSACTION_MOCK.salesIndication,
        customerName: COMPARABLE_LINKED_TRANSACTION_MOCK.customerName,
        customerId: COMPARABLE_LINKED_TRANSACTION_MOCK.customerId,
        price: COMPARABLE_LINKED_TRANSACTION_MOCK.price,
        year: COMPARABLE_LINKED_TRANSACTION_MOCK.year,
        value: [
          COMPARABLE_LINKED_TRANSACTION_MOCK.quantity,
          PriceService.roundToTwoDecimals(
            COMPARABLE_LINKED_TRANSACTION_MOCK.profitMargin
          ),
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
    test('should get color for ORDER', () => {
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

  describe('getLegend', () => {
    test('should return legend', () => {
      const series: SeriesOption[] = [
        {
          data: [
            {
              ...DATA_POINT_MOCK,
              salesIndication: SalesIndication.INVOICE,
              customerId: CUSTOMER_MOCK.identifier.customerId,
              customerName: CUSTOMER_MOCK.name,
            } as any,
          ],
          name: CUSTOMER_MOCK.name,
          type: 'scatter',
          itemStyle: { borderColor: DataPointColor.SAME_CUSTOMER_BORDER },
        },
        {
          data: [DATA_POINT_MOCK],
          name: 'Invoice',
          type: 'scatter',
        },
      ];
      const salesIndications = [
        SalesIndication.LOST_QUOTE,
        SalesIndication.INVOICE,
      ];

      service.getDataPointName = jest.fn(() => 'datapoint name');

      const result = service.getLegend(CUSTOMER_MOCK, series, salesIndications);
      const expectedData = [
        {
          name: CUSTOMER_MOCK.name,
          icon: 'circle',
          itemStyle: {
            color: DataPointColor.SAME_CUSTOMER,
            borderColor: DataPointColor.SAME_CUSTOMER_BORDER,
            borderWidth: 1,
          },
        },
        {
          name: 'datapoint name',
          icon: 'circle',
        },
        {
          name: 'datapoint name',
          icon: 'circle',
        },
        {
          name: 'translate it',
          icon: 'circle',
        },
      ];

      expect(result).toEqual({ ...LEGEND, data: expectedData });
    });
  });
});
