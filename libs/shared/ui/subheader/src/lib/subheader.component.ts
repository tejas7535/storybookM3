import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'schaeffler-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.scss'],
})
export class SubheaderComponent {
  @Input() showBackButton = true;
  @Input() title = '';
  @Output() backButtonClicked = new EventEmitter();

  clickBackButton(): void {
    this.backButtonClicked.emit();
  }
}
