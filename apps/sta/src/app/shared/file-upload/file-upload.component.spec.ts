import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

import { configureTestSuite } from 'ng-bullet';

import { FileDropModule } from '@schaeffler/file-drop';

import { FileTypeToIconPipe } from './file-type-to-icon.pipe';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent, FileTypeToIconPipe],
      imports: [CommonModule, FlexLayoutModule, FileDropModule, MatIconModule],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('uploadFile', () => {
    let fileList: FileList;

    it('should return when no file is existing', () => {
      component.fileUploaded.emit = jest.fn();
      fileList = { item: undefined, length: 1, 0: undefined };

      component.uploadFile(fileList);

      expect(component.fileUploaded.emit).not.toHaveBeenCalled();
    });

    it('should emit fileUploaded when file exists', () => {
      const file: File = new File([], 'test');
      fileList = { item: undefined, length: 1, 0: file };
      component.fileUploaded.emit = jest.fn();

      component.uploadFile(fileList);

      expect(component.fileUploaded.emit).toHaveBeenCalledWith(file);
    });
  });
});
