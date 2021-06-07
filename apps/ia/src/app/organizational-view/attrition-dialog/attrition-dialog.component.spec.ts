import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { IconsModule } from '@schaeffler/icons';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { AttritionDialogLineChartComponent } from './attrition-dialog-line-chart/attrition-dialog-line-chart.component';
import { AttritionDialogMetaComponent } from './attrition-dialog-meta/attrition-dialog-meta.component';
import { AttritionDialogComponent } from './attrition-dialog.component';

describe('AttritionDialogComponent', () => {
  let component: AttritionDialogComponent;
  let spectator: Spectator<AttritionDialogComponent>;

  const createComponent = createComponentFactory({
    component: AttritionDialogComponent,
    declarations: [
      AttritionDialogMetaComponent,
      AttritionDialogLineChartComponent,
    ],
    imports: [
      MatDialogModule,
      MatButtonModule,
      IconsModule,
      MatIconModule,
      MatDividerModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    detectChanges: false,
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },
      provideMockStore({}),
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
