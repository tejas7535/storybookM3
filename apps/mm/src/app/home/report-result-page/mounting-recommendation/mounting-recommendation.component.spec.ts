import { MatCard } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MountingRecommendationComponent } from './mounting-recommendation.component';

describe('MountingRecommendationComponent', () => {
  let spectator: Spectator<MountingRecommendationComponent>;

  const createComponent = createComponentFactory({
    component: MountingRecommendationComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MockComponent(MatCard),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should not display content when no mounting recommendation is provided', () => {
    expect(spectator.query(MatCard)).not.toExist();
  });

  describe('when mounting recommendation is provided', () => {
    beforeEach(() => {
      spectator.setInput('mountingRecommendations', [
        {
          field: 'Mounting Recommendation 1',
          value: 'Mounting Recommendation 1 Value',
        },
      ]);
    });

    it('should display the mounting recommendation', () => {
      expect(spectator.query(MatCard)).toExist();
    });

    it('should contain the title', () => {
      const titleElement = spectator.query('h3');

      expect(titleElement).toHaveText('reportResult.mountingInstructions');
    });
  });
});
