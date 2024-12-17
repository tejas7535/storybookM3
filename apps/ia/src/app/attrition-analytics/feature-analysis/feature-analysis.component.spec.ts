import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FeatureAnalysisComponent } from './feature-analysis.component';

jest.mock('@angular/cdk/drag-drop', () => ({
  ...jest.requireActual('@angular/cdk/drag-drop'),
  moveItemInArray: jest.fn(),
}));

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
    providers: [],
    declarations: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
