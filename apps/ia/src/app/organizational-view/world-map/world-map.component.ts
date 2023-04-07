import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import * as echarts from 'echarts';

import worldJson from '../../../assets/world.json';
import { Color } from '../../shared/models/color.enum';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { ChartType } from '../models/chart-type.enum';
import { CountryDataAttrition } from './models/country-data-attrition.model';

@Component({
  selector: 'ia-world-map',
  templateUrl: './world-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorldMapComponent implements OnInit {
  private _data: CountryDataAttrition[];

  @Input() isLoading: boolean;

  @Input() selectedTimeRange = '';

  @Input() set data(countryData: CountryDataAttrition[]) {
    const selectedAreas = [];
    this._data = [...countryData];

    for (const data of this._data) {
      selectedAreas.push(this.createAreaDataObj(data.name, Color.LIME));
    }

    // update world map
    this.mergeOptions = {
      series: {
        data: selectedAreas,
      },
    };
  }

  get data(): CountryDataAttrition[] {
    return this._data;
  }

  @Input() regions: string[];

  @Output()
  readonly loadCountryMeta: EventEmitter<string> = new EventEmitter();

  @Output()
  readonly loadRegionMeta: EventEmitter<string> = new EventEmitter();

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

  openDialogWithRegionData(region: string): void {
    this.loadRegionMeta.emit(region);

    this.openDialog();
  }

  openDialogWithCountryData(name: string): void {
    this.loadCountryMeta.emit(name);

    this.openDialog();
  }

  openDialog(): void {
    this.dialog.open(AttritionDialogComponent, {
      data: ChartType.WORLD_MAP,
      width: '90%',
      maxWidth: '750px',
    });
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
