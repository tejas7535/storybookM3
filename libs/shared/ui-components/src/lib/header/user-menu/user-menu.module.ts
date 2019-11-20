import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { UserMenuComponent } from './user-menu.component';

@NgModule({
  declarations: [UserMenuComponent],
  imports: [CommonModule, MatIconModule, MatMenuModule]
})
export class UserMenuModule {}
