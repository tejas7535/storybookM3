import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { NgxEchartsModule } from 'ngx-echarts';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import { selectCalculation } from '../../../core/store';
import { Calculation } from '../../../core/store/reducers/shared/models';
import { CalculationsTableModule } from '../../../shared/calculations-table/calculations-table.module';
import { LoadingSpinnerModule } from '../../../shared/loading-spinner/loading-spinner.module';
import { SharedModule } from '../../../shared/shared.module';
import { AdditionalInformationComponent } from './additional-information.component';
import { BomChartComponent } from './bom-chart/bom-chart.component';
import { BomLegendModule } from './bom-legend/bom-legend.module';

describe('AdditionalInformationComponent', () => {
  let spectator: Spectator<AdditionalInformationComponent>;
  let component: AdditionalInformationComponent;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AdditionalInformationComponent,
    declarations: [BomChartComponent],
    imports: [
      SharedModule,
      provideTranslocoTestingModule({}),
      MatIconModule,
      MatTabsModule,
      MatRippleModule,
      MockModule(CalculationsTableModule),
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      }),
      BomLegendModule,
      LoadingSpinnerModule,
    ],
    providers: [
      provideMockStore({
        initialState: { detail: DETAIL_STATE_MOCK },
      }),
    ],
    disableAnimations: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.detectChanges();

    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClose', () => {
    it('should emit close event', () => {
      component['closeOverlay'].emit = jest.fn();

      component.onClose();

      expect(component['closeOverlay'].emit).toHaveBeenCalled();
    });
  });

  describe('selectCalculation', () => {
    test('should dispatch selectCalculation Action', () => {
      store.dispatch = jest.fn();

      const nodeId = '7';
      const calculation = ({} as unknown) as Calculation;

      component.selectCalculation({ nodeId, calculation });

      expect(store.dispatch).toHaveBeenCalledWith(
        selectCalculation({ nodeId, calculation })
      );
    });
  });
});
