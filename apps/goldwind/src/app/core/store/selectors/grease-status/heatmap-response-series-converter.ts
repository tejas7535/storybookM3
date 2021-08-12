import { HeatmapSeriesOption } from 'echarts';
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
    calendarIndex: 0, // TODO: has to be the correctt one according to the date
    data: [],
  };
  CALENDER_SPLIT_COUNT = 4;
  _data: GCMHeatmapEntry[];

  constructor(data: GCMHeatmapEntry[]) {
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
    }));
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
        ],
      });
    });
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
        `${this.year}-10-31`
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
      Date.parse(timestamp) > Date.parse(_from) &&
      Date.parse(timestamp) < Date.parse(_to)
    );
  }
}
