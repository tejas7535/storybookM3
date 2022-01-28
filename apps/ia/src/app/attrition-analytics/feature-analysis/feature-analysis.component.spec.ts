import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FeaturesDialogComponent } from '../features-dialog/features-dialog.component';
import { FeatureParams } from '../models';
import { FeatureSelector } from '../models/feature-selector.model';
import { FeatureAnalysisComponent } from './feature-analysis.component';

describe('FeatureAnalysisComponent', () => {
  let component: FeatureAnalysisComponent;
  let spectator: Spectator<FeatureAnalysisComponent>;

  const createComponent = createComponentFactory({
    component: FeatureAnalysisComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatDialogModule,
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

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });

  describe('openFeaturesDialog', () => {
    test('should open dialog', () => {
      component.allFeatureSelectors = [];
      component['dialog'].open = jest.fn();
      component.dispatchResultOnClose = jest.fn();

      component.openFeaturesDialog();

      expect(component['dialog'].open).toHaveBeenCalledWith(
        FeaturesDialogComponent,
        expect.objectContaining({ data: [] })
      );
      expect(component.dispatchResultOnClose).toHaveBeenCalledWith(
        component['dialog'].open(FeaturesDialogComponent, {
          data: component.allFeatureSelectors,
        })
      );
    });
  });

  describe('dispatchResultOnClose', () => {
    test('should emit result on close', () => {
      component.onSelectedFeatures = jest.fn();
      component['subscription'].add = jest.fn();
      const featureAge = { feature: 'test 2' } as FeatureParams;
      const result = [new FeatureSelector(featureAge, true)];
      const dialogRef = {
        afterClosed: () => of(result),
      } as MatDialogRef<FeaturesDialogComponent>;

      component.dispatchResultOnClose(dialogRef);

      expect(component['subscription'].add).toHaveBeenCalled();
      expect(component.onSelectedFeatures).toHaveBeenCalledWith(result);
    });

    test('should not emit result on close on cancel', () => {
      component.onSelectedFeatures = jest.fn();
      component['subscription'].add = jest.fn();
      const dialogRef = {
        afterClosed: () => of(undefined as any),
      } as MatDialogRef<FeaturesDialogComponent>;

      component.dispatchResultOnClose(dialogRef);

      expect(component['subscription'].add).toHaveBeenCalled();
      expect(component.onSelectedFeatures).not.toHaveBeenCalled();
    });
  });
});
