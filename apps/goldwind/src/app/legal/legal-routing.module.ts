import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LegalComponent } from './legal.component';
import { TermsComponent } from './terms/terms.component';
import { LegalPath } from './legal-route-path.enum';
import { DataPrivacyComponent } from './data-privacy/data-privacy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
const routes: Routes = [
  {
    path: '',
    component: LegalComponent,
    children: [
      {
        path: LegalPath.TermsPath,
        component: TermsComponent,
      },
      {
        path: LegalPath.DataprivacyPath,
        component: DataPrivacyComponent,
      },
      {
        path: LegalPath.LegalNoticePath,
        component: LegalNoticeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalRoutingModule {}
