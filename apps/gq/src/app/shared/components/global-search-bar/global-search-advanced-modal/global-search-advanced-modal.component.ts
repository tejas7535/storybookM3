import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'gq-global-search-advanced-modal',
  templateUrl: './global-search-advanced-modal.component.html',
})
export class GlobalSearchAdvancedModalComponent {
  private readonly dialogRef = inject(
    MatDialogRef<GlobalSearchAdvancedModalComponent>
  );

  private readonly MIN_LENGTH = 3;

  onlyUserCases = false;
  searchFormControl: FormControl = new FormControl(
    '',
    Validators.minLength(this.MIN_LENGTH)
  );

  toggleOnlyUserCases(): void {
    this.onlyUserCases = !this.onlyUserCases;
  }

  selectTopItem(): void {
    // eslint-disable-next-line no-console
    console.log('selectTopItem');
  }

  closeDialog() {
    this.dialogRef.close();
  }

  clearInputField() {
    this.onlyUserCases = false;
    this.searchFormControl.patchValue('');
  }

  search(): void {
    // eslint-disable-next-line no-console
    console.log('search');
  }
}
