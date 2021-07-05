import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatTree,
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';

import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import {
  setLoadAssessmentDisplay,
  setLoadAssessmentInterval,
} from '../../core/store/actions/load-assessment/load-assessment.actions';
import { LoadAssessmentDisplay } from '../../core/store/reducers/load-assessment/models';
import { GraphData, Interval } from '../../core/store/reducers/shared/models';
import {
  getAnalysisGraphData,
  getLoadAssessmentDisplay,
  getLoadAssessmentInterval,
} from '../../core/store/selectors';
import { axisChartOptions } from '../../shared/chart/chart';
import { DATE_FORMAT, LOAD_ASSESSMENT_CONTROLS } from '../../shared/constants';
import { Control, Type } from '../../shared/models';

interface SensorNode {
  name?: string;
  children?: Control[];
  formControl?: any;
  indeterminate?: boolean;
}

const TREE_DATA: SensorNode[] = [
  {
    name: 'greaseMonitor',
    children: LOAD_ASSESSMENT_CONTROLS.filter(
      (control) => control.type === Type.grease
    ),
    formControl: new FormControl(''),
    indeterminate: false,
  },
  {
    name: 'loadMonitor',
    children: LOAD_ASSESSMENT_CONTROLS.filter(
      (control) => control.type === Type.load
    ),
    formControl: new FormControl(''),
    indeterminate: false,
  },
  // {
  //   name: 'edmMonitor',
  //   children: LOAD_ASSESSMENT_CONTROLS.filter((control) => control.type === Type.edm),
  //   formControl: new FormControl(''),
  //   indeterminate: false,
  // },
  {
    name: 'rotorRotationSpeedMonitor',
    children: LOAD_ASSESSMENT_CONTROLS.filter(
      (control) => control.type === Type.rsm
    ),
    formControl: new FormControl(''),
    indeterminate: false,
  },
];
/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'goldwind-load-assessment',
  templateUrl: './load-assessment.component.html',
  styleUrls: ['./load-assessment.component.scss'],
})
export class LoadAssessmentComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('tree') tree: MatTree<any>;

  greaseStatusGraphData$: Observable<GraphData>;
  interval$: Observable<Interval>;
  loading$: Observable<boolean>;
  checkBoxes = LOAD_ASSESSMENT_CONTROLS;

  displayForm = new FormGroup({
    waterContent_1: new FormControl(''),
    deterioration_1: new FormControl(''),
    temperatureOptics_1: new FormControl(''),
    waterContent_2: new FormControl(''),
    deterioration_2: new FormControl(''),
    temperatureOptics_2: new FormControl(''),
    rsmShaftSpeed: new FormControl(''),
    // centerLoad: new FormControl(''),
    lsp01Strain: new FormControl(''),
    lsp02Strain: new FormControl(''),
    lsp03Strain: new FormControl(''),
    lsp04Strain: new FormControl(''),
    lsp05Strain: new FormControl(''),
    lsp06Strain: new FormControl(''),
    lsp07Strain: new FormControl(''),
    lsp08Strain: new FormControl(''),
    lsp09Strain: new FormControl(''),
    lsp10Strain: new FormControl(''),
    lsp11Strain: new FormControl(''),
    lsp12Strain: new FormControl(''),
    lsp13Strain: new FormControl(''),
    lsp14Strain: new FormControl(''),
    lsp15Strain: new FormControl(''),
    lsp16Strain: new FormControl(''),
  });

  chartOptions: EChartsOption = {
    ...axisChartOptions,
    legend: {
      ...axisChartOptions.legend,
      formatter: (name: string) => this.formatLegend(name),
    },
    tooltip: {
      ...axisChartOptions.tooltip,
      formatter: (params: any) => this.formatTooltip(params),
    },
  };

  /* eslint-disable @typescript-eslint/member-ordering */
  private readonly _transformer = (node: SensorNode, level: number) => {
    const { children, name, ...rest } = node;

    return {
      expandable: !!children && children.length > 0,
      level,
      name,
      ...rest,
    } as ExampleFlatNode;
  };

  private readonly subscription: Subscription = new Subscription();

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node: any) => node.level,
    (node: any) => node.expandable,
    (node: any) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  /* eslint-enable @typescript-eslint/member-ordering */

  public constructor(private readonly store: Store) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
    this.greaseStatusGraphData$ = this.store.select(getAnalysisGraphData);
    this.interval$ = this.store.select(getLoadAssessmentInterval);

    this.subscription.add(
      this.store
        .select(getLoadAssessmentDisplay)
        .subscribe((loadAssessmentDisplay: LoadAssessmentDisplay) => {
          this.displayForm.markAsPristine();
          this.displayForm.setValue(loadAssessmentDisplay);

          this.dataSource.data.forEach(
            (sensorNode: SensorNode, index: number) => {
              const values = sensorNode.children.map(
                ({ formControl }) =>
                  this.displayForm.controls[formControl].value
              );
              const indeterminate = [...new Set(values)].length > 1;

              sensorNode.formControl.setValue(values.every((value) => value));
              sensorNode.formControl.markAsPristine();

              this.dataSource.data[index].indeterminate = indeterminate;
            }
          );
        })
    );

    this.displayForm.valueChanges
      .pipe(filter(() => this.displayForm.dirty))
      .subscribe((loadAssessmentDisplay: LoadAssessmentDisplay) =>
        this.store.dispatch(setLoadAssessmentDisplay({ loadAssessmentDisplay }))
      );

    this.checkChannels();
  }

  ngAfterViewInit() {
    this.tree.treeControl.expandAll();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  getIndeterminate = (name: string) =>
    this.dataSource.data.find(
      (sensorNode: SensorNode) => sensorNode.name === name
    )?.indeterminate;

  setInterval(interval: Interval): void {
    this.store.dispatch(setLoadAssessmentInterval({ interval }));
  }

  checkChannels(): void {
    this.dataSource.data.forEach((sensorNode: SensorNode) =>
      sensorNode.formControl.valueChanges
        .pipe(filter(() => sensorNode.formControl.dirty))
        .subscribe((value: any) => {
          const nodeValues = sensorNode.children.reduce(
            (acc, { formControl }) => ({ ...acc, [formControl]: value }),
            {}
          );

          this.displayForm.markAsDirty();
          this.displayForm.patchValue(nodeValues);
        })
    );
  }

  formatLegend(name: string): string {
    const { label, unit } = LOAD_ASSESSMENT_CONTROLS.find(
      ({ formControl }) => formControl === name
    );

    return `${translate(`greaseStatus.${label}`)} (${unit})`;
  }

  formatTooltip(params: any): string {
    return (
      Array.isArray(params) &&
      params.reduce((acc, param, index) => {
        const { label, unit } = LOAD_ASSESSMENT_CONTROLS.find(
          ({ formControl }) => formControl === param.seriesName
        );

        const result = `${acc}${translate(`greaseStatus.${label}`)}: ${
          param.data.value[1]
        } ${unit}<br>`;

        return index === params.length - 1
          ? `${result}${new Date(param.data.value[0]).toLocaleString(
              DATE_FORMAT.local,
              DATE_FORMAT.options
            )} ${new Date(param.data.value[0]).toLocaleTimeString(
              DATE_FORMAT.local
            )}`
          : `${result}`;
      }, '')
    );
  }
}
