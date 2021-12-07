import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { EChartsOption } from 'echarts';

import { Interval } from '../../../core/store/reducers/shared/models';
import { Control, SensorNode } from '../../models';

export interface IAssessmentLineChart {
  setInterval(interval: Interval): void;
  dispatchDisplay(loadAssessmentDisplay: any): void;
  graphData$: Observable<EChartsOption>;
  interval$: Observable<Interval>;
  displayForm: FormGroup;
  loading$: Observable<boolean>;
  checkBoxes: Control[];
  readonly TREE_DATA: SensorNode[];
}
