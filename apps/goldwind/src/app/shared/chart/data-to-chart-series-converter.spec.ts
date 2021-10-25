import { GcmStatus } from '../../core/store/reducers/grease-status/models';
import { ShaftStatus } from '../../core/store/reducers/shaft/models';
import { Control, Type } from '../models';
import { DataToChartSeriesConverter } from './data-to-chart-series-converter';

describe('DataChatrSeriesConverter', () => {
  it('should not return an data array if no value or data is given', () => {
    const result = new DataToChartSeriesConverter('deter', undefined, [], {});
    expect(result.data.length).toBeFalsy();
  });

  describe('grease tests', () => {
    it('should return an series object contain transformed data array for gcm1', () => {
      const gcmexample = new DataToChartSeriesConverter(
        'deterioration_1',
        1337,
        [
          {
            formControl: 'formlabel',
            label: 'deterioration_1',
            type: Type.grease,
          } as Control,
        ],
        {
          gcmStatus: [
            {
              deviceId: 'mega',
              gcm01Deterioration: 1337,
            } as GcmStatus,
          ],
        }
      );
      expect(gcmexample.data[0].value[1]).toBe('1337.00');
    });

    it('should return an series object contain transformed data array for gcm2', () => {
      const gcmexample = new DataToChartSeriesConverter(
        'deterioration_2',
        1337,
        [
          {
            formControl: 'formlabel',
            label: 'deterioration_2',
            type: Type.grease,
          } as Control,
        ],
        {
          gcmStatus: [
            {
              deviceId: 'megagut',
              gcm02Deterioration: 39_122,
            } as GcmStatus,
          ],
        }
      );
      expect(gcmexample.data[0].value[1]).toBe('39122.00');
    });

    it('missing prop should return no data in data array', () => {
      const gcmexample = new DataToChartSeriesConverter(
        'deterioration_2',
        1337,
        [
          {
            formControl: 'formlabel',
            label: 'deterioration_2',
            type: Type.grease,
          } as Control,
        ],
        {
          failed_i_hav_no_gcm: [
            {
              deviceId: 'megagut',
            } as GcmStatus,
          ],
        }
      );
      expect(gcmexample.data).toBeFalsy();
    });
  });

  describe('shaft related', () => {
    it('should return an series object contain transformed data array', () => {
      const gcmexample = new DataToChartSeriesConverter(
        'rsmShaftSpeed',
        1337,
        [
          {
            formControl: 'formlabel',
            label: 'rsmShaftSpeed',
            type: Type.rsm,
          } as Control,
        ],
        {
          shaftStatus: [
            {
              deviceId: 'mega',
              rsm01ShaftSpeed: 39_110,
            } as ShaftStatus,
          ],
        }
      );
      expect(gcmexample.data[0].value[1]).toBe('39110.00');
    });
  });

  it('should return an empty data array if no valid is key or dataArr is passed', () => {
    const nokey = new DataToChartSeriesConverter(
      'unkown',
      1337,
      [
        {
          formControl: 'formlabel',
          label: 'just for example sake',
          type: 'any' as any,
        } as Control,
      ],
      {}
    );
    expect(nokey.data.length).toBeFalsy();

    const nodataarr = new DataToChartSeriesConverter(
      'muh',
      1337,
      [
        {
          formControl: 'formlabel',
          label: 'muh',
          type: 'any' as any,
        } as Control,
      ],
      undefined
    );
    expect(nodataarr.data.length).toBeFalsy();
  });
});
