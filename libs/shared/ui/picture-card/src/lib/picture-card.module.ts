import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

import { PictureCardComponent } from './picture-card.component';
import { PictureCardActionComponent } from './picture-card-action/picture-card-action.component';

@NgModule({
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  declarations: [PictureCardComponent, PictureCardActionComponent],
  exports: [PictureCardComponent, PictureCardActionComponent],
})
export class PictureCardModule {}
