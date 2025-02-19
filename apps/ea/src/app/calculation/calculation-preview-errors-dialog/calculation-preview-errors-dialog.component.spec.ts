import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';

import { CalculationPreviewErrorsItemComponent } from '../calculation-preview-errors-item/calculation-preview-errors-item.component';
import { CalculationPreviewErrorsDialogComponent } from './calculation-preview-errors-dialog.component';

describe('CalculationPreviewErrorsDialogComponent', () => {
  let spectator: Spectator<CalculationPreviewErrorsDialogComponent>;
  const createComponent = createComponentFactory({
    component: CalculationPreviewErrorsDialogComponent,
    imports: [
      MatIconTestingModule,
      MockComponent(CalculationPreviewErrorsItemComponent),
    ],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          title: 'Calculation Errors',
          downstreamPreviewItems: [
            { title: 'emissions' },
            { title: 'frictionalPowerloss' },
          ],
          downstreamErrors: ['Downstream Error 1'],
          catalogPreviewItems: [{ title: 'otherItem' }],
          catalogErrors: ['Error 1', 'Error 2'],
        },
      },
      {
        provide: MatDialogRef,
        useValue: {
          close: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display the title', () => {
    const title = spectator.query('.text-title-large p');
    expect(title).toHaveText('Calculation Errors');
  });

  it('should display downstream preview items', () => {
    const previewItems = spectator.query(CalculationPreviewErrorsItemComponent);

    expect(previewItems.previewItems).toEqual([
      { title: 'emissions' },
      { title: 'frictionalPowerloss' },
    ]);

    expect(previewItems.errors).toEqual(['Downstream Error 1']);
  });

  it('should close the dialog when closeDialog is called', () => {
    spectator.component.closeDialog();
    const dialogRef = spectator.inject(MatDialogRef);
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
