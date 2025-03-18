import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Color } from '../../../shared/models/color';
import { OpenApplication } from '../../models/open-application.model';

@Component({
  selector: 'ia-open-positions-list',
  templateUrl: './open-positions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './open-positions-list.component.scss',
  standalone: false,
})
export class OpenPositionsListComponent {
  @Input() openApplications: OpenApplication[];
  @Input() isLoadingOpenApplications: boolean;

  colors = Color;
}
