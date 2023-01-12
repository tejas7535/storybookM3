import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InfoIconModule } from '../../shared/components/info-icon/info-icon.module';
import { SharedDirectivesModule } from '../../shared/directives/shared-directives.module';
import { HeaderContentComponent } from './header-content.component';

@NgModule({
  declarations: [HeaderContentComponent],
  imports: [
    InfoIconModule,
    MatIconModule,
    MatButtonModule,
    SharedTranslocoModule,
    PushModule,
    ReactiveFormsModule,
    MatInputModule,
    SharedTranslocoModule,
    SharedDirectivesModule,
    CommonModule,
  ],
  exports: [HeaderContentComponent],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'process-case-view' }],
})
export class HeaderContentModule {}
