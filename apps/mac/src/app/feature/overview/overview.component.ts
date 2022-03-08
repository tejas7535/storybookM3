import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Store } from '@ngrx/store';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { hasIdTokenRoles } from '@schaeffler/azure-auth';

import { changeFavicon } from '../../shared/change-favicon';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs/breadcrumbs.service';
import { integratedApps, linkedApps, links } from './constants';

@Component({
  selector: 'mac-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  public title = 'Home';

  public integratedApps = integratedApps;
  public linkedApps = linkedApps;
  public links = links;

  public $breadcrumbs = this.breadcrumbsService.currentBreadcrumbs;

  public constructor(
    private readonly appInsightsService: ApplicationInsightsService,
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly applicationInsightService: ApplicationInsightsService,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.applicationInsightService.logEvent('[MAC - Overview] opened');
    changeFavicon('assets/favicons/overview.ico', 'Materials App Center');
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

    return this.store.select(hasIdTokenRoles(requiredRoles));
  }
}
