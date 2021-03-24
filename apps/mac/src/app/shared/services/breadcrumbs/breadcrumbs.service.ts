import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RouteNames, RoutePath } from '../../../app-routing.enum';
import { Breadcrumb } from '../../components/breadcrumbs/breadcrumb.model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  constructor() {}

  private breadcrumbs: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject([]);

  public currentBreadcrumbs: Observable<
    Breadcrumb[]
  > = this.breadcrumbs.asObservable();

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
