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
import { HeatType } from '../../shared/models';
import { Color } from '../../shared/models/color';
import { AttritionDialogComponent } from '../attrition-dialog/attrition-dialog.component';
import { AttritionDialogMeta } from '../attrition-dialog/models/attrition-dialog-meta.model';
import { ChartType } from '../models';
import { CountryDataAttrition } from './models/country-data-attrition.model';

@Component({
  selector: 'ia-world-map',
  templateUrl: './world-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class WorldMapComponent implements OnInit {
  readonly INITIAL_ZOOM = 1;
  readonly ZOOM_STEP = 5;
  readonly MIN_ZOOM = 0;
  readonly MAX_ZOOM = 20;

  @Output()
  readonly loadCountryMeta: EventEmitter<string> = new EventEmitter();

  @Output()
  readonly loadRegionMeta: EventEmitter<string> = new EventEmitter();

  @Input() isLoading: boolean;

  @Input() selectedTimeRange = '';

  @Input() regions: string[];

  mergeOptions: any;
  options: any;
  echartsInstance: any;

  private _data: CountryDataAttrition[];

  get data(): CountryDataAttrition[] {
    return this._data;
  }

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
          zoom: this.INITIAL_ZOOM,
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
    const data = this.data.filter((country) => country.region === region);
    const meta: AttritionDialogMeta = {
      data: {
        title: region,
        employeesLost: data.reduce(
          (acc, curr) => acc + curr.attritionMeta.employeesLost,
          0
        ),
        remainingFluctuation: data.reduce(
          (acc, curr) => acc + curr.attritionMeta.remainingFluctuation,
          0
        ),
        forcedFluctuation: data.reduce(
          (acc, curr) => acc + curr.attritionMeta.forcedFluctuation,
          0
        ),
        unforcedFluctuation: data.reduce(
          (acc, curr) => acc + curr.attritionMeta.unforcedFluctuation,
          0
        ),
        resignationsReceived: data.reduce(
          (acc, curr) => acc + curr.attritionMeta.resignationsReceived,
          0
        ),
        employeesAdded: data.reduce(
          (acc, curr) => acc + curr.attritionMeta.employeesAdded,
          0
        ),
        openPositions: data.reduce(
          (acc, curr) => acc + curr.attritionMeta.openPositions,
          0
        ),
        openPositionsAvailable: true,
        hideDetailedLeaverStats: data.some(
          (country) => country.attritionMeta.responseModified
        ),
        heatType: HeatType.NONE,
      },
      selectedTimeRange: this.selectedTimeRange,
      showAttritionRates: false,
    };

    this.openDialog({ type: ChartType.WORLD_MAP, meta } as any);
  }

  openDialogWithCountryData(name: string): void {
    this.loadCountryMeta.emit(name);
    const data = this.data.find((country) => country.name === name);

    const meta: { type: ChartType; meta: AttritionDialogMeta } = {
      type: ChartType.WORLD_MAP,
      meta: {
        data: {
          title: name,
          employeesLost: data.attritionMeta.employeesLost,
          remainingFluctuation: data.attritionMeta.remainingFluctuation,
          forcedFluctuation: data.attritionMeta.forcedFluctuation,
          unforcedFluctuation: data.attritionMeta.unforcedFluctuation,
          resignationsReceived: data.attritionMeta.resignationsReceived,
          employeesAdded: data.attritionMeta.employeesAdded,
          openPositions: data.attritionMeta.openPositions,
          openPositionsAvailable: true,
          hideDetailedLeaverStats: data.attritionMeta.responseModified,
          heatType: HeatType.NONE,
        },
        selectedTimeRange: this.selectedTimeRange,
        showAttritionRates: false,
      },
    };
    this.openDialog(meta);
  }

  openDialog(data: { type: ChartType; meta: AttritionDialogMeta }): void {
    this.dialog.open(AttritionDialogComponent, {
      data: { ...data, type: ChartType.WORLD_MAP },
      width: '50%',
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

  zoomIn(): void {
    const selectedZoomValue =
      this.echartsInstance.getOption().series[0].zoom + 1;
    if (selectedZoomValue <= this.MAX_ZOOM) {
      this.echartsInstance.setOption({
        series: [
          {
            zoom:
              this.echartsInstance.getOption().series[0].zoom + this.ZOOM_STEP,
          },
        ],
      });
    }
  }

  zoomOut(): void {
    const selectedZoomValue =
      this.echartsInstance.getOption().series[0].zoom - this.ZOOM_STEP;
    if (selectedZoomValue >= this.MIN_ZOOM) {
      this.echartsInstance.setOption({
        series: [
          {
            zoom: selectedZoomValue,
          },
        ],
      });
    }
  }

  zoomToFit(): void {
    this.echartsInstance.setOption({
      series: [
        {
          zoom: this.INITIAL_ZOOM,
          center: [0, 0],
        },
      ],
    });
  }
}
