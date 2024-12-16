import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { UserInteractionEffects } from '@cdba/core/store';
import { userInteractionReducer } from '@cdba/core/store/reducers/user-interaction/user-interaction.reducer';

import { UserInteractionComponent } from './user-interaction.component';

@NgModule({
  declarations: [UserInteractionComponent],
  exports: [UserInteractionComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    SharedTranslocoModule,
    StoreModule.forFeature('user-interaction', userInteractionReducer),
    EffectsModule.forFeature([UserInteractionEffects]),
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'user-interaction' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },
  ],
})
export class UserInteractionModule {}
