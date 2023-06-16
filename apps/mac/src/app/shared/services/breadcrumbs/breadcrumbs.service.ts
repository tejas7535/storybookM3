import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { RouteNames, RoutePath } from '@mac/app-routing.enum';
import { Breadcrumb } from '@mac/shared/components/breadcrumbs/breadcrumb.model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  readonly breadcrumbs: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject([]);

  public currentBreadcrumbs: Observable<Breadcrumb[]> =
    this.breadcrumbs.asObservable();

  updateBreadcrumb(label: string): void {
    this.breadcrumbs.next([
      {
        label: RouteNames.Base,
        link: `/${RoutePath.OverviewPath}`,
      },
      {
        label,
      },
    ]);
  }
}
