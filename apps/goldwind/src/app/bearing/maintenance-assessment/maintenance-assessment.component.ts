import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MAINTENACE_ASSESSMENT_CONTROLS } from '../../shared/constants/maintenance-assessment-controls';
import {
  setMaintenanceAssessmentInterval,
  setMaintenanceAssessmentDisplay,
} from '../../core/store';
import { Interval } from '../../core/store/reducers/shared/models';
import { AssessmentLinechartComponent } from '../../shared/chart/assessment-linechart/assessment-linechart.component';
import { IAssessmentLineChart } from '../../shared/chart/assessment-linechart/assessment-linechart.interface';
import { Control, SensorNode, Type } from '../../shared/models';
import {
  getAnalysisGraphDataM,
  getMaintenanceAssessmentDisplay,
  getMaintenanceAssessmentInterval,
} from '../../core/store/selectors/maintenance-assessment/maintenance-assessment.selector';
import { initialState } from '../../core/store/reducers/maintenance-assessment/maintenance-assessment.reducer';
import { getFormGroupFromDisplay } from '../../shared/chart/assessment-linechart/get-formgroup-from-display';
import { MaintenanceAssessmentDisplay } from '../../core/store/reducers/maintenance-assessment/maintenance.assessment.model';
import { EChartsOption } from 'echarts';
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
  ];
  displayNodes$: Observable<MaintenanceAssessmentDisplay>;

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
}
