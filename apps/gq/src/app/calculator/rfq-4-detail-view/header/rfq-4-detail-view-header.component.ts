import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';

import { map, Observable } from 'rxjs';

import { CustomerSubheaderContentComponent } from '@gq/shared/components/header/customer-subheader-content/customer-subheader-content.component';
import { Customer, TagType } from '@gq/shared/models';
import { BreadcrumbsService } from '@gq/shared/services/breadcrumbs/breadcrumbs.service';
import { PushPipe } from '@ngrx/component';

import { Breadcrumb } from '@schaeffler/breadcrumbs';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { TagComponent } from '@schaeffler/tag';
import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-rfq-4-detail-view-header',
  imports: [
    CommonModule,
    PushPipe,
    SharedTranslocoModule,
    SubheaderModule,
    CustomerSubheaderContentComponent,
    TagComponent,
    MatButtonModule,
    ShareButtonModule,
    MatButtonModule,
  ],
  templateUrl: './rfq-4-detail-view-header.html',
})
export class Rfq4DetailViewHeaderComponent {
  breadcrumbsService = inject(BreadcrumbsService);
  activatedRoute = inject(ActivatedRoute);

  // ToDo: Adjust data source
  rfqId: string;
  customer: Customer = {
    identifier: { customerId: '2004', salesOrg: '0267' },
    country: 'DE',
    name: 'ABG Allgemeine Baumaschinen GmbH',
  } as Customer;
  tagType: TagType = TagType.NEUTRAL;

  breadcrumbs$: Observable<Breadcrumb[]> =
    this.activatedRoute.queryParamMap.pipe(
      map((params) => {
        this.rfqId = params.get('rfqId');

        return this.breadcrumbsService.getRfqDetailViewBreadcrumbs(this.rfqId);
      })
    );
}
