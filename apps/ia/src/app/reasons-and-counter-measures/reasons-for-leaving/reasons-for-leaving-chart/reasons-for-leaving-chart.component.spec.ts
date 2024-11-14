import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { SolidDoughnutChartComponent } from '../../../shared/charts/solid-doughnut-chart/solid-doughnut-chart.component';
import { ReasonForLeavingTab } from '../../models';
import { ReasonsForLeavingChartComponent } from './reasons-for-leaving-chart.component';

jest.mock('@jsverse/transloco', () => ({
  translate: (key: string, params: any) => {
    if (
      key ===
      'reasonsAndCounterMeasures.reasonsForLeaving.chart.titleOverallReasons'
    ) {
      return 'titleOverallReasons';
    } else if (
      key === 'reasonsAndCounterMeasures.reasonsForLeaving.chart.conductedInfo'
    ) {
      return `conductedInfo, conducted: ${params.conducted}, percentage: ${params.percentage}`;
    } else {
      return '';
    }
  },
}));
describe('ReasonsForLeavingChartComponent', () => {
  let component: ReasonsForLeavingChartComponent;
  let spectator: Spectator<ReasonsForLeavingChartComponent>;

  const createComponent = createComponentFactory({
    component: ReasonsForLeavingChartComponent,
    detectChanges: false,
    declarations: [MockComponent(SolidDoughnutChartComponent)],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectedTab', () => {
    test('should reset chart', () => {
      component.chart = {
        resetChart: jest.fn(),
      } as unknown as SolidDoughnutChartComponent;

      component.selectedTab = ReasonForLeavingTab.TOP_REASONS;

      expect(component.chart.resetChart).toHaveBeenCalled();
    });
  });

  describe('set side', () => {
    test('should set config side', () => {
      component.side = 'left';

      expect(component.config.side).toBe('left');
    });
  });

  describe('set title', () => {
    test('should set config title', () => {
      component.title = 'title';

      expect(component.config.title).toBe('title');
    });
  });

  describe('set conductedInterviewsInfo', () => {
    test('should set config and subTitle', () => {
      component.conductedInterviewsInfo = {
        conducted: 1,
        percentage: 2,
      };

      expect(component.config.subTitle).toBe(
        'conductedInfo, conducted: 1, percentage: 2'
      );
    });
  });

  describe('onSelectedReason', () => {
    test('should emit selected reason', () => {
      component.selectedReason = {
        emit: jest.fn(),
      } as unknown as any;

      component.onSelectedReason('reason');

      expect(component.selectedReason.emit).toHaveBeenCalledWith('reason');
    });
  });
});
