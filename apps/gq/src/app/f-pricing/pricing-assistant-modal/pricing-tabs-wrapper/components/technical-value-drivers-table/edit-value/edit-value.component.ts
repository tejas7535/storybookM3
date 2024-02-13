import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gq-edit-value',
  templateUrl: './edit-value.component.html',
})
export class EditValueComponent {
  @Input() value: number;

  @Output() valueChanged = new EventEmitter<number>();

  isEditMode = false;

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  valueHasChanged(event: any): void {
    this.valueChanged.emit(event.valueAsNumber);
  }
}
