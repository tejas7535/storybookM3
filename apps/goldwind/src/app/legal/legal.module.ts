import { NgModule } from '@angular/core';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';

import { SharedModule } from '../shared/shared.module';
import { DataPrivacyComponent } from './data-privacy/data-privacy.component';
import { LegalComponent } from './legal.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { LegalRoutingModule } from './legal-routing.module';
import { TermsComponent } from './terms/terms.component';
@NgModule({
  declarations: [
    LegalComponent,
    TermsComponent,
    DataPrivacyComponent,
    LegalNoticeComponent,
  ],
  imports: [LegalRoutingModule, SharedModule, BreadcrumbsModule],
})
export class LegalModule {}
