import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import {
  DynamicFormTemplateContext,
  Model,
  NestedPropertyMeta,
} from '@caeonline/dynamic-forms';

import { DIALOG } from '../../mock';
import { PagesStepperComponent } from '../core/components/pages-stepper/pages-stepper.component';
import {
  LocaleService,
  MMLocales,
  MMSeparator,
  ModelTransformer,
  RestService,
} from '../core/services';
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
  providers: [ModelTransformer, HomeStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  public readonly PROPERTY_PAGE_MOUNTING = PROPERTY_PAGE_MOUNTING;
  public readonly PAGE_MOUNTING_MANAGER_SEAT = PAGE_MOUNTING_MANAGER_SEAT;
  public readonly RSY_PAGE_BEARING_TYPE = RSY_PAGE_BEARING_TYPE;
  public readonly RSY_BEARING_TYPE = RSY_BEARING_TYPE;

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
  public readonly activeBearing$ = this.homeStore.activeBearing$;
  public readonly bearingParams$ = this.homeStore.bearingParams$;

  private readonly destroy$ = new Subject<void>();

  private initialNestedMetas: NestedPropertyMeta[];

  private initialFormValue: any;
  private initialPageId: string = RSY_PAGE_BEARING_TYPE;
  private form: FormGroup;

  public constructor(
    private readonly cdRef: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly localeService: LocaleService,
    private readonly restService: RestService,
    private readonly homeStore: HomeStore
  ) {}

  public ngOnInit(): void {
    this.handleRouteParams();
    this.localeService.language$.subscribe((lang: string) => {
      this.restService.setCurrentLanguage(lang);
      if (this.form) {
        this.resetForm();
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public selectBearing(id: string): void {
    this.getBearingRelations(id);
  }

  public dynamicFormLoaded({ nestedMetas, form }: DynamicFormTemplateContext) {
    this.initialNestedMetas = nestedMetas;
    this.form = form;
    this.initialFormValue = form.value;
    this.homeStore.setPageMetas(nestedMetas);
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

  public resetForm(): void {
    this.form.reset(this.initialFormValue);
    this.dynamicFormLoaded({
      nestedMetas: this.initialNestedMetas,
      form: this.form,
    } as DynamicFormTemplateContext);
    this.homeStore.setActivePageId(this.initialPageId);
  }

  private handleRouteParams(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ id, language, separator }: Params): void => {
        if (id) {
          // Todo handling of wrong IDs and inital 404 call
          // could be done by httpInterceptor
          this.selectBearing(id);
          this.initialPageId = PAGE_MOUNTING_MANAGER_SEAT;
          this.homeStore.setActivePageId(PAGE_MOUNTING_MANAGER_SEAT);
          this.homeStore.setInactivePageId(RSY_PAGE_BEARING_TYPE);
        }
        if (language) {
          this.localeService.setLocale(language as MMLocales);
        }
        if (separator) {
          this.localeService.setSeparator(
            separator === 'comma' ? MMSeparator.Comma : MMSeparator.Point
          );
        }
      });
  }

  private getBearingRelations(id: string): void {
    this.restService
      .getBearingRelations(id)
      .pipe(
        map((response: any) => response.data),
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

  public handleActivePageIdChange(id: string) {
    this.homeStore.setActivePageId(id);

    if (id !== RSY_PAGE_BEARING_TYPE) {
      this.homeStore.getBearing(this.bearingParams$);
    }
  }
}
