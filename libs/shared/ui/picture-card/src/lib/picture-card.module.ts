import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { PictureCardActionComponent } from './picture-card-action/picture-card-action.component';
import { PictureCardComponent } from './picture-card.component';

@NgModule({
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  entryComponents: [PictureCardComponent],
  declarations: [PictureCardComponent, PictureCardActionComponent],
  exports: [PictureCardComponent, PictureCardActionComponent],
})
export class PictureCardModule {}
