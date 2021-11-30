import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PageHeaderModule } from '@cdba/shared/components';

import { ReferenceTypesTableModule } from './reference-types-table/reference-types-table.module';
import { ResultsRoutingModule } from './results-routing.module';
import { ResultsComponent } from './results.component';

@NgModule({
  declarations: [ResultsComponent],
  imports: [
    ReactiveComponentModule,
    SharedTranslocoModule,
    ResultsRoutingModule,
    PageHeaderModule,
    ReferenceTypesTableModule,
    BreadcrumbsModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'results' }],
})
export class ResultsModule {}
