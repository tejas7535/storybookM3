import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { AutoTaggingComponent } from './auto-tagging.component';
import { FileUploadModule } from './file-upload/file-upload.module';
import { TextInputModule } from './text-input/text-input.module';

describe('AutoTaggingComponent', () => {
  let component: AutoTaggingComponent;
  let fixture: ComponentFixture<AutoTaggingComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatTabsModule,
        TextInputModule,
        FileUploadModule
      ],
      declarations: [AutoTaggingComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
