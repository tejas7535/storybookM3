// tslint:disable: no-default-import
import { Component, Input, OnInit } from '@angular/core';

import * as echarts from 'echarts';

import worldJson from '../../../assets/world.json';
import { IdValue } from '../../shared/models';
import { HeatType } from '../models/heat-type.enum';
import { ContinentButton } from './models/continent-button.model';
import { CountryData } from './models/country-data.model';

@Component({
  selector: 'ia-world-map',
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss'],
})
export class WorldMapComponent implements OnInit {
  private _data: CountryData[];

  @Input() isLoading: boolean;

  @Input() set data(countryData: CountryData[]) {
    const selectedAreas = [];
    this._data = countryData;

    for (const data of countryData) {
      const geoJsonData = (worldJson as any).features.find(
        (elem: any) => elem.properties.geounit === data.name
      );

      if (geoJsonData) {
        const areayColor =
          data.attritionMeta.heatType === HeatType.GREEN_HEAT
            ? '#00893d' // $schaeffler-green-1
            : data.attritionMeta.heatType === HeatType.ORANGE_HEAT
            ? '#fccf46' // $schaeffler-yellow
            : data.attritionMeta.heatType === HeatType.RED_HEAT
            ? '#e62c27' // $schaeffler-red
            : '#ebeef0'; // schaeffler-grey-2

        selectedAreas.push({
          name: geoJsonData.properties.name,
          value: 20,
          selected: true,
          tooltip: {
            formatter: '{b}',
            extraCssText: 'opacity: 1',
          },
          emphasis: {
            itemStyle: {
              areaColor: areayColor,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 2,
            },
            label: {
              show: false,
            },
          },
        });
      }
    }

    this.mergeOptions = {
      series: {
        data: selectedAreas,
      },
    };

    this.updateContinents();
  }

  @Input() set continents(continents: IdValue[]) {
    // add enabled property
    this.continentButtons = continents.map((continent) => ({
      ...continent,
      enabled: false,
    }));

    this.updateContinents();
  }

  get data(): CountryData[] {
    return this._data;
  }

  mergeOptions: any;
  options: any;
  initOpts: any;
  echartsInstance: any;
  continentButtons: ContinentButton[] = [];

  public ngOnInit(): void {
    echarts.registerMap('world', worldJson);
    this.initOpts = {
      height: 970,
    };

    // https://github.com/apache/incubator-echarts/issues/5006
    this.options = {
      backgroundColor: 'white',
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          type: 'map',
          map: 'world',
          mapType: 'world',
          roam: true,
          itemStyle: {
            areaColor: '#ebeef0', // schaeffler-grey-2
          },
          emphasis: {
            itemStyle: {
              areaColor: '#ebeef0', // schaeffler-grey-2
            },
            label: {
              show: false,
            },
          },
          tooltip: {
            formatter: '{b}',
            extraCssText: 'opacity: 0',
          },
        },
      ],
    };
  }

  public onChartInit(ec: any): void {
    this.echartsInstance = ec;
    this.echartsInstance.on('click', (params: any) => {
      if (params.data !== undefined) {
        console.log('Open Dialog with attrition Info', params.data);
      }
    });

    this.echartsInstance.on('mousemove', (params: any) => {
      this.echartsInstance.getZr().setCursorStyle('default');
      if (params.data !== undefined) {
        this.echartsInstance.getZr().setCursorStyle('pointer');
      }
    });
  }

  public updateContinents(): void {
    // set enabled property according to provided countryData

    this.continentButtons.forEach((button) => {
      button.enabled = this.data
        .map((elem: CountryData) => elem.name)
        .includes(button.value);
    });
  }

  public showContinentData(continent: string): void {
    const attritionMeta = this.data.find((elem) => elem.name === continent);

    console.log(attritionMeta);
  }

  public trackByFn(index: number): number {
    return index;
  }
}
