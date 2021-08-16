import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { patchParameters } from './../core/store/actions/parameters/parameters.action';
import { ParameterState } from './../core/store/reducers/parameter/parameter.reducer';
import { getSelectedBearing } from './../core/store/selectors/bearing/bearing.selector';

@Component({
  selector: 'ga-parameters',
  templateUrl: './parameters.component.html',
})
export class ParametersComponent implements OnInit, OnDestroy {
  public radial = new FormControl(0, [
    Validators.max(1_000_000_000),
    Validators.min(0),
    Validators.required,
  ]);
  public axial = new FormControl(0, [
    Validators.max(1_000_000_000),
    Validators.min(0),
    Validators.required,
  ]);

  public loadsForm = new FormGroup({
    radial: this.radial,
    axial: this.axial,
  });

  form = new FormGroup({
    loads: this.loadsForm,
  });

  public selectedBearing$: Observable<string>;

  private readonly destroy$ = new Subject<void>();

  public constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {}

  public ngOnInit(): void {
    this.selectedBearing$ = this.store.select(getSelectedBearing);

    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((parameters: ParameterState) => {
        if (this.form.valid) {
          this.store.dispatch(patchParameters({ parameters }));
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public navigateBack(): void {
    this.router.navigate(['/bearing']);
  }
}
