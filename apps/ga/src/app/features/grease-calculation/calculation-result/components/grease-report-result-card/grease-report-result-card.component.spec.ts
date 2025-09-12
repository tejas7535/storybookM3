import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent, MockModule, MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationParametersFacade, SettingsFacade } from '@ga/core/store';
import { BadgeComponent } from '@ga/shared/components/badge/badge.component';
import { greaseResultMock } from '@ga/testing/mocks';

import { ResultSection } from '../../models';
import { ResultSectionPipe } from '../../pipes/result-section.pipe';
import { GreaseReportResultCardComponent } from './grease-report-result-card.component';
import { GreaseReportResultCardSectionComponent } from './grease-report-result-card-section/grease-report-result-card-section.component';

describe('GreaseReportResultCardComponent', () => {
  let component: GreaseReportResultCardComponent;
  let spectator: Spectator<GreaseReportResultCardComponent>;

  const createComponent = createComponentFactory({
    component: GreaseReportResultCardComponent,
    imports: [
      MockModule(MatIconModule),
      MockModule(MatButtonModule),
      GreaseReportResultCardSectionComponent,
      MockComponent(BadgeComponent),
      MockPipe(
        ResultSectionPipe,
        () =>
          ({
            extendable: true,
          }) as ResultSection
      ),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: SettingsFacade,
        useValue: {
          partnerVersion$: of(false),
        },
      },
      {
        provide: CalculationParametersFacade,
        useValue: {
          schaefflerGreases$: of([
            {
              name: greaseResultMock.mainTitle,
              data: {
                ingredients: {
                  en: 'Grease Ingredients EN',
                  de: 'Grease Ingredients DE',
                },
                imageUrl: '/assets/images/placeholder.png',
              },
            },
          ]),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        greaseResult: greaseResultMock,
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
