import { Component } from '@angular/core';

import { DataStoreService } from '../../shared/result/services/data-store.service';

@Component({
  selector: 'sta-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss']
})
export class TranslationComponent {
  constructor(private readonly dataStore: DataStoreService) {}

  public getTranslationForText(text: string): void {
    this.dataStore.getTranslationForText(text);
  }

  public getTranslationForFile(file: File): void {
    this.dataStore.getTranslationForFile(file);
  }
}
