import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-content-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.scss'],
})
export class ContentWrapperComponent {
  @Input() fullHeight?: boolean;
}
