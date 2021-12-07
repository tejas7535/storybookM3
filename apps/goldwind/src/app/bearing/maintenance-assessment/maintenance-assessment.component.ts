import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import {
  setMaintenanceAssessmentDisplay,
  setMaintenanceAssessmentInterval,
} from '../../core/store';
import { MaintenanceAssessmentDisplay } from '../../core/store/reducers/maintenance-assessment/maintenance.assessment.model';
import { initialState } from '../../core/store/reducers/maintenance-assessment/maintenance-assessment.reducer';
import { Interval } from '../../core/store/reducers/shared/models';
import {
  getAnalysisGraphDataM,
  getMaintenanceAssessmentDisplay,
  getMaintenanceAssessmentInterval,
} from '../../core/store/selectors/maintenance-assessment/maintenance-assessment.selector';
import { AssessmentLinechartComponent } from '../../shared/chart/assessment-linechart/assessment-linechart.component';
import { IAssessmentLineChart } from '../../shared/chart/assessment-linechart/assessment-linechart.interface';
import { getFormGroupFromDisplay } from '../../shared/chart/assessment-linechart/get-formgroup-from-display';
import { MAINTENACE_ASSESSMENT_CONTROLS } from '../../shared/constants/maintenance-assessment-controls';
import { Control, SensorNode, Type } from '../../shared/models';
@Component({
  selector: 'goldwind-maintenance-assessment',
  templateUrl: './maintenance-assessment.component.html',
  styleUrls: ['./maintenance-assessment.component.css'],
})
export class MaintenanceAssessmentComponent
  implements OnInit, IAssessmentLineChart
{
  @ViewChild('maintenanceAssessmentChart')
  assessmentChart: AssessmentLinechartComponent;

  graphData$: Observable<EChartsOption>;
  interval$: Observable<Interval>;
  displayForm: FormGroup;
  loading$: Observable<boolean>;
  checkBoxes: Control[] = MAINTENACE_ASSESSMENT_CONTROLS;
  TREE_DATA: SensorNode[] = [
    {
      name: 'greaseMonitor',
      children: this.checkBoxes.filter(({ type }) => type === Type.grease),
      formControl: new FormControl(''),
      indeterminate: false,
    },
    {
      name: 'edmMonitor',
      children: this.checkBoxes.filter(({ type }) => type === Type.edm),
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
  displayNodes$: Observable<MaintenanceAssessmentDisplay>;
  /**
   * Store the pristine interval ranges
   */
  prisineInterval: { start: number; end: number } = {
    start: undefined,
    end: undefined,
  };
  /**
   *
   * @param store
   */
  constructor(private readonly store: Store) {
    this.displayForm = getFormGroupFromDisplay(initialState);
  }

  ngOnInit(): void {
    this.graphData$ = this.store.select(getAnalysisGraphDataM);
    this.interval$ = this.store.select(getMaintenanceAssessmentInterval);
    this.displayNodes$ = this.store.select(getMaintenanceAssessmentDisplay);
  }

  /**
   *
   * @param interval
   */
  setInterval(interval: Interval): void {
    this.store.dispatch(setMaintenanceAssessmentInterval({ interval }));
  }
  /**
   *
   * @param maintenanceAssessmentDisplay
   */
  dispatchDisplay(maintenanceAssessmentDisplay: any): void {
    this.store.dispatch(
      setMaintenanceAssessmentDisplay({
        maintenanceAssessmentDisplay,
      })
    );
  }

  /**
   * handle the current zoom selection and calculates the start and end range out of percentage selection
   * @param $event having start and end in percentage from the current interval
   */
  handleZoom($event: { start: number; end: number }) {
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
