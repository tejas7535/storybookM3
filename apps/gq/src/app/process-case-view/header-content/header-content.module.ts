import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { InfoIconModule } from '../../shared/info-icon/info-icon.module';
import { HeaderContentComponent } from './header-content.component';

@NgModule({
  declarations: [HeaderContentComponent],
  imports: [
    InfoIconModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  exports: [HeaderContentComponent],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'process-case-view' }],
})
export class HeaderContentModule {}
