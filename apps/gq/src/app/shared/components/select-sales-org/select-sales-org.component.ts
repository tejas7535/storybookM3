import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  forwardRef,
  inject,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { Observable, tap } from 'rxjs';

import { selectSalesOrg } from '@gq/core/store/actions';
import { SalesOrg } from '@gq/core/store/reducers/models';
import {
  getSalesOrgs,
  getSelectedSalesOrg,
} from '@gq/core/store/selectors/create-case/create-case.selector';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    SharedTranslocoModule,
    ReactiveFormsModule,
    LetDirective,
    PushPipe,
  ],
  selector: 'gq-select-sales-org',
  templateUrl: './select-sales-org.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectSalesOrgComponent),
      multi: true,
    },
  ],
})
export class SelectSalesOrgComponent implements ControlValueAccessor {
  @Output() salesOrgSelected: EventEmitter<SalesOrg> =
    new EventEmitter<SalesOrg>();
  private readonly store: Store = inject(Store);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  salesOrgs$: Observable<SalesOrg[]> = this.store.select(getSalesOrgs).pipe(
    takeUntilDestroyed(this.destroyRef),
    tap((salesOrgs) =>
      salesOrgs.length <= 1 || this.disabledByParent
        ? this.salesOrgFormControl.disable()
        : this.salesOrgFormControl.enable()
    )
  );
  selectedSalesOrg$: Observable<SalesOrg> = this.store
    .select(getSelectedSalesOrg)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((salesOrg) => {
        if (this.selectedSalesOrg && this.onTouched && this.onChange) {
          return;
        }
        this.writeValue(salesOrg);
        this.salesOrgSelected.emit(salesOrg);
      })
    );

  salesOrgFormControl: FormControl = new FormControl({
    value: undefined,
    disabled: false,
  });
  disabledByParent = false;
  // Declare Functions for ControlValueAccessor when Component is defined as a formControl in ParentComponent
  private onChange: (value: SalesOrg) => void;
  private onTouched: () => void;

  private selectedSalesOrg: SalesOrg;

  selectionChange(event: MatSelectChange): void {
    this.store.dispatch(selectSalesOrg({ salesOrgId: event.value }));
    this.selectedSalesOrg = { ...this.selectedSalesOrg, id: event.value };
    this.salesOrgSelected.emit(this.selectedSalesOrg);

    // Call the callbacks when component has been defined as FormControl in parent component
    if (this.onChange) {
      this.onChange(this.selectedSalesOrg);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }

  writeValue(salesOrg: SalesOrg): void {
    this.selectedSalesOrg = salesOrg;
    this.salesOrgFormControl.setValue(salesOrg, { emitEvent: false });
    // Call the callbacks when component has been defined as FormControl in parent component
    if (this.onChange) {
      this.onChange(this.selectedSalesOrg);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  }
  registerOnChange(callback: (value: SalesOrg) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.salesOrgFormControl.disable();
      this.disabledByParent = true;
    } else {
      this.salesOrgFormControl.enable();
      this.disabledByParent = false;
    }
  }
}
