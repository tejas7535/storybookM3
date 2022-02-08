import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'cdba-bom-table-status-bar',
  templateUrl: './bom-table-status-bar.component.html',
  styleUrls: ['./bom-table-status-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BomTableStatusBarComponent {
  public agInit(): void {}
}

@NgModule({
  imports: [SharedTranslocoModule],
  declarations: [BomTableStatusBarComponent],
  exports: [BomTableStatusBarComponent],
})
export class BomTableStatusBarComponentModule {}
