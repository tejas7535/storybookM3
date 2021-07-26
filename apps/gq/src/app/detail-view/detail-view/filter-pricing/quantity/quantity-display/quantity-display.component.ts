import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { isManualCase } from '../../../../../core/store';
import { QuantityModalComponent } from '../quantity-modal/quantity-modal.component';

@Component({
  selector: 'gq-quantity-display',
  templateUrl: './quantity-display.component.html',
})
export class QuantityDisplayComponent implements OnInit {
  @Input() quantity: number;

  isManualCase$: Observable<boolean>;
  constructor(
    private readonly dialog: MatDialog,
    private readonly store: Store
  ) {}
  ngOnInit(): void {
    this.isManualCase$ = this.store.select(isManualCase);
  }
  openEditing(): void {
    this.dialog.open(QuantityModalComponent, {
      width: '50%',
      height: '300px',
      data: this.quantity,
      disableClose: true,
    });
  }
}
