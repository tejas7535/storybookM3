import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockModule } from 'ng-mocks';

import { GreaseReportConcept1Component } from '../../grease-report-concept1';
import { GreaseReportConcept1DetailComponent } from '../../grease-report-concept1-detail';
import { GreaseReportResultCardSectionLabelValuesComponent } from './grease-report-result-card-section-label-values.component';

describe('GreaseReportResultCardSectionLabelValuesComponent', () => {
  let component: GreaseReportResultCardSectionLabelValuesComponent;
  let spectator: Spectator<GreaseReportResultCardSectionLabelValuesComponent>;

  const createComponent = createComponentFactory({
    component: GreaseReportResultCardSectionLabelValuesComponent,
    imports: [
      MockModule(MatIconModule),
      MockModule(MatTooltipModule),
      MockComponent(GreaseReportConcept1Component),
      MockComponent(GreaseReportConcept1DetailComponent),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        labelValues: [],
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
