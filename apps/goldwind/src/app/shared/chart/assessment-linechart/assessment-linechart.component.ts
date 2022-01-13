import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  MatTree,
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';

import { filter, Observable, of, Subscription, take } from 'rxjs';

import { translate } from '@ngneat/transloco';
import { ECharts, EChartsOption } from 'echarts';

import { Interval } from '../../../core/store/reducers/shared/models';
import { DATE_FORMAT } from '../../constants';
import { DashboardMoreInfoDialogComponent } from '../../dashboard-more-info-dialog/dashboard-more-info-dialog.component';
import { Control, ExampleFlatNode, SensorNode } from '../../models';
import { axisChartOptions } from '../chart';

@Component({
  selector: 'goldwind-assessment-linechart',
  templateUrl: './assessment-linechart.component.html',
  styleUrls: ['./assessment-linechart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentLinechartComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  /**
   * The Tree with contains the tree elements
   */
  @ViewChild('tree') tree: MatTree<any>;
  /**
   * Some elements with name and label informations
   */
  @Input() ASSESSMENT_CONTROLS: Control[] = [];
  /**
   * A description of the current chart
   */
  @Input() description: string;
  /**
   * a translate object from transloco
   */
  translate: any = translate;
  /**
   *
   */
  @Input() displayForm: FormGroup = new FormGroup({
    default: new FormControl(''),
  });
  /**
   * Input Tree Data from used component
   */
  @Input() TREE_DATA: SensorNode[] = [];
  /**
   * The graph content
   */
  @Input() graphData$: Observable<EChartsOption>;
  /**
   * the interval / date range to display
   */
  @Input() interval$: Observable<Interval> = of({
    startDate: Date.now() * 1000,
    endDate: Date.now() * 1000,
  } as Interval);
  /**
   * the current display state observable typically from store
   */
  @Input() displayNodes$: Observable<any> = of();
  /**
   * a key of a toplevel key in en.json to group translations for views
   */
  @Input() translateKey: string;
  /**
   * a emitter to pass a chosen interval to the parent to refresh the data
   */
  @Output() interval: EventEmitter<Interval> = new EventEmitter();
  /**
   * Used to push changes in the ui to the parent
   */
  @Output() displayChange: EventEmitter<any> = new EventEmitter();
  /**
   * Emits a event when the zoom slider in handled
   */
  @Output() zoomChange: EventEmitter<any> = new EventEmitter();

  /**
   * TODO:
   */
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );
  /*
   * Default configuration for the line chart
   */
  chartOptions: EChartsOption = {
    ...axisChartOptions,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '20%',
      containLabel: true,
    },
    legend: {
      show: false,
    },
    tooltip: {
      ...axisChartOptions.tooltip,
      formatter: (params: any) => this.formatTooltip(params),
    },
  };
  /**
   * A data source to render the tree
   */
  dataSource: MatTreeFlatDataSource<SensorNode, ExampleFlatNode>;
  /**
   * The Instance of echarts to use the api
   */
  echartsInstance: ECharts;
  /**
   *
   * @param dialog
   */
  constructor(private readonly dialog: MatDialog) {}
  /**
   * Sets the values of each checkbox and even the children nodes as well
   * @param display property to display certain fields
   */
  updateNode(display: any) {
    this.displayForm.markAsPristine();
    this.displayForm.setValue(display);
    this.dataSource.data.forEach((sensorNode: SensorNode, index: number) => {
      const sensorNodeValues = sensorNode.children.map(
        ({ formControl }) => this.displayForm.controls[formControl].value
      );
      const indeterminate = [...new Set(sensorNodeValues)].length > 1;

      sensorNode.formControl.setValue(sensorNodeValues.every((value) => value));
      sensorNode.formControl.markAsPristine();

      this.dataSource.data[index].indeterminate = indeterminate;
    });
  }
  /**
   * Sets the zoom level back to 0% and 100% for the side display the full range
   */
  resetZoom() {
    this.echartsInstance.dispatchAction({
      type: 'dataZoom',
      start: 0,
      end: 100,
    });
  }
  /**
   * Dispatches an event when the values isnt pristine
   * Used by the component to refresh data when zoom level changes
   * @param $event
   * @returns
   */
  onChartZoom($event: any) {
    if ($event.start === 0 && $event.end === 100) {
      return;
    }

    this.zoomChange.next({ start: $event.start, end: $event.end });
  }
  /**
   * Formates the legend with found control name
   */
  formatLegend(name: string): string {
    const { label, unit } = this.ASSESSMENT_CONTROLS.find(
      ({ formControl }) => formControl === name
    );

    return `${translate(`${this.translateKey}.${label}`)} (${unit})`;
  }
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
  /**
   *
   */
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node: any) => node.level,
    (node: any) => node.expandable,
    (node: any) => node.children
  );
  private readonly subscription: Subscription = new Subscription();

  /**
   * Formates the tooltip
   */
  formatTooltip(params: any): string {
    return (
      Array.isArray(params) &&
      // eslint-disable-next-line unicorn/no-array-reduce
      params.reduce((acc, param, index) => {
        const { label, unit } = this.ASSESSMENT_CONTROLS.find(
          ({ formControl }) => formControl === param.seriesName
        );

        const result = `${acc}${translate(`${this.translateKey}.${label}`)}: ${
          param.data.value[1]
        } ${unit || ''}<br>`;

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
  /**
   * Initalize the component and sets up subscriptions to retrieve data and form changes
   */
  ngOnInit(): void {
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
    this.dataSource.data = this.TREE_DATA;

    this.subscription.add(
      this.displayForm.valueChanges
        .pipe(filter(() => this.displayForm.dirty))
        .subscribe((AssessmentDisplay: any) =>
          this.displayChange.emit(AssessmentDisplay)
        )
    );
    this.subscription.add(
      this.displayNodes$.subscribe((display) => this.updateNode(display))
    );
    this.checkChannels();
  }
  ngAfterViewInit() {
    this.tree.treeControl.expandAll();
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  /**
   * Passes an interval selection to the parent to get data for the selected interval
   */
  setInterval = (interval: Interval) => this.interval.emit(interval);
  /**
   * triggers on component destroy
   * unsubscribes open subs
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  /**
   * Sets intermediate information
   * @param name
   * @returns
   */
  getIndeterminate = (name: string) =>
    this.dataSource.data.find(
      (sensorNode: SensorNode) => sensorNode.name === name
    )?.indeterminate;
  /**
   * Interates over each parent node and capture cahnges of every dirty form control passed
   * only triggeres when parent checkboxes are changed
   */
  checkChannels(): void {
    this.dataSource.data.forEach((sensorNode: SensorNode) => {
      sensorNode.formControl.valueChanges
        .pipe(filter(() => sensorNode.formControl.dirty))
        .subscribe((value: any) => {
          // eslint-disable-next-line unicorn/no-array-reduce
          const nodeValues = sensorNode.children.reduce(
            (acc, { formControl }) => ({ ...acc, [formControl]: value }),
            {}
          );

          this.displayForm.markAsDirty();
          this.displayForm.patchValue(nodeValues);
        });
    });
  }
  /**
   * When triggered from template it will updates the node when the is parent has changed
   * @param param0
   * @param isChecked
   */
  updateChildForms({ name }: any, isChecked: boolean) {
    const node = this.dataSource.data.find(
      (sensorNode: SensorNode) => sensorNode.name === name
    );
    const childrenForms = node.children
      .map((c) => c.formControl)
      .reduce((acc, key) => ({ ...acc, [key]: isChecked }), {});

    this.displayForm.markAsDirty();
    this.displayForm.patchValue(childrenForms);
  }
  /**
   * Creates an invisible anchor element, sets the text content to contain the displayed data in json and simulates a click to download as a file
   */
  downloadChartContent() {
    this.graphData$.pipe(take(1)).subscribe((data) => {
      const element = document.createElement('a');
      element.setAttribute(
        'href',
        `data:application/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(data, undefined, 4)
        )}`
      );
      element.setAttribute(
        'download',
        `export-${new Date().toISOString()}.json`
      );
      element.style.display = 'none';
      document.body.append(element);

      element.click();

      element.remove();
    });
  }
  /**
   * set the local echarts instance to trigger actions later
   * @param event
   */
  onInit(event: any) {
    this.echartsInstance = event;
  }

  /**
   * opens a dialog with more info of the sensor
   */
  openMoreInfo() {
    this.dialog.open(DashboardMoreInfoDialogComponent, {
      maxWidth: '400px',
      data: {
        title: translate(this.translateKey + '.' + 'title'),
        text: this.description,
      },
    });
  }
}
