import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { OpenInTabComponent } from './open-in-tab/open-in-tab.component';
import { OpenInWindowComponent } from './open-in-window/open-in-window.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, SharedTranslocoModule],
  declarations: [OpenInTabComponent, OpenInWindowComponent],
  exports: [OpenInTabComponent, OpenInWindowComponent],
})
export class ContextMenuModule {}
