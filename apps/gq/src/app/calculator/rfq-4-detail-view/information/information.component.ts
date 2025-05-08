import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { HeaderInformationComponent } from './header-information/header-information.component';
import { PositionInformationComponent } from './position-information/position-information.component';

@Component({
  selector: 'gq-rfq-4-detail-view-information',
  imports: [
    CommonModule,
    PositionInformationComponent,
    HeaderInformationComponent,
  ],
  templateUrl: './information.component.html',
})
export class InformationComponent {}
