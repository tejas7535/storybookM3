// tslint:disable: no-default-import
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import worldJson from '../../../assets/world.json';
import { LoadingSpinnerModule } from '../../shared/loading-spinner/loading-spinner.module';
import { IdValue } from '../../shared/models';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { AttritionDialogModule } from '../attrition-dialog/attrition-dialog.module';
import { HeatType } from '../models/heat-type.enum';
import { CountryData } from './models/country-data.model';
import { WorldMapComponent } from './world-map.component';

jest.mock('echarts', () => ({
  ...jest.requireActual('@ngneat/transloco'),
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
        echarts: () => import('echarts'),
      }),
      LoadingSpinnerModule,
      provideTranslocoTestingModule({}),
      MatTooltipModule,
      AttritionDialogModule,
    ],
    providers: [],
    declarations: [WorldMapComponent],
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
        ({
          name: 'Germany',
          attritionMeta: {
            heatType: HeatType.GREEN_HEAT,
          },
        } as unknown) as CountryData,
        ({
          name: 'Poland',
          attritionMeta: {
            heatType: HeatType.ORANGE_HEAT,
          },
        } as unknown) as CountryData,
        ({
          name: 'Switzerland',
          attritionMeta: {
            heatType: HeatType.RED_HEAT,
          },
        } as unknown) as CountryData,
        ({
          name: 'Austria',
          attritionMeta: {
            heatType: HeatType.NONE,
          },
        } as unknown) as CountryData,
      ];

      component.data = data;

      expect(component.mergeOptions.series.data.length).toEqual(data.length);
    });
  });

  describe('set continents', () => {
    test('should update continent buttons and call update', () => {
      component.updateContinents = jest.fn();

      const values = [new IdValue('europe', 'Europe')];

      component.continents = values;

      expect(component.updateContinents).toHaveBeenCalled();
      expect(component.continentButtons[0]).toEqual({
        ...values[0],
        enabled: false,
      });
    });
  });
  describe('ngOnInit', () => {
    test('should register map and set options', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(echarts.registerMap).toHaveBeenCalledWith('world', worldJson);
      expect(component.initOpts.height).toEqual(970);
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
      component.openDialog = jest.fn();

      component.showCountryData({});

      expect(component.openDialog).not.toHaveBeenCalled();
    });

    test('should open dialog when data defined', () => {
      component.openDialog = jest.fn();
      const evt = {
        data: {
          name: 'Canada',
        },
      };

      component.showCountryData(evt);

      expect(component.openDialog).toHaveBeenCalledWith(evt.data.name);
    });
  });

  describe('updateContinents', () => {
    test('should enable buttons if provided data contains data for related continent', () => {
      component.continentButtons = [
        {
          id: 'europe',
          value: 'Europe',
          enabled: false,
        },
        {
          id: 'asia',
          value: 'Asia',
          enabled: false,
        },
      ];

      component.data = [
        ({
          name: 'Europe',
        } as unknown) as CountryData,
      ];

      component.updateContinents();

      expect(component.continentButtons[0].enabled).toBeTruthy();
      expect(component.continentButtons[1].enabled).toBeFalsy();
    });
  });

  describe('openDialog', () => {
    test('should open dialog with provided data', () => {
      const elem = ({
        name: 'Switzerland',
        attritionMeta: {},
      } as unknown) as CountryData;

      component.data = [elem];
      component['dialog'].open = jest.fn();

      component.openDialog('Switzerland');

      expect(component['dialog'].open).toHaveBeenCalledWith(
        AttritionDialogComponent,
        {
          data: elem.attritionMeta,
        }
      );
    });
  });
  describe('trackByFn', () => {
    it('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
