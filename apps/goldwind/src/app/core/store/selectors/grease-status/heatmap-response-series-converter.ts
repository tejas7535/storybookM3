import { format } from 'date-fns';
import { HeatmapSeriesOption } from 'echarts';

import { GaugeColors } from '../../../../shared/chart/chart';
import {
  GCMHeatmapClassification,
  GCMHeatmapEntry,
} from '../../../../shared/models';
export class HeatmapResponseConvert {
  series: HeatmapSeriesOption[] = Array.from({ length: 4 });
  levelMap = {
    [GCMHeatmapClassification.ERROR]: 3,
    [GCMHeatmapClassification.WARNING]: 1,
    [GCMHeatmapClassification.OKAY]: 2,
  };

  private readonly baseconfig: HeatmapSeriesOption = {
    type: 'heatmap',
    coordinateSystem: 'calendar',
    calendarIndex: 0,
    data: [],
  };
  CALENDER_SPLIT_COUNT = 4;
  _data: GCMHeatmapEntry[];

  constructor(data: GCMHeatmapEntry[]) {
    if (!data) {
      this.series = [];

      return;
    }
    this._data = data;
    this.prepare();
    this.execute();
  }
  /**
   * replace each fill item in the series array with a default config
   * hint: to split up the calendar in more or less sections you
   * just need to adjust the length of the array
   */
  prepare() {
    this.series = this.series.map((_, i) => ({
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: [],
      calendarIndex: i,
      tooltip: {
        borderWidth: 0,
        formatter: (a: any) => this.getTooltipFormaterHTML(a),
      },
    }));
  }
  /**
   * Converts a Entity object to a html string contains all classification badges
   * @param a a object from the echarts tooltip formatter
   * @returns
   */
  private getTooltipFormaterHTML(a: any) {
    const item: GCMHeatmapEntry = JSON.parse(a.data.value[3]);

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const getBadge = (classification: GCMHeatmapClassification) => `
            <div class="flex text-white h-5 w-max rounded p-1 text-center items-center" style="background: ${this.getClassificationColor(
              classification
            )}">${classification}</div>
          `;

    return `
          <div class="flex flex-col space-y-1 h-12 w-96">
          <div class="grid grid-cols-3 text-sm">
            <div></div>
            <div>GCM1</div>
            <div>GCM2</div>
          </div>
          <div class="grid grid-cols-3 gap-1">
            <span>Temperature:</span>
            ${getBadge(item.gcm01TemperatureOpticsMaxClassification)}
            ${getBadge(item.gcm02TemperatureOpticsMaxClassification)}
            </div>
            </div>
            <div class="grid grid-cols-3 gap-1">
            <span>Watercontent:</span>
            ${getBadge(item.gcm01WaterContentMaxClassification)}
            ${getBadge(item.gcm02WaterContentMaxClassification)}
            </div>
          </div>
          <div class="grid grid-cols-3 gap-1">
            <span>Deterioration:</span>
            ${getBadge(item.gcm01DeteriorationMaxClassification)}
            ${getBadge(item.gcm02DeteriorationMaxClassification)}
            </div>
          </div>
            </div>
            <div class="grid grid-cols-3">
            <div> Time:</div><div class="col-span-2"> ${this.formatDate(
              item.timestamp
            )} </div>
            </div>

          </div>

          `;
  }

  /**
   * will iterate through every data entry,
   * find the the correct calendar index and
   * push the timestamp + warn level into the respected array object
   */
  execute() {
    this._data.forEach((e) => {
      const i = this.getIndex(e);

      this.series[i].data.push({
        value: [
          e.timestamp,
          this.getHighestLevel(e),
          this.getHighestLevelEnum(e),
          JSON.stringify(e),
        ],
      });
    });
  }
  /**
   * formates date to "YYYY-MM-DD"
   * @param date
   * @returns
   */
  private formatDate(date: string): string {
    return format(new Date(date), 'yyyy-MM-dd');
  }
  /**
   * Get the hightest Level in numberic form of all classifications of one entry
   * @param e entity of GCMHeatmapEntry
   */
  private getHighestLevel(e: GCMHeatmapEntry) {
    const classprops: Set<GCMHeatmapClassification> = new Set(
      Object.keys(e)
        .filter((key) => key.includes('Classification'))
        .map((key: string) => e[key as keyof GCMHeatmapEntry] as any)
    );

    if (classprops.has(GCMHeatmapClassification.ERROR)) {
      return 3;
    }
    if (classprops.has(GCMHeatmapClassification.WARNING)) {
      return 2;
    }

    return 1; // is equal to classprops.has(GCMHeatmapClassification.OKAY)
  }
  private getHighestLevelEnum(e: GCMHeatmapEntry) {
    // Get every property with Classification to be extendable
    const classprops: Set<GCMHeatmapClassification> = new Set(
      Object.keys(e)
        .filter((key) => key.includes('Classification'))
        .map((key: string) => e[key as keyof GCMHeatmapEntry] as any)
    );

    // eslint-disable-next-line unicorn/no-array-reduce
    if (classprops.has(GCMHeatmapClassification.ERROR)) {
      return GCMHeatmapClassification.ERROR;
    }
    if (classprops.has(GCMHeatmapClassification.WARNING)) {
      return GCMHeatmapClassification.WARNING;
    }

    return GCMHeatmapClassification.OKAY; // is equal to classprops.has(GCMHeatmapClassification.OKAY)
  }
  /**
   * Get the index for a 4 parted calender view
   * @param e
   * @returns
   */
  private getIndex(e: GCMHeatmapEntry) {
    switch (true) {
      case this.isBetween(
        e.timestamp,
        `${this.year}-01-01`,
        `${this.year}-03-31`
      ):
        return 0;
      case this.isBetween(
        e.timestamp,
        `${this.year}-04-01`,
        `${this.year}-06-30`
      ):
        return 1;
      case this.isBetween(
        e.timestamp,
        `${this.year}-07-01`,
        `${this.year}-09-31`
      ):
        return 2;
      case this.isBetween(
        e.timestamp,
        `${this.year}-10-01`,
        `${this.year}-12-31`
      ):
        return 3;
      default:
        return 0;
    }
  }
  /*
   * Returns this current year
   */
  get year() {
    return new Date().getFullYear();
  }
  /**
   * Checks if a date (timestamp) is between the _from and _to dates
   * @param timestamp a date string of the entity in a Date parsable format
   * @param _from a start date string in a Date parsable format
   * @param _to a end date string in a Date parsable format
   * @returns a boolean if oder wheater not the date is between _from and _to
   */
  isBetween(timestamp: string, _from: string, _to: string): boolean {
    return (
      Date.parse(timestamp) >= Date.parse(_from) &&
      Date.parse(timestamp) <= Date.parse(_to)
    );
  }
  getClassificationColor(
    gcm01DeteriorationClassification: GCMHeatmapClassification
  ) {
    switch (gcm01DeteriorationClassification) {
      case GCMHeatmapClassification.ERROR:
        return GaugeColors.RED;
      case GCMHeatmapClassification.WARNING:
        return GaugeColors.YELLOW;
      case GCMHeatmapClassification.OKAY:
        return GaugeColors.GREEN;
      default:
        return GaugeColors.GREY;
    }
  }
}
