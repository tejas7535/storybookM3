import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

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
      component['dialog'].open = jest.fn();

      component.openDialog();

      expect(component['dialog'].open).toHaveBeenCalledWith(
        FeaturesDialogComponent,
        expect.objectContaining({ data: expect.anything() })
      );
    });
  });
});
