import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { BehaviorSubject, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import { RouteNames } from '../../app-routing.enum';
import { changeFavicon } from '../../shared/change-favicon';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs/breadcrumbs.service';
import { HardnessConverterApiService } from './services/hardness-converter-api.service';
import {
  HardnessConversionResponse,
  HardnessConversionSingleUnit,
  HardnessUnitsResponse,
} from './services/hardness-converter-response.model';

@Component({
  selector: 'mac-hardness-converter',
  templateUrl: './hardness-converter.component.html',
  styleUrls: ['./hardness-converter.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('.3s ease-out', style({ height: 50, opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: 50, opacity: 1 }),
        animate('.3s ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class HardnessConverterComponent implements OnInit {
  valueChange$ = new Subject();
  results$ = new Subject<HardnessConversionSingleUnit[]>();
  resultsUpToDate$ = new BehaviorSubject<boolean>(true);
  breadcrumbs$ = this.breadcrumbsService.currentBreadcrumbs;
  unitList: string[] = [];
  version: string;
  error: string;
  hardness = new FormGroup({
    unit: new FormControl(''),
    value: new FormControl(0),
  });

  public constructor(
    private readonly hardnessService: HardnessConverterApiService,
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly applicationInsightService: ApplicationInsightsService
  ) {}

  public ngOnInit(): void {
    this.applicationInsightService.logEvent('[MAC - HC] opened');
    changeFavicon(
      'assets/favicons/hardness-converter.ico',
      'Hardness Converter'
    );
    this.breadcrumbsService.updateBreadcrumb(RouteNames.HardnessConverter);
    this.setupUnitList();
    this.setupConversionResultStream();
  }

  private setupUnitList(): void {
    this.hardnessService
      .getUnits()
      .subscribe((response: HardnessUnitsResponse) => {
        this.unitList = response.units;
        this.version = response.version;
        const HV = response.units.find((unit) => unit === 'HV');
        this.hardness.patchValue({
          unit: HV ? HV : response.units[0],
        });
      });
  }

  private setupConversionResultStream(): void {
    this.valueChange$
      .pipe(
        switchMap(() => {
          this.resultsUpToDate$.next(false);

          return this.hardnessService.getConversionResult(
            this.hardness.get('unit').value,
            this.hardness.get('value').value
          );
        })
      )
      .subscribe((result: HardnessConversionResponse) => {
        if (result.error) {
          this.error = result.error;
        } else {
          this.results$.next(result.converted);
        }
        this.resultsUpToDate$.next(true);
      });
  }

  get step(): string {
    return this.hardness.get('unit').value === 'HRc' ? '.1' : '1';
  }

  handleKeyInput(key: string, value: string): void {
    if (
      Number.isInteger(Number.parseInt(key, 10)) ||
      key === 'Backspace' ||
      key === 'Delete'
    ) {
      this.convertValue(value);
    }
  }

  convertValue(val: string): void {
    if (val !== '') {
      this.error = undefined;
      this.valueChange$.next(val);
    }
  }

  getValue(result: HardnessConversionSingleUnit): number | string {
    if (result.unit === 'HRc' && result.value) {
      return (Math.round(result.value * 10) / 10).toLocaleString();
    }

    if (result.value) {
      return Math.round(result.value).toLocaleString();
    }

    return result.warning;
  }

  trackByFn(index: number): number {
    return index;
  }
}
