import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ga-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit, OnDestroy {
  @Input() public control: FormControl;
  @Input() public placeholder?: string;
  @Input() public hint?: string;
  @Input() public label?: string;
  @Input() public unit?: string;
  @Input() public onlyPositive? = false;
  @Input() public tooltipText?: string;
  @Input() public customErrors?: { name: string; message: string }[];
  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((value) => {
        if (value && this.onlyPositive) {
          this.control.patchValue(Math.abs(value));
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
