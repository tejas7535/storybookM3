import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { AssessmentLinechartComponent } from '../../shared/chart/assessment-linechart/assessment-linechart.component';

@Component({
  selector: 'goldwind-load-assessment',
  templateUrl: './load-assessment.component.html',
  styleUrls: ['./load-assessment.component.scss'],
})
export class LoadAssessmentComponent
  implements OnInit, OnDestroy, IAssessmentLineChart
{
  @ViewChild('loadAssessmentChart')
  loadAssessmentChart: AssessmentLinechartComponent;
  /**
   * Checkboxes to render
   */
  checkBoxes = LOAD_ASSESSMENT_CONTROLS;
  /**
   * The Nodes filter from the checkbox config
   */
  readonly TREE_DATA: SensorNode[] = [
    {
      name: 'loadMonitor',
      children: this.checkBoxes.filter(
        ({ type }) => type === Type.load || type === Type.centerload
      ),
      formControl: new FormControl(''),
      indeterminate: false,
    },
  ];
  /**
   * loading indicator
   */
  loading$: Observable<boolean>;
  /**
   * the form to display
   */
  displayForm: FormGroup;
  /**
   * The converted ready to merge echarts option for the chart
   */
  graphData$: Observable<EChartsOption>;
  /**
   * The interval data from the store
   */
  interval$: Observable<Interval>;
  /**
   * Hold the subscription to handle interval events and saves prisitine ranges
   */
  intervalSub: Subscription = new Subscription();
  /**
   * An Observable which sends information about the froms to display
   */
  displayNodes$: Observable<LoadAssessmentDisplay>;
  /**
   * Store the pristine interval ranges
   */
  prisineInterval: { start: number; end: number } = {
    start: undefined,
    end: undefined,
  };

  public constructor(private readonly store: Store) {
    this.displayForm = getFormGroupFromDisplay(initialState);
  }
  /**
   * For unsubscribe from observales
   */
  ngOnDestroy(): void {
    this.intervalSub.unsubscribe();
  }
  /**
   * Initialize the componente with data from store
   */
  ngOnInit(): void {
    this.graphData$ = this.store.select(getAnalysisGraphData);
    this.interval$ = this.store.select(getLoadAssessmentInterval);
    this.displayNodes$ = this.store.select(getLoadAssessmentDisplay);

    // Need to distinguish between interval event from date picker and from zoom slider to store the prisitine date
    this.intervalSub = this.interval$.subscribe((interval) => {
      if (!interval.zoom) {
        this.loadAssessmentChart?.resetZoom();
        this.prisineInterval.start = interval.startDate;
        this.prisineInterval.end = interval.endDate;
      }
    });
  }
  /**
   * dispatches an interval event to update the chart via effect with the new interval data
   * @param interval
   */
  setInterval(interval: Interval): void {
    this.store.dispatch(setLoadAssessmentInterval({ interval }));
  }
  /**
   * Dispatches an event with forms to display
   * @param loadAssessmentDisplay
   */
  dispatchDisplay(loadAssessmentDisplay: any) {
    this.store.dispatch(setLoadAssessmentDisplay({ loadAssessmentDisplay }));
  }

  /**
   * handle the current zoom selection and calculates the start and end range out of percentage selection
   * @param $event having start and end in percentage from the current interval
   */
  handleZoom($event: { start: number; end: number }) {
    //    should be the start of the wanted data array = percent of begin in zoom * difference of the end and start origin range * 1000 (unix timestamp)
    const diffEpoch = this.prisineInterval.end - this.prisineInterval.start;

    const startCalculated = Math.round(
      this.prisineInterval.start + (diffEpoch / 100) * $event.start
    );
    const endCalculated = Math.round(
      this.prisineInterval.start + (diffEpoch / 100) * $event.end
    );

    this.setInterval({
      startDate:
        $event.start > 0 ? startCalculated : this.prisineInterval.start,
      endDate: $event.end < 100 ? endCalculated : this.prisineInterval.end,
      pristineStart: this.prisineInterval.start,
      pristineEnd: this.prisineInterval.end,
      zoom: true,
    });
  }
}
