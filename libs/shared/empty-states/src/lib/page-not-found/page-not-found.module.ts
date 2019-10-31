import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { TranslocoModule } from '@ngneat/transloco';

import { PageNotFoundComponent } from './page-not-found.component';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [FlexLayoutModule, TranslocoModule, RouterModule],
  exports: [PageNotFoundComponent]
})
export class PageNotFoundModule {}
