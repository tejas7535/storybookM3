import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared.module';
import { AttritionDialogComponent } from './attrition-dialog.component';

@NgModule({
  declarations: [AttritionDialogComponent],
  entryComponents: [AttritionDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    SharedTranslocoModule,
    IconsModule,
    MatIconModule,
    MatDividerModule,
    UnderConstructionModule,
  ],
  exports: [AttritionDialogComponent],
})
export class AttritionDialogModule {}
