import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import * as echarts from 'echarts';

import worldJson from '../../../assets/world.json';
import { IdValue } from '../../shared/models';
import { Color } from '../../shared/models/color.enum';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { AttritionDialogMeta } from '../attrition-dialog/models/attrition-dialog-meta.model';
import { HeatType } from '../models/heat-type.enum';
import { ContinentButton } from './models/continent-button.model';
import { CountryData } from './models/country-data.model';

@Component({
  selector: 'ia-world-map',
  templateUrl: './world-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorldMapComponent implements OnInit {
  private _data: CountryData[];

  @Input() isLoading: boolean;

  @Input() selectedTimeRange = '';

  @Input() set data(countryData: CountryData[]) {
    const selectedAreas = [];
    this._data = countryData;

    for (const data of countryData) {
      // find data in world map geo data
      const geoJsonData = (worldJson as any).features.find(
        (elem: any) => elem.properties.name === data.name
      );

      if (geoJsonData) {
        const areaColor = this.getAreaColorFromHeatType(
          data.attritionMeta.heatType
        );

        selectedAreas.push(
          this.createAreaDataObj(geoJsonData.properties.name, areaColor)
        );
      }
    }

    // update world map
    this.mergeOptions = {
      series: {
        data: selectedAreas,
      },
    };

    this.updateContinents();
  }

  get data(): CountryData[] {
    return this._data;
  }

  @Input() set continents(continents: IdValue[]) {
    // add enabled property
    this.continentButtons = continents.map((continent) => ({
      ...continent,
      enabled: false,
    }));

    this.updateContinents();
  }

  mergeOptions: any;
  options: any;
  echartsInstance: any;
  continentButtons: ContinentButton[] = [];

  constructor(private readonly dialog: MatDialog) {}

  ngOnInit(): void {
    echarts.registerMap('world', worldJson as any);

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
            areaColor: Color.GREY,
          },
          emphasis: {
            itemStyle: {
              areaColor: Color.GREY,
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

  onChartInit(ec: any): void {
    this.echartsInstance = ec;
    this.echartsInstance.on('mousemove', (params: any) => {
      this.echartsInstance.getZr().setCursorStyle('default');
      if (params.data !== undefined) {
        this.echartsInstance.getZr().setCursorStyle('pointer');
      }
    });
  }

  showCountryData(event: any): void {
    if (event.data !== undefined) {
      const country = event.data.name;

      this.openDialog(country);
    }
  }

  updateContinents(): void {
    // set enabled property according to provided countryData
    this.continentButtons = this.continentButtons.map((button) => ({
      ...button,
      enabled: this.data
        .map((elem: CountryData) => elem.name)
        .includes(button.value),
    }));
  }

  openDialog(name: string): void {
    const { attritionMeta } = this.data.find((elem) => elem.name === name);
    const data = new AttritionDialogMeta(attritionMeta, this.selectedTimeRange);

    this.dialog.open(AttritionDialogComponent, {
      data,
      width: '90%',
      maxWidth: '750px',
    });
  }

  getAreaColorFromHeatType(heatType: HeatType): string {
    switch (heatType) {
      case HeatType.GREEN_HEAT:
        return Color.LIME;
      case HeatType.ORANGE_HEAT:
        return Color.YELLOW;
      case HeatType.RED_HEAT:
        return Color.RED;
      default:
        return Color.GREY;
    }
  }

  createAreaDataObj(name: string, areaColor: string): any {
    return {
      name,
      value: 20,
      tooltip: {
        formatter: '{b}',
        extraCssText: 'opacity: 1',
      },
      select: {
        itemStyle: this.createAreaItemStyle(areaColor),
        label: {
          show: false,
        },
      },
      itemStyle: this.createAreaItemStyle(areaColor),
      label: {
        show: false,
      },
      emphasis: {
        itemStyle: this.createAreaItemStyle(areaColor),
        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
      },
    };
  }

  createAreaItemStyle(areaColor: string): any {
    return {
      areaColor,
      shadowColor: Color.SHADOW_GREY,
      shadowBlur: 2,
    };
  }

  trackByFn(index: number): number {
    return index;
  }
}
