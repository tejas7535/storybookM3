import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { combineLatest, defer, merge, of, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import {
  DynamicFormTemplateContext,
  Model,
  NestedPropertyMeta,
  VariablePropertyMeta,
} from '@caeonline/dynamic-forms';

import { environment } from '../../environments/environment';
import { DIALOG } from '../../mock';
import { MMLocales } from '../core/services/locale/locale.enum';
import { LocaleService } from '../core/services/locale/locale.service';
import { MMSeparator } from '../core/services/locale/separator.enum';
import { PagesStepperComponent } from '../pages-stepper/pages-stepper.component';
import { ModelTransformer } from '../services/model-transformer.service';
import {
  PAGE_MOUNTING_MANAGER_SEAT,
  PROPERTY_PAGE_MOUNTING,
  PROPERTY_PAGE_MOUNTING_SITUATION,
  PROPERTY_PAGE_MOUNTING_SITUATION_SUB,
  RSY_BEARING,
  RSY_BEARING_SERIES,
  RSY_BEARING_TYPE,
  RSY_PAGE_BEARING_TYPE,
} from '../shared/constants/dialog-constant';
import { HomeStore } from './home.component.store';
import { PagedMeta } from './home.model';

// TODO use ComponentStore
@Component({
  selector: 'mm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ModelTransformer, HomeStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  public readonly PROPERTY_PAGE_MOUNTING = PROPERTY_PAGE_MOUNTING;

  public readonly RSY_PAGE_BEARING_TYPE = RSY_PAGE_BEARING_TYPE;

  public readonly PROPERTY_PAGE_MOUNTING_SITUATION_SUB =
    PROPERTY_PAGE_MOUNTING_SITUATION_SUB;

  public dialog = DIALOG;

  public model: Model = {
    rootObject: {
      id: '',
      type: '',
      properties: [],
      children: [],
    },
  };

  public object = this.model.rootObject;

  public readonly pagedMetas$ = this.homeStore.pagedMetas$;

  public readonly activePageId$ = this.homeStore.activePageId$;

  public readonly activePageName$ = this.homeStore.activePageName$;

  public readonly maxPageId$ = this.homeStore.maxPageId$;

  public readonly inactivePageId$ = this.homeStore.inactivePageId$;

  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly http: HttpClient,
    private readonly cdRef: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly homeStore: HomeStore,
    private readonly localService: LocaleService
  ) {}

  public ngOnInit(): void {
    this.handleRouteParams();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public selectBearing(id: string): void {
    this.getBearingRelations(id);
  }

  // Todo move to effect
  public dynamicFormLoaded({ nestedMetas }: DynamicFormTemplateContext) {
    const pagedMetas = nestedMetas
      .map((nestedMeta) => ({
        parent: nestedMeta,
        metas: this.extractMembers(nestedMeta),
      }))
      .map(({ parent, metas }) => {
        const controls = metas.map(
          (meta) =>
            (meta.control.get('value') as FormControl) || new FormControl({})
        );

        controls.forEach((control) => {
          // WARNING this removes all validators already set by dynamic forms (e.g. min/max)
          // if you need min/max validators, implement valid$ here to react to value changes
          // and check if all controls have a proper value (not null or '' ...)
          control.setValidators(Validators.required);
          control.updateValueAndValidity();
        });

        const valid$ =
          controls.length > 0
            ? combineLatest(
                controls.map((control) =>
                  merge(
                    defer(() => of(control.status)),
                    control.statusChanges
                  )
                )
              ).pipe(
                map((isValids) =>
                  isValids.every((isValid) =>
                    ['VALID', 'DISABLED'].includes(isValid)
                  )
                )
              )
            : of(true); // return true if there are no controls like for result page

        return { ...parent, metas, controls, valid$ };
      });

    this.homeStore.setPageMetas(pagedMetas);
  }

  public next(
    currentPageId: string,
    pagedMetas: PagedMeta[],
    stepper: PagesStepperComponent
  ): void {
    const currentIndex = pagedMetas.findIndex(
      (meta) => meta.page.id === currentPageId
    );
    if (currentIndex < 0) {
      return;
    }
    const nextPage = pagedMetas[currentIndex + 1];
    if (!nextPage) {
      return;
    }

    stepper.next();
  }

  public isCalculationOptions(pageID: string) {
    return pageID === PROPERTY_PAGE_MOUNTING_SITUATION;
  }

  private handleRouteParams(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ id, language, separator }: Params): void => {
        if (id) {
          // Todo handling of wrong IDs and inital 404 call
          // could be done by httpInterceptor
          this.selectBearing(id);
          this.homeStore.setActivePageId(PAGE_MOUNTING_MANAGER_SEAT);
          this.homeStore.setInactivePageId(RSY_PAGE_BEARING_TYPE);
        }
        if (language) {
          this.localService.setLocale(language as MMLocales);
        }
        if (separator) {
          this.localService.setSeparator(
            separator === 'comma' ? MMSeparator.Comma : MMSeparator.Point
          );
        }
      });
  }

  private getBearingRelations(id: string): void {
    const requestUrl = `${environment.apiMMBaseUrl}${environment.bearingRelationsPath}${id}`;

    this.http
      .get<any>(requestUrl)
      .pipe(
        map((response) => response.data),
        tap((data: any) => {
          const model: Model = {
            rootObject: {
              id: '',
              type: '',
              children: [],
              properties: [
                {
                  name: RSY_BEARING_TYPE,
                  value: +data.type.data.id,
                },
                {
                  name: RSY_BEARING_SERIES,
                  value: data.series.data.id,
                },
                {
                  name: RSY_BEARING,
                  value: data.bearing.data.id,
                },
              ],
            },
          };
          this.model = model;
          this.object = this.model.rootObject;

          this.cdRef.markForCheck();
        })
      )
      .subscribe();
  }

  private extractMembers(
    nestedMeta: NestedPropertyMeta
  ): VariablePropertyMeta[] {
    const parentMetas = nestedMeta.metas as VariablePropertyMeta[];
    // eslint-disable-next-line unicorn/prefer-array-flat
    const childMetas = nestedMeta.children
      .map((child) => this.extractMembers(child))
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((flat, curr) => [...flat, ...curr], []);

    return [...parentMetas, ...childMetas];
  }
}
