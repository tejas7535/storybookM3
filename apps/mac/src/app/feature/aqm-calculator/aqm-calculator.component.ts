import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { debounceTime, filter, map, ReplaySubject, Subscription } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { RouteNames } from '../../app-routing.enum';
import { changeFavicon } from '../../shared/change-favicon';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs/breadcrumbs.service';
import {
  AQMCalculationRequest,
  AQMCalculationResponse,
  AQMCompositionForm,
  AQMCompositionLimits,
  AQMLimit,
  AQMMaterial,
} from './models';
import { AqmCalculatorApiService } from './services/aqm-calculator-api.service';

@Component({
  selector: 'mac-aqm-calculator',
  templateUrl: './aqm-calculator.component.html',
  styleUrls: ['./aqm-calculator.component.scss'],
})
export class AqmCalculatorComponent implements OnInit, OnDestroy {
  materials: AQMMaterial[];

  aqmCalculationResult = new ReplaySubject<AQMCalculationResponse>();
  fetchingCalculation: boolean;

  breadcrumbs$ = this.breadcrumbsService.currentBreadcrumbs;

  materialInput = new FormControl<AQMMaterial>(undefined);

  compositionForm: FormGroup<AQMCompositionForm>;

  subscription = new Subscription();

  public constructor(
    private readonly aqmCalculationService: AqmCalculatorApiService,
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly applicationInsightService: ApplicationInsightsService,
    private readonly translocoService: TranslocoService
  ) {}

  public ngOnInit(): void {
    this.applicationInsightService.logEvent('[MAC - AQM] opened');
    this.breadcrumbsService.updateBreadcrumb(RouteNames.AQMCalculator);
    changeFavicon(
      'assets/favicons/aqm.ico',
      this.translocoService.translate('aqmCalculator.title')
    );
    this.subscription.add(
      this.aqmCalculationService
        .getMaterialsData()
        .pipe(filter(Boolean))
        .subscribe((result) => {
          this.materials = result.materials;
          this.createForm(result.compositionLimits);
          this.materialInput.setValue(this.materials[1]);
        })
    );

    this.subscription.add(
      this.materialInput.valueChanges.subscribe((v) => {
        if (v) {
          this.compositionForm.patchValue(v.data as AQMCalculationRequest);
          this.compositionForm.markAsDirty();
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public filterFn(option?: AQMMaterial, value?: string): boolean {
    if (!value) {
      return true;
    }

    return option?.title
      ?.toLowerCase()
      .trim()
      .includes(value.toLowerCase().trim());
  }

  private patchSelect(material?: AQMMaterial): void {
    if (material !== this.materialInput.value) {
      this.materialInput.patchValue(material, { emitEvent: false });
    }
  }

  private createForm(compositionLimits: AQMCompositionLimits): void {
    const controls: any = {};
    Object.entries(compositionLimits)
      .map((item) => ({
        key: item[0],
        limits: item[1] as AQMLimit,
      }))
      .map((item) => {
        controls[item.key] = new FormControl<number>(undefined, [
          Validators.required,
          Validators.min(item.limits.min),
          Validators.max(item.limits.max),
        ]);
      });
    this.compositionForm = new FormGroup<AQMCompositionForm>(controls);

    this.subscription.add(
      this.compositionForm.valueChanges
        .pipe(
          debounceTime(100),
          map((value) => value as AQMCalculationRequest)
        )
        .subscribe((value: AQMCalculationRequest) => {
          const material = this.findMaterial(value);
          this.patchSelect(material);

          this.aqmCalculationService
            .getCalculationResult(value)
            .subscribe((result) => this.aqmCalculationResult.next(result));
        })
    );
  }

  private findMaterial(composition: AQMCalculationRequest): AQMMaterial {
    return this.materials.find((material) => {
      if (
        material.data.c === composition.c &&
        material.data.si === composition.si &&
        material.data.mn === composition.mn &&
        material.data.cr === composition.cr &&
        material.data.mo === composition.mo &&
        material.data.ni === composition.ni
      ) {
        return true;
      }

      return false;
    });
  }
}
