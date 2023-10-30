import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { DetailViewRoutingModule } from './detail-view-routing.module';

@NgModule({
  imports: [DetailViewRoutingModule, MatDialogModule],
})
export class DetailViewModule {}
