import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { HeatType } from '../../shared/models';
import { Color } from '../../shared/models/color.enum';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { ChartType } from '../models';
import { CountryDataAttrition } from './models/country-data-attrition.model';
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
        } as unknown as CountryDataAttrition,
        {
          name: 'Poland',
          attritionMeta: {
            heatType: HeatType.ORANGE_HEAT,
          },
        } as unknown as CountryDataAttrition,
        {
          name: 'Switzerland',
          attritionMeta: {
            heatType: HeatType.RED_HEAT,
          },
        } as unknown as CountryDataAttrition,
        {
          name: 'Austria',
          attritionMeta: {
            heatType: HeatType.NONE,
          },
        } as unknown as CountryDataAttrition,
      ];

      component.createAreaDataObj = jest.fn();

      component.data = data;

      expect(component.mergeOptions.series.data.length).toEqual(data.length);
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
    test('should emit country and open dialog', () => {
      component.openDialog = jest.fn();
      component.loadCountryMeta.emit = jest.fn();

      component.openDialogWithCountryData('Italy');

      expect(component.openDialog).toHaveBeenCalledTimes(1);
      expect(component.loadCountryMeta.emit).toHaveBeenCalledWith('Italy');
    });
  });

  describe('openDialogWithRegionData', () => {
    test('should emit continent and open dialog', () => {
      component.openDialog = jest.fn();
      component.loadRegionMeta.emit = jest.fn();

      component.openDialogWithRegionData('Europe');

      expect(component.openDialog).toHaveBeenCalledTimes(1);
      expect(component.loadRegionMeta.emit).toHaveBeenCalledWith('Europe');
    });
  });

  describe('openDialog', () => {
    test('should open dialog', () => {
      component['dialog'].open = jest.fn();

      component.openDialog();

      expect(component['dialog'].open).toHaveBeenCalledWith(
        AttritionDialogComponent,
        {
          data: ChartType.WORLD_MAP,
          maxWidth: '750px',
          width: '90%',
        }
      );
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
