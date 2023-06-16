import * as dragAndDrop from '@angular/cdk/drag-drop';
import {
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule as MatDialogModule,
} from '@angular/material/legacy-dialog';
import {
  MatLegacySnackBar as MatSnackBar,
  MatLegacySnackBarModule as MatSnackBarModule,
} from '@angular/material/legacy-snack-bar';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FeatureParams } from '../models/feature-params.model';
import { FeatureSelector } from '../models/feature-selector.model';
import { FeaturesDialogComponent } from './features-dialog.component';

jest.mock('@angular/cdk/drag-drop', () => ({
  ...(jest.requireActual('@angular/cdk/drag-drop') as any),
  moveItemInArray: jest.fn(),
  transferArrayItem: jest.fn(),
}));

describe('FeaturesDialogComponent', () => {
  let component: FeaturesDialogComponent;
  let spectator: Spectator<FeaturesDialogComponent>;
  let snackBar: MatSnackBar;

  const region = 'Alasca';
  const data: FeatureSelector[] = [
    {
      feature: {
        feature: 'Test',
        region,
      } as FeatureParams,
      selected: true,
    },
    {
      feature: {
        feature: 'Test 2',
        region,
      } as FeatureParams,
      selected: false,
    },
  ];

  const config = { data, region };

  const createComponent = createComponentFactory({
    component: FeaturesDialogComponent,
    imports: [
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
      MatDialogModule,
      DragDropModule,
      MatSnackBarModule,
    ],
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: config },
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    snackBar = spectator.inject(MatSnackBar);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should fill selected/unselected list according injected data', () => {
      expect(component.selected.length).toEqual(
        data.filter((e) => e.selected).length
      );
      expect(component.unselected.length).toEqual(
        data.filter((e) => !e.selected).length
      );
    });
  });

  describe('drop', () => {
    test('should move item if same container', () => {
      const container = {
        data: {},
      } as CdkDropList<FeatureSelector[]>;
      const event: CdkDragDrop<FeatureSelector[]> = {
        previousContainer: container,
        container,
        previousIndex: 0,
        currentIndex: 1,
      } as unknown as CdkDragDrop<FeatureSelector[]>;

      component.drop(event);

      expect(dragAndDrop.moveItemInArray).toHaveBeenCalledWith(
        container.data,
        event.previousIndex,
        event.currentIndex
      );
    });

    test('should transfer item if other container', () => {
      const container = {
        data: {},
      } as CdkDropList<FeatureSelector[]>;
      const previousContainer = {
        data: {},
      } as CdkDropList<FeatureSelector[]>;
      const event: CdkDragDrop<FeatureSelector[]> = {
        previousContainer,
        container,
        previousIndex: 0,
        currentIndex: 1,
      } as unknown as CdkDragDrop<FeatureSelector[]>;

      component.drop(event);

      expect(dragAndDrop.transferArrayItem).toHaveBeenCalledWith(
        previousContainer.data,
        container.data,
        event.previousIndex,
        event.currentIndex
      );
    });
  });

  describe('maxSelectedFeaturesPredicate', () => {
    test('should return true if list smaller than MAX', () => {
      const dropList = {
        data: [] as any[],
      } as unknown as CdkDropList;
      const result = component.maxSelectedFeaturesPredicate(
        undefined,
        dropList
      );

      expect(result).toBeTruthy();
    });
    test('should return false if list bigger than MAX', () => {
      const dropList = {
        data: [{}, {}, {}, {}, {}] as any[],
      } as unknown as CdkDropList;
      const result = component.maxSelectedFeaturesPredicate(
        undefined,
        dropList
      );

      expect(result).toBeFalsy();
    });
  });

  describe('itemReleased', () => {
    test('should display snack bar when max features selected', () => {
      component.selected = [
        { feature: { feature: '1' } as FeatureParams, selected: true },
        { feature: { feature: '2' } as FeatureParams, selected: true },
        { feature: { feature: '3' } as FeatureParams, selected: true },
        { feature: { feature: '4' } as FeatureParams, selected: true },
      ];
      snackBar.open = jest.fn();

      component.itemReleased();

      expect(snackBar.open).toHaveBeenCalled();
    });

    test('should display snack bar when more than max features selected', () => {
      component.selected = [
        { feature: { feature: '1' } as FeatureParams, selected: true },
        { feature: { feature: '2' } as FeatureParams, selected: true },
        { feature: { feature: '3' } as FeatureParams, selected: true },
        { feature: { feature: '4' } as FeatureParams, selected: true },
      ];
      snackBar.open = jest.fn();

      component.itemReleased();

      expect(snackBar.open).toHaveBeenCalled();
    });

    test('should not display snack bar when less than max features selected', () => {
      component.selected = [
        { feature: { feature: '1' } as FeatureParams, selected: true },
        { feature: { feature: '2' } as FeatureParams, selected: true },
        { feature: { feature: '3' } as FeatureParams, selected: true },
      ];
      snackBar.open = jest.fn();

      component.itemReleased();

      expect(snackBar.open).not.toHaveBeenCalled();
    });
  });
});
