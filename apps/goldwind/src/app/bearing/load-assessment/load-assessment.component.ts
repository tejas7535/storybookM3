import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { getFormGroupFromDisplay } from '../../shared/chart/assessment-linechart/get-formgroup-from-display';
import { Observable, Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { IAssessmentLineChart } from '../../shared/chart/assessment-linechart/assessment-linechart.interface';
import {
  setLoadAssessmentDisplay,
  setLoadAssessmentInterval,
} from '../../core/store/actions/load-assessment/load-assessment.actions';
import { Interval } from '../../core/store/reducers/shared/models';
import { LOAD_ASSESSMENT_CONTROLS } from '../../shared/constants';
import { SensorNode, Type } from '../../shared/models';
import {
  getAnalysisGraphData,
  getLoadAssessmentDisplay,
  getLoadAssessmentInterval,
} from '../../core/store';
import { LoadAssessmentDisplay } from '../../core/store/reducers/load-assessment/models';
import { initialState } from '../../core/store/reducers/load-assessment/load-assessment.reducer';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'goldwind-load-assessment',
  templateUrl: './load-assessment.component.html',
  styleUrls: ['./load-assessment.component.scss'],
})
export class LoadAssessmentComponent
  implements OnInit, OnDestroy, IAssessmentLineChart
{
  checkBoxes = LOAD_ASSESSMENT_CONTROLS;

  readonly TREE_DATA: SensorNode[] = [
    {
      name: 'loadMonitor',
      children: this.checkBoxes.filter(
        ({ type }) => type === Type.load || type === Type.centerload
      ),
      formControl: new FormControl(''),
      indeterminate: false,
    },

    {
      name: 'rotorRotationSpeedMonitor',
      children: this.checkBoxes.filter(({ type }) => type === Type.rsm),
      formControl: new FormControl(''),
      indeterminate: false,
    },
  ];

  loading$: Observable<boolean>;

  displayForm: FormGroup;
  graphData$: Observable<EChartsOption>;
  interval$: Observable<Interval>;
  subscription: Subscription = new Subscription();
  displayNodes$: Observable<LoadAssessmentDisplay>;

  /* eslint-enable @typescript-eslint/member-ordering */

  public constructor(private readonly store: Store) {
    this.displayForm = getFormGroupFromDisplay(initialState);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.graphData$ = this.store.select(getAnalysisGraphData);
    this.interval$ = this.store.select(getLoadAssessmentInterval);
    this.displayNodes$ = this.store.select(getLoadAssessmentDisplay);
  }

  setInterval(interval: Interval): void {
    this.store.dispatch(setLoadAssessmentInterval({ interval }));
  }

  dispatchDisplay(loadAssessmentDisplay: any) {
    this.store.dispatch(setLoadAssessmentDisplay({ loadAssessmentDisplay }));
  }
}
