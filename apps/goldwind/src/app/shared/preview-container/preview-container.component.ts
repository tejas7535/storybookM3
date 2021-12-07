import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'goldwind-preview-container',
  templateUrl: './preview-container.component.html',
  styleUrls: ['./preview-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewContainerComponent {}
