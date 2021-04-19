import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PictureCardModule } from '@schaeffler/picture-card';

import { PictureCardListComponent } from './picture-card-list.component';

@NgModule({
  declarations: [PictureCardListComponent],
  imports: [CommonModule, PictureCardModule],
  exports: [PictureCardListComponent],
})
export class PictureCardListModule {}
