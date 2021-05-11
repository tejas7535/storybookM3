import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { IconsModule } from '@schaeffler/icons';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { AttritionDialogComponent } from './attrition-dialog.component';

describe('AttritionDialogComponent', () => {
  let component: AttritionDialogComponent;
  let spectator: Spectator<AttritionDialogComponent>;

  const createComponent = createComponentFactory({
    component: AttritionDialogComponent,
    declarations: [AttritionDialogComponent],
    imports: [
      MatDialogModule,
      MatButtonModule,
      IconsModule,
      MatIconModule,
      MatDividerModule,
      UnderConstructionModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    detectChanges: false,
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
