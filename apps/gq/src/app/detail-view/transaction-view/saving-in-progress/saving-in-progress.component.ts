import { Component, Input } from '@angular/core';

@Component({
  selector: 'gq-saving-in-progress',
  templateUrl: './saving-in-progress.component.html',
  styles: [],
})
export class SavingInProgressComponent {
  @Input() hideRolesHint: boolean;

  imagePath = 'assets/png/calc_in_progress.png';

  reload(): void {
    window.location.reload();
  }
}
