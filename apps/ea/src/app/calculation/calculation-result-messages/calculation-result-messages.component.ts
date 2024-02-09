import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ea-calculation-result-messages',
  templateUrl: './calculation-result-messages.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class CalculationResultMessagesComponent {
  @Input() title: string;
  @Input() messages: string[];
}
