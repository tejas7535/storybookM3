import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { LegalRoutingModule } from './legal-routing.module';
import { LegalComponent } from './legal.component';
import { TermsComponent } from './terms/terms.component';
import { DataPrivacyComponent } from './data-privacy/data-privacy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
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
