import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { HeatType } from '../../shared/models';
import { Color } from '../../shared/models/color.enum';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { CountryData } from './models/country-data.model';
import { WorldMapComponent } from './world-map.component';

jest.mock('echarts', () => ({
  registerMap: jest.fn(),
}));

describe('WorldMapComponent', () => {
  let component: WorldMapComponent;
  let spectator: Spectator<WorldMapComponent>;

  const createComponent = createComponentFactory({
    component: WorldMapComponent,
    detectChanges: false,
    imports: [
      NgxEchartsModule.forRoot({
        echarts: async () => import('echarts'),
      }),
      LoadingSpinnerModule,
      MatTooltipModule,
      MatDialogModule,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set data', () => {
    test('should merge new options with incoming data', () => {
      const data = [
        {
          name: 'Germany',
          attritionMeta: {
            heatType: HeatType.GREEN_HEAT,
          },
        } as unknown as CountryData,
        {
          name: 'Poland',
          attritionMeta: {
            heatType: HeatType.ORANGE_HEAT,
          },
        } as unknown as CountryData,
        {
          name: 'Switzerland',
          attritionMeta: {
            heatType: HeatType.RED_HEAT,
          },
        } as unknown as CountryData,
        {
          name: 'Austria',
          attritionMeta: {
            heatType: HeatType.NONE,
          },
        } as unknown as CountryData,
      ];

      component.getAreaColorFromHeatType = jest.fn();
      component.createAreaDataObj = jest.fn();

      component.data = data;

      expect(component.mergeOptions.series.data.length).toEqual(data.length);
      expect(component.getAreaColorFromHeatType).toHaveBeenCalledTimes(
        data.length
      );
      expect(component.createAreaDataObj).toHaveBeenCalledTimes(data.length);
    });
  });

  describe('ngOnInit', () => {
    test('should register map and set options', () => {
      component.ngOnInit();

      expect(component.options.series.length).toEqual(1);
    });
  });

  describe('onChartInit', () => {
    test('should register instance and listeners', () => {
      const mock = {
        on: jest.fn(),
      };

      component.onChartInit(mock);

      expect(component.echartsInstance).toEqual(mock);
      expect(mock.on).toHaveBeenCalledTimes(1);
    });
  });

  describe('showCountryData', () => {
    test('should do nothing when data undefined', () => {
      component.openDialogWithCountryData = jest.fn();

      component.showCountryData({});

      expect(component.openDialogWithCountryData).not.toHaveBeenCalled();
    });

    test('should open dialog when data defined', () => {
      component.openDialogWithCountryData = jest.fn();
      const evt = {
        data: {
          name: 'Canada',
        },
      };

      component.showCountryData(evt);

      expect(component.openDialogWithCountryData).toHaveBeenCalledWith(
        evt.data.name
      );
    });
  });

  describe('openDialogWithCountryData', () => {
    test('should open dialog with attrition meta', () => {
      component.openDialog = jest.fn();
      const data = [
        {
          name: 'Italy',
          attritionMeta: {},
        } as CountryData,
      ];

      component.data = data;

      component.openDialogWithCountryData('Italy');

      expect(component.openDialog).toHaveBeenCalledWith(data[0].attritionMeta);
    });

    test('should call open dialog with unedefined if country not found', () => {
      component.openDialog = jest.fn();
      const data = [
        {
          name: 'Italy',
          attritionMeta: {},
        } as CountryData,
      ];

      component.data = data;

      component.openDialogWithCountryData('Norway');

      expect(component.openDialog).toHaveBeenCalledWith(undefined);
    });
  });

  describe('openDialog', () => {
    test('should open dialog with provided country data', () => {
      const elem = {
        name: 'Switzerland',
        attritionMeta: {},
      } as unknown as CountryData;

      component['dialog'].open = jest.fn();

      component.openDialog(elem.attritionMeta);

      expect(component['dialog'].open).toHaveBeenCalledWith(
        AttritionDialogComponent,
        {
          data: {
            data: elem.attritionMeta,
            selectedTimeRange: '',
            showAttritionRates: false,
          },
          maxWidth: '750px',
          width: '90%',
        }
      );
    });
  });

  describe('getAreaColorFromHeatType', () => {
    test('should return green for green heat', () => {
      expect(component.getAreaColorFromHeatType(HeatType.GREEN_HEAT)).toEqual(
        Color.LIME
      );
    });
    test('should return yellow for orange heat', () => {
      expect(component.getAreaColorFromHeatType(HeatType.ORANGE_HEAT)).toEqual(
        Color.YELLOW
      );
    });
    test('should return red for red heat', () => {
      expect(component.getAreaColorFromHeatType(HeatType.RED_HEAT)).toEqual(
        Color.RED
      );
    });
    test('should return gray on default', () => {
      expect(
        component.getAreaColorFromHeatType('test' as unknown as HeatType)
      ).toEqual(Color.GREY);
    });
  });

  describe('createAreaDataObj', () => {
    test('should return data obj', () => {
      const name = 'Uganda';
      const areaColor = Color.RED;

      component.createAreaItemStyle = jest.fn();

      const result = component.createAreaDataObj(name, areaColor);

      expect(result.value).toEqual(20);
      expect(component.createAreaItemStyle).toHaveBeenCalledTimes(3);
    });
  });

  describe('createAreaItemStyle', () => {
    test('should return area item style', () => {
      const areaColor = Color.WHITE;
      const result = component.createAreaItemStyle(areaColor);

      expect(result).toEqual({
        areaColor,
        shadowColor: Color.SHADOW_GREY,
        shadowBlur: 2,
      });
    });
  });

  describe('trackByFn', () => {
    it('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
