import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { merge, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { translate } from '@ngneat/transloco';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { Breadcrumb } from '@schaeffler/breadcrumbs';

import { AppRoutePath } from '@cdba/app-route-path.enum';
import {
  getMaterialDesignation,
  getMaterialDesignationOfSelectedRefType,
  getResultCount,
} from '@cdba/core/store';
import { getEnv } from '@cdba/environments/environment.provider';
import { ScrambleMaterialDesignationPipe } from '@cdba/shared/pipes';

export interface BreadcrumbState {
  search: Breadcrumb;
  results: Breadcrumb;
  detail: Breadcrumb;
  compare: Breadcrumb;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService extends ComponentStore<BreadcrumbState> {
  scrambleMaterialDesignationPipe: ScrambleMaterialDesignationPipe =
    new ScrambleMaterialDesignationPipe(getEnv());

  public constructor(
    private readonly router: Router,
    private readonly store: Store,
    private readonly activatedRoute: ActivatedRoute
  ) {
    super({
      search: {
        label: translate('shared.breadcrumbs.search'),
        url: '/search',
        queryParams: undefined,
      },
      results: undefined,
      detail: undefined,
      compare: undefined,
    });

    this.resultsBreadcrumb$.subscribe((resultsBreadcrumb) =>
      this.setResultsBreadcrumb(resultsBreadcrumb)
    );

    this.detailBreadcrumbs$.subscribe((detailBreadcrumb) =>
      this.setDetailBreadcrumb(detailBreadcrumb)
    );

    this.materialDesignation$.subscribe((materialDesignation) =>
      this.updateMaterialDesignation(materialDesignation)
    );

    this.compareBreadcrumbs$.subscribe((compareBreadcrumb) =>
      this.setCompareBreadcrumb(compareBreadcrumb)
    );
  }

  private readonly routeProps$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => ({
      url: this.router.routerState.snapshot.url.split('?')[0],
      queryParams: this.activatedRoute.snapshot.queryParams,
    }))
  );

  private readonly resultsBreadcrumb$: Observable<Breadcrumb> =
    this.routeProps$.pipe(
      filter((route) => route.url.includes(AppRoutePath.ResultsPath)),
      concatLatestFrom(() => this.store.select(getResultCount)),
      map(([{ url, queryParams }, resultCount]) => ({
        url,
        queryParams,
        label: `${translate('shared.breadcrumbs.results')} (${resultCount})`,
      }))
    );

  private readonly detailBreadcrumbs$: Observable<Breadcrumb> =
    this.routeProps$.pipe(
      filter((route) =>
        route.url.split('/')[1].includes(AppRoutePath.DetailPath)
      ),
      concatLatestFrom(() => this.materialDesignation$),
      map(([{ url, queryParams }, materialDesignation]) => ({
        url,
        queryParams,
        label: materialDesignation
          ? this.scrambleMaterialDesignationPipe.transform(
              materialDesignation,
              0
            )
          : translate('shared.breadcrumbs.detail'),
      }))
    );

  private readonly materialDesignation$: Observable<string> = merge(
    this.store.select(getMaterialDesignation),
    this.store.select(getMaterialDesignationOfSelectedRefType)
  ).pipe(distinctUntilChanged());

  private readonly compareBreadcrumbs$: Observable<Breadcrumb> =
    this.routeProps$.pipe(
      filter((route) =>
        route.url.split('/')[1].includes(AppRoutePath.ComparePath)
      ),
      map(({ url, queryParams }) => ({
        url,
        queryParams,
        label: translate('shared.breadcrumbs.compare'),
      }))
    );

  public readonly breadcrumbs$: Observable<Breadcrumb[]> = this.select(
    (state) => {
      const breadcrumbs = [
        state.search,
        state.results,
        state.detail,
        state.compare,
      ].filter((elem) => elem !== undefined);

      const lastElement: Breadcrumb = { ...breadcrumbs.pop() };
      lastElement.url = undefined;

      return [...breadcrumbs, lastElement];
    }
  );

  public readonly setResultsBreadcrumb = this.updater(
    (state, resultsBreadcrumb: Breadcrumb): BreadcrumbState => ({
      ...state,
      detail: undefined,
      compare: undefined,
      results: resultsBreadcrumb,
    })
  );

  public readonly setDetailBreadcrumb = this.updater(
    (state, detailBreadcrumb: Breadcrumb): BreadcrumbState => {
      const detail = !state.detail
        ? detailBreadcrumb
        : { ...detailBreadcrumb, label: state.detail.label };

      return {
        ...state,
        detail,
        compare: undefined,
      };
    }
  );

  public readonly updateMaterialDesignation = this.updater(
    (state, materialDesignation: string): BreadcrumbState => {
      if (!state.detail) {
        return state;
      }

      return {
        ...state,
        detail: {
          ...state.detail,
          label: this.scrambleMaterialDesignationPipe.transform(
            materialDesignation,
            0
          ),
        },
      };
    }
  );

  public readonly setCompareBreadcrumb = this.updater(
    (state, compareBreadcrumb: Breadcrumb): BreadcrumbState => ({
      ...state,
      compare: compareBreadcrumb,
    })
  );
}
