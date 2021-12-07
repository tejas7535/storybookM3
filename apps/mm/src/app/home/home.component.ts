import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import {
  map,
  pairwise,
  startWith,
  Subject,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

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
  bearingMembers,
  bearingSeatMembers,
  calculationOptionsMembers,
  IDMM_MEASSURING_METHOD,
  IDMM_MOUNTING_METHOD,
  measuringAndMountingMembers,
  PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS,
  PAGE_MOUNTING_MANAGER_SEAT,
  PAGE_RESULT,
  PROPERTY_PAGE_MOUNTING,
  PROPERTY_PAGE_MOUNTING_SITUATION,
  PROPERTY_PAGE_MOUNTING_SITUATION_SUB,
  RSY_BEARING,
  RSY_BEARING_SERIES,
  RSY_BEARING_TYPE,
  RSY_PAGE_BEARING_TYPE,
} from '../shared/constants/dialog-constant';
import {
  FormValue,
  FormValueProperty,
} from './../shared/models/home/form-value.model';
import { HomeStore } from './home.component.store';
import { PagedMeta } from './home.model';
import { ResultPageComponent } from './result-page/result-page.component';

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
  public readonly RSY_BEARING_SERIES = RSY_BEARING_SERIES;
  public readonly RSY_BEARING = RSY_BEARING;
  public readonly IDMM_MEASSURING_METHOD = IDMM_MEASSURING_METHOD;
  public readonly IDMM_MOUNTING_METHOD = IDMM_MOUNTING_METHOD;
  public readonly PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS =
    PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS;

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
  public manualBearing = false;

  public readonly pagedMetas$ = this.homeStore.pagedMetas$;
  public readonly activePageId$ = this.homeStore.activePageId$;
  public readonly activePageName$ = this.homeStore.activePageName$;
  public readonly maxPageId$ = this.homeStore.maxPageId$;
  public readonly inactivePageId$ = this.homeStore.inactivePageId$;
  public readonly activeBearing$ = this.homeStore.activeBearing$;
  public readonly bearingParams$ = this.homeStore.bearingParams$;
  public readonly selectedBearingOption$ =
    this.homeStore.selectedBearingOption$;

  private readonly destroy$ = new Subject<void>();

  private initialNestedMetas: NestedPropertyMeta[];

  private initialFormValue: FormValue;
  private initialPageId: string = RSY_PAGE_BEARING_TYPE;
  private form: FormGroup;

  @ViewChild('stepper') private readonly stepper: PagesStepperComponent;
  @ViewChild('resultPage') private readonly resultPage: ResultPageComponent;
  @ViewChildren('inBoxControl')
  public readonly inBoxTemplates: TemplateRef<any>[];

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
    // eslint-disable-next-line unicorn/no-useless-undefined
    this.homeStore.setBearing(undefined);
    this.getBearingRelations(id);
    this.handleActivePageIdChange(PAGE_MOUNTING_MANAGER_SEAT);
  }

  public dynamicFormLoaded({ nestedMetas, form }: DynamicFormTemplateContext) {
    this.initialNestedMetas = nestedMetas;
    this.form = form;
    this.initialFormValue = form.value;
    this.form.valueChanges
      .pipe(
        startWith(false),
        pairwise(),
        withLatestFrom(this.activePageId$, this.pagedMetas$)
      )
      .subscribe(
        ([[prev, next], activePageId, pagedMetas]: [
          [FormValue, FormValue],
          any,
          PagedMeta[]
        ]) => {
          if (
            activePageId === PROPERTY_PAGE_MOUNTING_SITUATION ||
            activePageId === PAGE_RESULT ||
            !prev ||
            !next
          ) {
            return;
          }
          this.resetFormValue(prev, next);
          this.checkTriggerNext(activePageId, pagedMetas);
        }
      );

    this.homeStore.setPageMetas(nestedMetas);
  }

  public checkTriggerNext(activePageId: string, pagedMetas: PagedMeta[]): void {
    const currentPagedMeta: PagedMeta = pagedMetas.find(
      (pagedMeta: PagedMeta) => pagedMeta.page.id === activePageId
    );

    if (
      currentPagedMeta &&
      (currentPagedMeta.page.id === PAGE_MOUNTING_MANAGER_SEAT ||
        currentPagedMeta.page.id ===
          PAGE_MOUNTING_MANAGER_MEASURING_MOUTING_METHODS)
    ) {
      currentPagedMeta.valid$.pipe(take(1)).subscribe((valid: any) => {
        if (valid) {
          this.next(currentPagedMeta.page.id, pagedMetas, this.stepper);
          if (this.stepper.hasResultNext) {
            this.resultPage.send(this.form);
          }
        }
      });
    }
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

  private resetFormValue(prev: FormValue, next: FormValue): void {
    if (prev === next) {
      return;
    }
    const prevProperties = prev.objects[0].properties;
    const nextProperties = next.objects[0].properties;
    const changedProperty = nextProperties.find(
      (property: FormValueProperty) => {
        const prevValue = prevProperties.find(
          (prevProperty) => prevProperty.name === property.name
        );

        return prevValue && property.value !== prevValue.value;
      }
    );

    const resetMembers: string[] = [];

    if (!changedProperty) {
      return;
    }

    switch (true) {
      case bearingMembers.includes(changedProperty.name):
        resetMembers.push(
          ...bearingSeatMembers,
          ...measuringAndMountingMembers,
          ...calculationOptionsMembers
        );
        break;
      case bearingSeatMembers.includes(changedProperty.name):
        resetMembers.push(
          ...measuringAndMountingMembers,
          ...calculationOptionsMembers
        );
        break;
      case measuringAndMountingMembers.includes(changedProperty.name):
        resetMembers.push(...calculationOptionsMembers);
        break;
      default:
        break;
    }

    (this.form.get('objects.0.properties') as FormArray).controls
      .map((control) => control as FormGroup)
      .map((control: FormGroup) => {
        const initialValue = control.get('initialValue').value;
        const name = control.get('name');
        if (resetMembers.includes(name.value)) {
          control
            .get('value')
            .patchValue(initialValue, { onlySelf: false, emitEvent: false });
          control.get('value').markAsPristine();
          control.get('value').markAsUntouched();
        }
      });
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

  public hasHeadline(pageId?: string, memberId?: string): boolean {
    const noHeadlineIds = new Set([
      RSY_BEARING_TYPE,
      IDMM_MOUNTING_METHOD,
      PAGE_MOUNTING_MANAGER_SEAT,
      PROPERTY_PAGE_MOUNTING_SITUATION_SUB,
      PROPERTY_PAGE_MOUNTING,
    ]);
    if (noHeadlineIds.has(pageId) || noHeadlineIds.has(memberId)) {
      return false;
    }

    return true;
  }

  public measuringMethodSet(): boolean {
    const currentValue: FormValue = this.form.value;
    const measuringMethodProperty = currentValue.objects[0].properties.find(
      (property: FormValueProperty) => property.name === IDMM_MEASSURING_METHOD
    );

    return measuringMethodProperty.value ? true : false;
  }
}
