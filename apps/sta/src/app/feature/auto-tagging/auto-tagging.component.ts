import { Component } from '@angular/core';

import { DataStoreService } from '../../shared/result/services/data-store.service';

@Component({
  selector: 'sta-auto-tagging',
  templateUrl: './auto-tagging.component.html',
  styleUrls: ['./auto-tagging.component.scss']
})
export class AutoTaggingComponent {
  constructor(private readonly dataStore: DataStoreService) {}

  public getTagsForText(text: string): void {
    this.dataStore.getTagsForText(text);
  }

  public getTagsForFile(file: File): void {
    this.dataStore.getTagsForFile(file);
  }
}
