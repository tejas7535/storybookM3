import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DetailViewRoutingModule } from './detail-view-routing.module';
import { DetailViewComponent } from './detail-view.component';

@NgModule({
  declarations: [DetailViewComponent],
  imports: [CommonModule, DetailViewRoutingModule],
})
export class DetailViewModule {}
