import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TRANSLOCO_SCOPE } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { EditFeatureSelectionComponent } from './edit-feature-selection.component';

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
