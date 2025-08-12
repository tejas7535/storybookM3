import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'ga-calculator-logo',
  templateUrl: './calculator-logo.component.html',
  imports: [CommonModule, SharedTranslocoModule],
})
export class CalculatorLogoComponent {}
