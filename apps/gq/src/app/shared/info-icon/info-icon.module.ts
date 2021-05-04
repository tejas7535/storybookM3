import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { InfoIconComponent } from './info-icon.component';

@NgModule({
  declarations: [InfoIconComponent],
  imports: [CommonModule, MatMenuModule, MatIconModule],
  exports: [InfoIconComponent],
})
export class InfoIconModule {}
