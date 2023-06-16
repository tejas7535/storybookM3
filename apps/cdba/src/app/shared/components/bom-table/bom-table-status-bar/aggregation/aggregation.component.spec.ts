import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { IStatusPanelParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AggregationStatusBar } from '@cdba/shared/models';
import { AggregationStatusBarData } from '@cdba/shared/models/aggregation-status-bar.model';

import { AggregationComponent } from './aggregation.component';
import { AggregationService } from './service/aggregation.service';

describe('AggregationComponent', () => {
  let component: AggregationComponent;
  let spectator: Spectator<AggregationComponent>;

  const createComponent = createComponentFactory({
    component: AggregationComponent,
    providers: [AggregationService],
    imports: [AgGridModule, provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be created with empty aggregationModel', () => {
    const expectedModel = new AggregationStatusBar(
      false,
      false,
      new AggregationStatusBarData(new Map(), new Map()),
      0,
      0,
      0,
      0,
      0
    );

    expect(component.aggregationModel).toStrictEqual(expectedModel);
  });

  it('should detect rangeSelectionChanged events', () => {
    const paramsMock = {
      api: { getCellRanges: jest.fn().mockReturnValue([]) },
    } as unknown as IStatusPanelParams;

    const calculateStatusBarValuesSpy = jest.spyOn(
      component['aggregationService'],
      'calculateStatusBarValues'
    );

    const changeDetectorRefSpy = jest.spyOn(
      component['changeDetectorRef'],
      'detectChanges'
    );

    component['handleRangeSelectionChanges'](paramsMock);

    expect(paramsMock.api.getCellRanges).toBeCalledTimes(1);
    expect(calculateStatusBarValuesSpy).toBeCalledTimes(1);
    expect(changeDetectorRefSpy).toBeCalledTimes(1);
  });
});
