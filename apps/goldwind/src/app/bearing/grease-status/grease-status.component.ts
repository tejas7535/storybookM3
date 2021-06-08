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
import { select, Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import {
  setGreaseDisplay,
  setGreaseInterval,
} from '../../core/store/actions/grease-status/grease-status.actions';
import { GreaseStatusState } from '../../core/store/reducers/grease-status/grease-status.reducer';
import {
  GreaseControl,
  GreaseDisplay,
  Type,
} from '../../core/store/reducers/grease-status/models';
import { GraphData, Interval } from '../../core/store/reducers/shared/models';
import {
  getAnalysisGraphData,
  getGreaseDisplay,
  getGreaseInterval,
  getGreaseStatusLoading,
} from '../../core/store/selectors';
import { axisChartOptions } from '../../shared/chart/chart';
import { DATE_FORMAT, GREASE_CONTROLS } from '../../shared/constants';

interface SensorNode {
  name?: string;
  children?: GreaseControl[];
  formControl?: any;
  indeterminate?: boolean;
}

const TREE_DATA: SensorNode[] = [
  {
    name: 'greaseMonitor',
    children: GREASE_CONTROLS.filter((control) => control.type === Type.grease),
    formControl: new FormControl(''),
    indeterminate: false,
  },
  // {
  //   name: 'loadMonitor',
  //   children: GREASE_CONTROLS.filter((control) => control.type === Type.load),
  //   formControl: new FormControl(''),
  //   indeterminate: false,
  // },
  // {
  //   name: 'edmMonitor',
  //   children: GREASE_CONTROLS.filter((control) => control.type === Type.edm),
  //   formControl: new FormControl(''),
  //   indeterminate: false,
  // },
  {
    name: 'rotorRotationSpeedMonitor',
    children: GREASE_CONTROLS.filter((control) => control.type === Type.rsm),
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
  selector: 'goldwind-grease-status-monitoring',
  templateUrl: './grease-status.component.html',
  styleUrls: ['./grease-status.component.scss'],
})
export class GreaseStatusComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tree') tree: MatTree<any>;

  greaseStatusGraphData$: Observable<GraphData>;
  interval$: Observable<Interval>;
  loading$: Observable<boolean>;
  checkBoxes = GREASE_CONTROLS;

  displayForm = new FormGroup({
    waterContent_1: new FormControl(''),
    deterioration_1: new FormControl(''),
    temperatureOptics_1: new FormControl(''),
    waterContent_2: new FormControl(''),
    deterioration_2: new FormControl(''),
    temperatureOptics_2: new FormControl(''),
    rsmShaftSpeed: new FormControl(''),
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

  public constructor(private readonly store: Store<GreaseStatusState>) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
    this.greaseStatusGraphData$ = this.store.pipe(select(getAnalysisGraphData));
    this.interval$ = this.store.pipe(select(getGreaseInterval));
    this.loading$ = this.store.pipe(select(getGreaseStatusLoading));

    this.subscription.add(
      this.store
        .pipe(select(getGreaseDisplay))
        .subscribe((greaseDisplay: GreaseDisplay) => {
          this.displayForm.markAsPristine();
          this.displayForm.setValue(greaseDisplay);

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
      .subscribe((greaseDisplay: GreaseDisplay) =>
        this.store.dispatch(setGreaseDisplay({ greaseDisplay }))
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
    this.store.dispatch(setGreaseInterval({ interval }));
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
    const { label, unit } = GREASE_CONTROLS.find(
      ({ formControl }) => formControl === name
    );

    return `${translate(`greaseStatus.${label}`)} (${unit})`;
  }

  formatTooltip(params: any): string {
    return (
      Array.isArray(params) &&
      params.reduce((acc, param, index) => {
        const { label, unit } = GREASE_CONTROLS.find(
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
