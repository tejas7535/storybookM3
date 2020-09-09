import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { selectCalculation } from '../../../core/store';
import { Calculation } from '../../../core/store/reducers/shared/models';
import { CalculationsTableModule } from '../../../shared/calculations-table/calculations-table.module';
import { LoadingSpinnerModule } from '../../../shared/loading-spinner/loading-spinner.module';
import { SharedModule } from '../../../shared/shared.module';
import { AdditionalInformationComponent } from './additional-information.component';
import { BomChartModule } from './bom-chart/bom-chart.module';
import { BomLegendModule } from './bom-legend/bom-legend.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('AdditionalInformationComponent', () => {
  let component: AdditionalInformationComponent;
  let fixture: ComponentFixture<AdditionalInformationComponent>;
  let store: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalInformationComponent],
      imports: [
        NoopAnimationsModule,
        SharedModule,
        provideTranslocoTestingModule({}),
        MatIconModule,
        MatTabsModule,
        MatRippleModule,
        CalculationsTableModule,
        BomChartModule,
        BomLegendModule,
        LoadingSpinnerModule,
      ],
      providers: [provideMockStore()],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(MockStore);
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
