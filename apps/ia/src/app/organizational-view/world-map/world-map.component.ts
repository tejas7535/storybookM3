import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import * as echarts from 'echarts';

import worldJson from '../../../assets/world.json';
import { EmployeeAttritionMeta, HeatType } from '../../shared/models';
import { Color } from '../../shared/models/color.enum';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { AttritionDialogMeta } from '../attrition-dialog/models/attrition-dialog-meta.model';
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
    this._data = [...countryData];

    for (const data of this._data) {
      const areaColor = this.getAreaColorFromHeatType(
        data.attritionMeta.heatType
      );

      selectedAreas.push(this.createAreaDataObj(data.name, areaColor));
    }

    // update world map
    this.mergeOptions = {
      series: {
        data: selectedAreas,
      },
    };
  }

  get data(): CountryData[] {
    return this._data;
  }

  @Input() continents: string[];

  mergeOptions: any;
  options: any;
  echartsInstance: any;

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

      this.openDialogWithCountryData(country);
    }
  }

  /** FIXME: remove this by an appropriate backend calculation as soon as area tables are available */
  openDialogWithContinentData(continent: string): void {
    const relevantCountries = this.data.filter(
      (countryData) => countryData.continent === continent
    );
    let employeesLost = 0;
    let naturalTurnover = 0;
    let forcedLeavers = 0;
    let unforcedLeavers = 0;
    let terminationReceived = 0;
    let employeesAdded = 0;
    let openPositions = 0;
    let avgAttritionRate = 0;
    let unforcedAvgAttritionRate = 0;

    relevantCountries.forEach((country) => {
      employeesLost += country.attritionMeta.employeesLost;
      naturalTurnover += country.attritionMeta.naturalTurnover;
      forcedLeavers += country.attritionMeta.forcedLeavers;
      unforcedLeavers += country.attritionMeta.unforcedLeavers;
      terminationReceived += country.attritionMeta.terminationReceived;
      employeesAdded += country.attritionMeta.employeesAdded;
      openPositions += country.attritionMeta.openPositions;
      avgAttritionRate += country.attritionMeta.attritionRate;
      unforcedAvgAttritionRate += country.attritionMeta.unforcedAttritionRate;
    });

    // as we do not have the total employees in the frontend we just calculate the average
    const attritionRate = +(
      avgAttritionRate / relevantCountries.length
    ).toFixed(2);
    const unforcedAttritionRate = +(
      unforcedAvgAttritionRate / relevantCountries.length
    ).toFixed(2);

    const attritionMeta = new EmployeeAttritionMeta(
      continent,
      attritionRate,
      unforcedAttritionRate,
      employeesLost,
      naturalTurnover,
      forcedLeavers,
      unforcedLeavers,
      terminationReceived,
      employeesAdded,
      openPositions
    );

    this.openDialog(attritionMeta);
  }

  openDialogWithCountryData(name: string): void {
    const meta = this.data.find((elem) => elem.name === name);

    this.openDialog(meta?.attritionMeta);
  }

  openDialog(attritionMeta: EmployeeAttritionMeta): void {
    const data = new AttritionDialogMeta(
      attritionMeta,
      this.selectedTimeRange,
      false
    );

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
