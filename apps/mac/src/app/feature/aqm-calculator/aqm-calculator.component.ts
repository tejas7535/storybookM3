import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { RouteNames } from '../../app-routing.enum';
import { changeFavicon } from '../../shared/change-favicon';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs/breadcrumbs.service';
import { AqmCalculatorApiService } from './services/aqm-calculator-api.service';
import {
  AQMCalculationRequest,
  AQMCalculationResponse,
  AQMComposition,
  AQMCompositionLimits,
  AQMLimit,
  AQMMaterial,
  AQMSumLimits,
} from './services/aqm-calulator-response.model';

@Component({
  selector: 'mac-aqm-calculator',
  templateUrl: './aqm-calculator.component.html',
  styleUrls: ['./aqm-calculator.component.scss'],
})
export class AqmCalculatorComponent implements OnInit, OnDestroy {
  materials: AQMMaterial[];
  sumLimits: AQMSumLimits;

  aqmCalculationResult: Observable<AQMCalculationResponse>;
  fetchingCalculation: boolean;

  breadcrumbs$ = this.breadcrumbsService.currentBreadcrumbs;

  materialInput: FormControl = new FormControl();

  compositionForm: FormGroup = new FormGroup({});

  subscription = new Subscription();

  public constructor(
    private readonly aqmCalculationService: AqmCalculatorApiService,
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly applicationInsightService: ApplicationInsightsService
  ) {}

  public ngOnInit(): void {
    this.applicationInsightService.logEvent('[MAC - AQM] opened');
    this.breadcrumbsService.updateBreadcrumb(RouteNames.AQMCalculator);
    changeFavicon('assets/favicons/aqm.ico', 'AQM Calculator');
    this.subscription.add(
      this.aqmCalculationService.getMaterialsData().subscribe((result: any) => {
        this.materials = result.materials;
        this.sumLimits = result.sumLimits;
        this.createForm(result.compositionLimits);
        this.materialInput.setValue(this.materials[1]);
      })
    );

    this.subscription.add(
      this.materialInput.valueChanges.subscribe((v) => {
        if (v) {
          this.compositionForm.patchValue(v as AQMCalculationRequest);
          this.compositionForm.markAsDirty();
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private patchSelect(material?: AQMMaterial): void {
    if (material !== this.materialInput.value) {
      this.materialInput.patchValue(material);
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
        controls[item.key] = new FormControl('', [
          Validators.required,
          Validators.min(item.limits.min),
          Validators.max(item.limits.max),
        ]);
      });
    this.compositionForm = new FormGroup(controls);

    this.subscription.add(
      this.compositionForm.valueChanges.subscribe((value: any) => {
        const matIndex = this.findMaterialIndex(value);
        if (matIndex > -1) {
          this.patchSelect(this.materials[matIndex]);
        } else {
          this.patchSelect();
        }

        if (this.compositionForm.valid) {
          this.aqmCalculationResult =
            this.aqmCalculationService.getCalculationResult(value);
        }
      })
    );
  }

  private findMaterialIndex(composition: AQMComposition): number {
    return this.materials
      .map((material) => material as AQMComposition)
      .findIndex((knownComposition) => {
        if (
          knownComposition.c === composition.c &&
          knownComposition.si === composition.si &&
          knownComposition.mn === composition.mn &&
          knownComposition.cr === composition.cr &&
          knownComposition.mo === composition.mo &&
          knownComposition.ni === composition.ni
        ) {
          return true;
        }

        return false;
      });
  }

  public trackByFn(index: number): number {
    return index;
  }
}
