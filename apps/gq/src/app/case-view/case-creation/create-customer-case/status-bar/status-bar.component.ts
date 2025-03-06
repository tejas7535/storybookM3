import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gq-status-bar',
  templateUrl: './status-bar.component.html',
  standalone: false,
})
export class StatusBarComponent {
  @Input() createCaseDisabled: boolean;

  @Output() createCase = new EventEmitter();
  @Output() resetAll = new EventEmitter();
  @Output() closeDialog = new EventEmitter();

  emitCreateCase(): void {
    this.createCase.emit();
  }
  emitResetAll(): void {
    this.resetAll.emit();
  }
  emitCloseDialog(): void {
    this.closeDialog.emit();
  }
}
