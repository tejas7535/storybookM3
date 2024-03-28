import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FeatureParams } from '../models';
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

  describe('drop', () => {
    test('should move selected features and trigger change', () => {
      const event = {
        previousIndex: 3,
        currentIndex: 1,
      } as CdkDragDrop<string[]>;
      const reorderedFeatures: FeatureParams[] = [];
      component.selectedFeatures = [];
      component.reorderFeatures.emit = jest.fn();

      component.drop(event);

      expect(moveItemInArray).toHaveBeenCalledWith(
        component.selectedFeatures,
        event.previousIndex,
        event.currentIndex
      );
      expect(component.reorderFeatures.emit).toHaveBeenCalledWith(
        reorderedFeatures
      );
    });
  });
});
