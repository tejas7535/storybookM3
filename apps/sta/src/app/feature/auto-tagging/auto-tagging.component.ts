import { Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataStoreService } from '../../shared/result/services/data-store.service';

import { DEMO_TEXT_EN } from '../../constants/demo-text-en.constant';

import { FileStatus } from '../../shared/file-upload/file-status.model';

@Component({
  selector: 'sta-auto-tagging',
  templateUrl: './auto-tagging.component.html',
  styleUrls: ['./auto-tagging.component.scss']
})
export class AutoTaggingComponent implements OnInit, OnDestroy {
  public fileStatus: FileStatus = undefined;
  public demoTextEn = DEMO_TEXT_EN;

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly dataStore: DataStoreService) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.dataStore.reset$.subscribe(
        () =>
          (this.fileStatus =
            this.fileStatus.success === undefined ? this.fileStatus : undefined)
      )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public getTagsForText(text: string): void {
    this.dataStore.getTagsForText(text);
  }

  public async getTagsForFile(file: File): Promise<void> {
    this.fileStatus = new FileStatus(file.name, file.type);
    this.fileStatus = await this.dataStore.getTagsForFile(file);
  }
}
