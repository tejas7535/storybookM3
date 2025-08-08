import { Component, Input } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-saving-in-progress',
  imports: [SharedTranslocoModule],
  templateUrl: './saving-in-progress.component.html',
  styles: [],
  standalone: true,
})
export class SavingInProgressComponent {
  @Input() hideRolesHint: boolean;

  imagePath = 'assets/png/calc_in_progress.png';

  reload(): void {
    window.location.reload();
  }
}
