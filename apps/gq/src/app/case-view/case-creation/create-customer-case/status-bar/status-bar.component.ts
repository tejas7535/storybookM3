import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gq-status-bar',
  templateUrl: './status-bar.component.html',
})
export class StatusBarComponent {
  @Input() total: string;
  @Input() createCaseDisabled: boolean;

  @Output() createCase = new EventEmitter();
  @Output() resetAll = new EventEmitter();

  emitCreateCase(): void {
    this.createCase.emit();
  }
  emitResetAll(): void {
    this.resetAll.emit();
  }
}
