import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { DialogFacade } from '@mac/msd/store/facades/dialog';

@Component({
  selector: 'mac-base-dialog',
  templateUrl: './base-dialog.component.html',
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
