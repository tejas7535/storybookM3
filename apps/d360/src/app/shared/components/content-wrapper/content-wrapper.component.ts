import { Component, Input } from '@angular/core';

@Component({
  selector: 'd360-content-wrapper',
  imports: [],
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.scss'],
})
export class ContentWrapperComponent {
  @Input() fullHeight?: boolean;
}
