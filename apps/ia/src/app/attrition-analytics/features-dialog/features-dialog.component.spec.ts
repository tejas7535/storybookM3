import * as dragAndDrop from '@angular/cdk/drag-drop';
import {
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';
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

  const data = [
    {
      name: 'Test',
      selected: true,
    },
    {
      name: 'Test 2',
      selected: false,
    },
  ];

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
      { provide: MAT_DIALOG_DATA, useValue: data },
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
      } as CdkDropList<string[]>;
      const event: CdkDragDrop<string[]> = {
        previousContainer: container,
        container,
        previousIndex: 0,
        currentIndex: 1,
      } as unknown as CdkDragDrop<string[]>;

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
      } as CdkDropList<string[]>;
      const previousContainer = {
        data: {},
      } as CdkDropList<string[]>;
      const event: CdkDragDrop<string[]> = {
        previousContainer,
        container,
        previousIndex: 0,
        currentIndex: 1,
      } as unknown as CdkDragDrop<string[]>;

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
      component.selected = [1, 2, 3, 4];
      snackBar.open = jest.fn();

      component.itemReleased();

      expect(snackBar.open).toHaveBeenCalled();
    });

    test('should display snack bar when more than max features selected', () => {
      component.selected = [1, 2, 3, 4, 5];
      snackBar.open = jest.fn();

      component.itemReleased();

      expect(snackBar.open).toHaveBeenCalled();
    });

    test('should not display snack bar when less than max features selected', () => {
      component.selected = [1, 2, 3];
      snackBar.open = jest.fn();

      component.itemReleased();

      expect(snackBar.open).not.toHaveBeenCalled();
    });
  });
});
