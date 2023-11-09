import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

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
