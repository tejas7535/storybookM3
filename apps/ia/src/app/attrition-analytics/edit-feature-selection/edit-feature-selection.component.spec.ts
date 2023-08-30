import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FeaturesDialogComponent } from '../features-dialog/features-dialog.component';
import { FeatureParams, FeatureSelector } from '../models';
import { EditFeatureSelectionComponent } from './edit-feature-selection.component';

describe('EditFeatureSelectionComponent', () => {
  let component: EditFeatureSelectionComponent;
  let spectator: Spectator<EditFeatureSelectionComponent>;
  const region = 'AP';

  const createComponent = createComponentFactory({
    component: EditFeatureSelectionComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatButtonModule,
      MatDialogModule,
      MatIconModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openFeaturesDialog', () => {
    test('should open dialog', () => {
      component.selectors = [];
      component.region = region;
      component['dialog'].open = jest.fn();
      component.onDialogClose = jest.fn();

      component.editFeatureSelection();

      expect(component['dialog'].open).toHaveBeenCalledWith(
        FeaturesDialogComponent,
        expect.objectContaining({ data: { data: [], region } })
      );
      expect(component.onDialogClose).toHaveBeenCalledWith(
        component['dialog'].open(FeaturesDialogComponent, {
          data: component.selectors,
        })
      );
    });
  });

  describe('dispatchResultOnClose', () => {
    test('should emit result on close', () => {
      component.onSelectedFeatures = jest.fn();
      const featureAge = { feature: 'test 2' } as FeatureParams;
      const result = [new FeatureSelector(featureAge, true)];
      const dialogRef = {
        afterClosed: () => of(result),
      } as MatDialogRef<FeaturesDialogComponent>;

      component.onDialogClose(dialogRef);

      expect(component.onSelectedFeatures).toHaveBeenCalledWith(result);
    });

    test('should not emit result on close on cancel', () => {
      component.onSelectedFeatures = jest.fn();
      const dialogRef = {
        afterClosed: () => of(undefined as any),
      } as MatDialogRef<FeaturesDialogComponent>;

      component.onDialogClose(dialogRef);

      expect(component.onSelectedFeatures).not.toHaveBeenCalled();
    });
  });

  describe('onSelectedFeatures', () => {
    test('should emit all feature params', () => {
      const ageFeatureParam: FeatureParams = {
        feature: 'Age',
        region: 'Asia',
        year: 2021,
        month: 3,
      };
      const ageFeatureSelector: FeatureSelector = {
        feature: ageFeatureParam,
        selected: true,
      };
      const featureParams = [ageFeatureSelector];
      component.selectors = featureParams;

      const heightFeatureParam = {
        feature: 'Height',
        region: 'Asia',
        year: 2022,
        month: 12,
      };
      const allFeatures: FeatureSelector[] = [
        {
          feature: heightFeatureParam,
          selected: true,
        },
        {
          feature: ageFeatureParam,
          selected: true,
        },
      ];
      component.changeSelectedFeatures.emit = jest.fn();

      component.onSelectedFeatures(allFeatures);

      expect(component.changeSelectedFeatures.emit).toHaveBeenCalledWith([
        heightFeatureParam,
        ageFeatureParam,
      ]);
    });
  });
});
