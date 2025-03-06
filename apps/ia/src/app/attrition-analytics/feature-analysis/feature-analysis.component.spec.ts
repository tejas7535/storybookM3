import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FeatureAnalysisComponent } from './feature-analysis.component';

describe('FeatureAnalysisComponent', () => {
  let component: FeatureAnalysisComponent;
  let spectator: Spectator<FeatureAnalysisComponent>;

  const createComponent = createComponentFactory({
    component: FeatureAnalysisComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatTooltipModule,
      MatIconModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
