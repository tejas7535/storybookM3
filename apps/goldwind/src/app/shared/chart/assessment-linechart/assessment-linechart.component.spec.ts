import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { NgxEchartsModule } from 'ngx-echarts';
import { of } from 'rxjs';
import { Interval } from '../../../core/store/reducers/shared/models';
import { EmptyGraphModule } from '../../empty-graph/empty-graph.module';
import { Unit, Type, Control } from '../../models';
import { AssessmentLinechartComponent } from './assessment-linechart.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { fakeAsync } from '@angular/core/testing';
import { ReactiveComponentModule } from '@ngrx/component';
import { DateRangeModule } from '../../date-range/date-range.module';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { DATE_FORMAT } from '../../constants';
describe('AssessmentLinechartComponent', () => {
  let component: AssessmentLinechartComponent;
  let spectator: Spectator<AssessmentLinechartComponent>;
  let mockStore: MockStore;

  const createComponent = createComponentFactory({
    component: AssessmentLinechartComponent,
    declarations: [AssessmentLinechartComponent],
    detectChanges: false,

    imports: [
      ReactiveFormsModule,
      ReactiveComponentModule,

      // Material Modules
      MatCardModule,
      MatCheckboxModule,
      MatTreeModule,
      MatIconModule,
      EmptyGraphModule,
      DateRangeModule,
      SharedTranslocoModule,

      // ECharts
      NgxEchartsModule.forRoot({
        echarts: async () => import('../echarts'),
      }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          maintenanceAssessment: {
            display: {
              waterContent_1: true,
              deterioration_1: true,
              temperatureOptics_1: true,
              waterContent_2: true,
              deterioration_2: true,
              temperatureOptics_2: true,
              rsmShaftSpeed: true,
            },
            interval: {
              startDate: 123_456_789,
              endDate: 987_654_321,
            },
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput('translateKey', 'maintenanceAssessment');
    spectator.setInput('ASSESSMENT_CONTROLS', [
      {
        label: 'waterContent_1',
        formControl: 'waterContent_1',
        unit: Unit.percent,
        type: Type.grease,
      },
    ]);
    spectator.setInput('TREE_DATA', [
      {
        name: 'greaseMonitor',
        children: [{ type: Type.grease } as Control].filter(
          (control) => control.type === Type.grease
        ),
        formControl: new FormControl(''),
        indeterminate: false,
      },
    ]);
    spectator.setInput(
      'displayForm',
      new FormGroup({ waterContent_1: new FormControl('') })
    );
    spectator.setInput(
      'interval$',
      of({
        startDate: 123_456_789,
        endDate: 987_654_321,
      } as Interval)
    );
    component = spectator.debugElement.componentInstance;
    mockStore = spectator.inject(MockStore);

    mockStore.dispatch = jest.fn();
  });

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));
  describe('chartOptions', () => {
    it('should call legend formatter method', () => {
      const mockLabelName = 'waterContent_1';
      component.formatLegend = jest.fn();

      const legendFormatter = (component.chartOptions.legend as any).formatter;
      legendFormatter(mockLabelName);

      expect(component.formatLegend).toHaveBeenCalledTimes(1);
    });

    it('should call tooltip formatter method', () => {
      const mockParams = [
        {
          seriesName: 'waterContent_1',
          data: {
            value: [new Date(), 123],
          },
        },
      ];
      component.formatTooltip = jest.fn();

      const tooltipFormatter = (component.chartOptions.tooltip as any)
        .formatter;
      tooltipFormatter(mockParams);

      expect(component.formatTooltip).toHaveBeenCalledTimes(1);
    });
  });
  describe('formatLegend', () => {
    it('should return a translated text with physical symbol', () => {
      const mockLabelName = 'waterContent_1';
      const formattedMockLabel = `${component.translateKey}.waterContent_1 (%)`;

      expect(component.formatLegend(mockLabelName)).toBe(formattedMockLabel);
    });
  });

  describe('checkChannels', () => {
    it('should do sth with the channels', () => {
      component.ngOnInit();
      component.displayForm.setValue({ waterContent_1: false });

      component.checkChannels();

      component.dataSource.data[0].formControl.markAsDirty();
      component.dataSource.data[0].formControl.patchValue(false);

      expect(component.displayForm.value).toEqual({
        waterContent_1: false,
      });
    });
  });

  describe('formatTooltip', () => {
    it('should return a translated texts with physical symbols and date', () => {
      component.displayForm.setValue({ waterContent_1: true });
      const mockDate = new Date(1_466_424_490_000);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
      const mockParams = [
        {
          seriesName: 'waterContent_1',
          data: {
            value: [new Date(), 123],
          },
        },
      ];
      const formattedMockTooltip = `${
        component.translateKey
      }.waterContent_1: 123 %<br>${mockDate.toLocaleString(
        DATE_FORMAT.local,
        DATE_FORMAT.options
      )} ${mockDate.toLocaleTimeString(DATE_FORMAT.local)}`;

      expect(component.formatTooltip(mockParams)).toBe(formattedMockTooltip);
      jest.resetAllMocks();
    });
  });
});
