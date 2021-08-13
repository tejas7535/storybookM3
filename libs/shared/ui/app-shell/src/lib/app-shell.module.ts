import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslocoModule } from '@ngneat/transloco';

import { AppShellComponent } from './components/app-shell/app-shell.component';
import { UserPanelComponent } from './components/user-panel/user-panel.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  declarations: [AppShellComponent, UserPanelComponent],
  exports: [AppShellComponent],
})
export class AppShellModule {}
