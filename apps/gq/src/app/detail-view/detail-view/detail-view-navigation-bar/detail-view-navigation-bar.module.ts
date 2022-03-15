import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DetailViewNavigationBarComponent } from './detail-view-navigation-bar.component';

@NgModule({
  declarations: [DetailViewNavigationBarComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [DetailViewNavigationBarComponent],
})
export class DetailViewNavigationBarModule {}
