import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gq-dialog-header',
  templateUrl: './dialog-header.component.html',
})
export class DialogHeaderComponent {
  @Input() title: string;
  @Output() closeDialog = new EventEmitter();

  emitCloseDialog(): void {
    this.closeDialog.emit();
  }
}
