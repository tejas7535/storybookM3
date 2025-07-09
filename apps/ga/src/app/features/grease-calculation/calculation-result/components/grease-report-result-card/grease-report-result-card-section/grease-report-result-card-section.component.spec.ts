import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockModule, MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BadgeComponent } from '@ga/shared/components/badge/badge.component';

import { ResultSection } from '../../../models';
import { AutomaticLubricationPipe } from '../../../pipes';
import { GreaseReportResultCardSectionLabelValuesComponent } from '../grease-report-result-card-section-label-values/grease-report-result-card-section-label-values.component';
import { GreaseReportResultCardSectionComponent } from './grease-report-result-card-section.component';

describe('GreaseReportResultCardSectionComponent', () => {
  let component: GreaseReportResultCardSectionComponent;
  let spectator: Spectator<GreaseReportResultCardSectionComponent>;

  const createComponent = createComponentFactory({
    component: GreaseReportResultCardSectionComponent,
    imports: [
      MockModule(MatButtonModule),
      MockModule(MatIconModule),
      MockModule(MatTooltipModule),
      MockComponent(GreaseReportResultCardSectionLabelValuesComponent),
      MockPipe(AutomaticLubricationPipe),
      MockComponent(BadgeComponent),
      provideTranslocoTestingModule({ en: {} }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        section: {} as ResultSection,
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
