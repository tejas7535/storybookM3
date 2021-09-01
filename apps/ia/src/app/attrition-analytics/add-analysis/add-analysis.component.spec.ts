import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { FeatureSelector } from '../models/feature-selector.model';
import { AddAnalysisComponent } from './add-analysis.component';
import { FeaturesDialogComponent } from './features-dialog/features-dialog.component';
import { FeaturesDialogModule } from './features-dialog/features-dialog.module';

describe('AddAnalysisComponent', () => {
  let component: AddAnalysisComponent;
  let spectator: Spectator<AddAnalysisComponent>;

  const createComponent = createComponentFactory({
    component: AddAnalysisComponent,
    imports: [
      MatIconModule,
      FeaturesDialogModule,
      MatDialogModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openDialog', () => {
    test('should open dialog', () => {
      component.data = [];
      component['dialog'].open = jest.fn();
      component.emitResultOnClose = jest.fn();

      component.openDialog();

      expect(component['dialog'].open).toHaveBeenCalledWith(
        FeaturesDialogComponent,
        expect.objectContaining({ data: [] })
      );
      expect(component.emitResultOnClose).toHaveBeenCalledWith(
        component['dialog'].open(FeaturesDialogComponent, {
          data: component.data,
        })
      );
    });
  });

  describe('emitResultOnClose', () => {
    test('should emit result on close', () => {
      component.selectedFeatures.emit = jest.fn();
      const result = [new FeatureSelector('Age', true)];
      const dialogRef = {
        afterClosed: () => of(result),
      } as MatDialogRef<FeaturesDialogComponent>;

      component.emitResultOnClose(dialogRef);

      expect(component.selectedFeatures.emit).toHaveBeenCalledWith(result);
    });
  });
});
