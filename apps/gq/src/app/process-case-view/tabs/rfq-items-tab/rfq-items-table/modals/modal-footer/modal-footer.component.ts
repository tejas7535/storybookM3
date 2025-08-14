import { CommonModule } from '@angular/common';
import { Component, input, InputSignal, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'gq-modal-footer',
  templateUrl: './modal-footer.component.html',
  imports: [CommonModule, MatButtonModule],
})
export class ModalFooterComponent {
  submitText: InputSignal<string> = input<string>(null);
  cancelText: InputSignal<string> = input<string>(null);

  submitAction = output();
  cancelAction = output();
}
