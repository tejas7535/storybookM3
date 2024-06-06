import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Observable } from 'rxjs';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DialogFacade } from '@mac/msd/store/facades/dialog';

@Component({
  selector: 'mac-base-dialog',
  templateUrl: './base-dialog.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // angular material
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatCheckboxModule,
    // forms
    ReactiveFormsModule,
    // libs
    SharedTranslocoModule,
    // ngrx
    PushPipe,
  ],
})
export class BaseDialogComponent {
  @Input()
  public txtTitle: string;
  @Input()
  public txtCancel: string;
  @Input()
  public txtConfirm: string;
  @Input()
  public isAddDialog: boolean;
  @Input()
  public minimizeEnabled = true;
  @Input()
  public closeEnabled = true;

  @Input() public valid: boolean;
  @Output() public minimize = new EventEmitter<void>();
  @Output() public accept = new EventEmitter<boolean>();
  @Output() public cancel = new EventEmitter<void>();

  public createAnotherControl = new FormControl<boolean>(false);

  public processConfirm$: Observable<boolean>;
  public isLoading$: Observable<boolean>;

  constructor(private readonly dialogFacade: DialogFacade) {
    this.processConfirm$ = this.dialogFacade.createMaterialLoading$;
    this.isLoading$ = this.dialogFacade.dialogLoading$;
  }

  // emit minimize request, closing dialog needs to be handled by parent component!
  public minimizeDialog(): void {
    this.minimize.emit();
  }

  public confirmDialog(): void {
    this.accept.emit(this.createAnotherControl.value);
  }

  public cancelDialog(): void {
    this.cancel.emit();
  }
}
