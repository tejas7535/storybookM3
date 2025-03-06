import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DragDialogDirective } from '@gq/shared/directives/drag-dialog/drag-dialog.directive';

@Component({
  selector: 'gq-dialog-header',
  templateUrl: './dialog-header.component.html',
  hostDirectives: [DragDialogDirective],
  standalone: false,
})
export class DialogHeaderComponent {
  @Input() title: string;
  @Output() closeDialog = new EventEmitter();

  emitCloseDialog(): void {
    this.closeDialog.emit();
  }
}
