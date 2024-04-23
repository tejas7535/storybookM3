import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { hasIdTokenRoles } from '@schaeffler/azure-auth';

import {
  integratedApps,
  linkedApps,
  links,
} from '@mac/feature/overview/constants';
import { changeFavicon } from '@mac/shared/change-favicon';
import { BreadcrumbsService } from '@mac/shared/services';

@Component({
  selector: 'mac-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  public integratedApps = integratedApps;
  public linkedApps = linkedApps;
  public links = links;

  public $breadcrumbs = this.breadcrumbsService.currentBreadcrumbs;

  public constructor(
    private readonly appInsightsService: ApplicationInsightsService,
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly applicationInsightService: ApplicationInsightsService,
    private readonly store: Store,
    private readonly translocoService: TranslocoService
  ) {}

  public ngOnInit(): void {
    this.applicationInsightService.logEvent('[MAC - Overview] opened');
    changeFavicon(
      'assets/favicons/overview.ico',
      this.translocoService.translate('title')
    );
    this.breadcrumbsService.updateBreadcrumb('');
  }

  public trackByFn(index: number): number {
    return index;
  }

  public trackCall(elementName: string): void {
    this.appInsightsService.logEvent(`[MAC] - user calls: (${elementName})`);
  }

  public hasRequiredRoles(requiredRoles?: string[]): Observable<boolean> {
    if (!requiredRoles || requiredRoles.length === 0) {
      return of(true);
    }

    return this.store.pipe(hasIdTokenRoles(requiredRoles));
  }
}
