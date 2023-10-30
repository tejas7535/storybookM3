import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { EditFeatureSelectionComponent } from './edit-feature-selection.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@NgModule({
  declarations: [EditFeatureSelectionComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  exports: [EditFeatureSelectionComponent],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'attrition-analytics' }],
})
export class EditFeatureSelectionModule {}
