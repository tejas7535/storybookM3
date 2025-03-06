import { Component, Input } from '@angular/core';

@Component({
  selector: 'cdba-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  standalone: false,
})
export class LoadingSpinnerComponent {
  @Input() show: boolean;
}
