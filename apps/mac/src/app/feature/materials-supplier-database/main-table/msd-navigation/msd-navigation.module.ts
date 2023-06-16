import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';

import { LetDirective, PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MsdNavigationComponent } from './msd-navigation.component';

@NgModule({
  declarations: [MsdNavigationComponent],
  imports: [
    CommonModule,
    MatListModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    PushPipe,
    LetDirective,
    SharedTranslocoModule,
  ],
  exports: [MsdNavigationComponent],
})
export class MsdNavigationModule {}
