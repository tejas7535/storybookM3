import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { debounceTime, Subject, Subscription } from 'rxjs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'cdba-filter',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    SharedTranslocoModule,
  ],
  templateUrl: './filter.component.html',
})
export class FilterComponent implements OnDestroy {
  @Input() value = '';
  @Input() debounceTime = 300;

  @Output() valueChange = new EventEmitter<string>();

  private readonly valueSubject = new Subject<string>();
  private readonly subscription: Subscription;

  constructor() {
    this.subscription = this.valueSubject
      .pipe(debounceTime(this.debounceTime))
      .subscribe((value) => {
        this.valueChange.emit(value);
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.valueSubject.complete();
  }

  clearButtonDisabled(): boolean {
    return this.value === '';
  }

  updateFilter(value: string): void {
    this.value = value;
    this.valueSubject.next(value);
  }

  clearFilter(): void {
    this.value = '';
    this.valueChange.emit(this.value);
  }
}
