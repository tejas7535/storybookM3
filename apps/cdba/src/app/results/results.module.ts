import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ReferenceTypesTableModule } from './reference-types-table/reference-types-table.module';
import { ResultsComponent } from './results.component';
import { ResultsRoutingModule } from './results-routing.module';

@NgModule({
  declarations: [ResultsComponent],
  imports: [
    PushPipe,
    SharedTranslocoModule,
    SubheaderModule,
    ResultsRoutingModule,
    ReferenceTypesTableModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'results' }],
})
export class ResultsModule {}
