import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ShareButtonComponent } from './share-button.component';
import { ShareButtonDirective } from './share-button.directive';

@NgModule({
  declarations: [ShareButtonComponent, ShareButtonDirective],
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [ShareButtonComponent, ShareButtonDirective],
})
export class ShareButtonModule {}
