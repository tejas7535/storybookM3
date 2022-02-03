import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CompareButtonComponent } from './compare-button.component';

@NgModule({
  imports: [MatButtonModule, SharedTranslocoModule, ReactiveComponentModule],
  declarations: [CompareButtonComponent],
  exports: [CompareButtonComponent],
})
export class CompareButtonModule {}
