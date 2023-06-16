import { NgModule } from '@angular/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { DetailViewRoutingModule } from './detail-view-routing.module';

@NgModule({
  imports: [DetailViewRoutingModule, MatDialogModule],
})
export class DetailViewModule {}
