import { CdkDragDrop } from '@angular/cdk/drag-drop';
import * as cdkDragDropLib from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FeaturesDialogComponent } from '../features-dialog/features-dialog.component';
import { FeatureParams } from '../models';
import { FeatureSelector } from '../models/feature-selector.model';
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
        expect.objectContaining({ data: { data: [], region: undefined } })
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

  describe('replaceRegionSelectedFeatures', () => {
    test('should replace region selected features', () => {
      const region = 'Asia';
      const europeFeature = { feature: 'Distance', region: 'Europe' };
      component.region = region;

      const allSelectedFeatures = [
        { feature: 'Age', region },
        { feature: 'Gender', region },
        { feature: 'Position', region },
        europeFeature,
      ] as FeatureParams[];

      const regionFeatures = [
        { feature: 'Height', region },
        { feature: 'Gender', region },
      ] as FeatureParams[];

      const result = component.replaceRegionSelectedFeatures(
        allSelectedFeatures,
        regionFeatures
      );

      expect(result.length).toBe(3);
      expect(result[0]).toBe(europeFeature);
      expect(result[1]).toBe(regionFeatures[0]);
      expect(result[2]).toBe(regionFeatures[1]);
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
      const featureParams = [ageFeatureParam];
      component.allSelectedFeatureParams = featureParams;

      const allFeatures: FeatureSelector[] = [
        {
          feature: { feature: 'Height', region: 'Asia', year: 2022, month: 12 },
          selected: true,
        },
        {
          feature: ageFeatureParam,
          selected: true,
        },
      ];
      component.replaceRegionSelectedFeatures = jest
        .fn()
        .mockReturnValue(allFeatures);
      component.selectFeatures.emit = jest.fn();

      component.onSelectedFeatures(allFeatures);

      expect(component.selectFeatures.emit).toHaveBeenCalledWith(allFeatures);
    });
  });

  describe('drop', () => {
    test('should move selected features and trigger change', () => {
      const region = 'Germany';
      const allSelectors = [
        {
          selected: true,
          feature: {
            region,
          },
        } as unknown as FeatureSelector,
        {
          selected: true,
          feature: {
            region: 'Brasil',
          },
        } as unknown as FeatureSelector,
        {
          selected: false,
        } as unknown as FeatureSelector,
      ];

      component.region = region;
      component.allFeatureSelectors = allSelectors;

      const event = {
        previousIndex: 3,
        currentIndex: 2,
      } as unknown as CdkDragDrop<string[]>;

      component.onSelectedFeatures = jest.fn();

      component.drop(event);

      expect(component.onSelectedFeatures).toHaveBeenCalledWith([
        allSelectors[0],
      ]);
      expect(cdkDragDropLib.moveItemInArray).toHaveBeenCalledWith(
        [allSelectors[0]],
        event.previousIndex,
        event.currentIndex
      );
    });
  });
});
