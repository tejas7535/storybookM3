import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';

import { FileDropModule } from '@schaeffler/shared/ui-components';

import { DataService } from '../../../shared/result/data.service';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  let dataService: DataService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
      imports: [CommonModule, FlexLayoutModule, FileDropModule, MatIconModule],
      providers: [{ provide: DataService, useValue: {} }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dataService = TestBed.get(DataService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('uploadFile', () => {
    let fileList: FileList;

    beforeEach(() => {
      dataService.postTaggingFile = jest.fn().mockReturnValue(of(10));
    });

    it('should return when no file is existing', () => {
      fileList = { item: undefined, length: 1, 0: undefined };

      component.uploadFile(fileList);

      expect(dataService.postTaggingFile).not.toHaveBeenCalled();
    });

    it('should call postTaggingFile of dataService', () => {
      const file: File = new File([], 'test');
      fileList = { item: undefined, length: 1, 0: file };

      component.uploadFile(fileList);

      expect(dataService.postTaggingFile).toHaveBeenCalledWith(file);
    });
  });
});
