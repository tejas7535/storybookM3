import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { DroppableDirective } from './droppable.directive';
import { FileDropComponent } from './file-drop.component';

describe('FileDropComponent', () => {
  let component: FileDropComponent;
  let fixture: ComponentFixture<FileDropComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [FileDropComponent, DroppableDirective],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDropComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should join accepted file types', () => {
      component.accept = ['.pdf', '.txt'];

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges();

      expect(component.acceptAsArray).toEqual('.pdf,.txt');
    });

    it('should reset "AccepptAsArray" when accept is undefined', () => {
      component.acceptAsArray = 'lalala';
      component.accept = undefined;

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges();

      expect(component.acceptAsArray).toEqual('');
    });
  });

  describe('EventHandler', () => {
    let event: any;

    const defaultEvent = {
      preventDefault: jest.fn(),
    };

    beforeEach(() => {
      event = undefined;
    });

    describe('onDragOver', () => {
      beforeEach(() => {
        spyOn(component.fileOver, 'emit');
      });

      it('should prevent default event', () => {
        event = defaultEvent;

        component.onDragOver(event);

        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should set dragoverflag to true & emit fileOver', () => {
        component.disabled = false;
        component.dragoverflag = false;
        event = defaultEvent;

        component.onDragOver(event);

        expect(component.dragoverflag).toEqual(true);
        expect(component.fileOver.emit).toHaveBeenCalledWith(event);
      });

      it('should do nothing when component is disabled', () => {
        component.disabled = true;
        component.dragoverflag = false;
        event = defaultEvent;

        component.onDragOver(event);

        expect(component.dragoverflag).toEqual(false);
        expect(component.fileOver.emit).not.toHaveBeenCalled();
      });

      it('should not emit event twice', () => {
        component.disabled = false;
        component.dragoverflag = true;
        event = defaultEvent;

        component.onDragOver(event);

        expect(component.dragoverflag).toEqual(true);
        expect(component.fileOver.emit).not.toHaveBeenCalled();
      });
    });

    describe('onDragLeave', () => {
      beforeEach(() => {
        spyOn(component.fileLeave, 'emit');
      });

      it('should prevent default event', () => {
        event = defaultEvent;

        component.onDragLeave(event);

        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should set dragoverflag to false & emit fileOver', () => {
        component.disabled = false;
        component.dragoverflag = true;
        event = defaultEvent;

        component.onDragLeave(event);

        expect(component.dragoverflag).toEqual(false);
        expect(component.fileLeave.emit).toHaveBeenCalledWith(event);
      });

      it('should do nothing when component is disabled', () => {
        component.disabled = true;
        component.dragoverflag = true;
        event = defaultEvent;

        component.onDragLeave(event);

        expect(component.dragoverflag).toEqual(true);
        expect(component.fileLeave.emit).not.toHaveBeenCalled();
      });

      it('should not emit event twice', () => {
        component.disabled = false;
        component.dragoverflag = false;
        event = defaultEvent;

        component.onDragLeave(event);

        expect(component.dragoverflag).toEqual(false);
        expect(component.fileLeave.emit).not.toHaveBeenCalled();
      });
    });

    describe('clearDropzone', () => {
      beforeEach(() => {
        event = { ...defaultEvent, dataTransfer: { clearData: jest.fn() } };
      });

      it('should prevent default event', () => {
        component.clearDropzone(event);

        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should set dragoverflag to false', () => {
        component.clearDropzone(event);

        expect(component.dragoverflag).toEqual(false);
      });

      it('should call "clearData" of dataTransfer', () => {
        component.clearDropzone(event);

        expect(event.dataTransfer.clearData).toHaveBeenCalled();
      });
    });

    describe('dropFiles', () => {
      beforeEach(() => {
        spyOn(component.filesAdded, 'emit');
        event = undefined;
      });

      it('should emit filesAdded with the files as array', () => {
        const files: File[] = [new File([], 'test')];
        event = { ...defaultEvent, dataTransfer: { files } };
        component.disabled = false;

        component.dropFiles(event);

        expect(component.filesAdded.emit).toHaveBeenCalledWith(files);
      });

      it('should do nothing when component is disabled', () => {
        event = defaultEvent;
        component.disabled = true;

        component.dropFiles(event);

        expect(component.filesAdded.emit).not.toHaveBeenCalled();
      });
    });

    describe('addFile', () => {
      beforeEach(() => {
        spyOn(component.filesAdded, 'emit');
        event = undefined;
      });

      it('should prevent default event', () => {
        event = { ...defaultEvent, target: { files: [] } };

        component.addFile(event);

        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should emit filesAdded with the files as array', () => {
        const files: File[] = [new File([], 'test')];
        event = { ...defaultEvent, target: { files } };

        component.addFile(event);

        expect(component.filesAdded.emit).toHaveBeenCalledWith(files);
      });

      it('should reset event target value', () => {
        const files: File[] = [];
        const value = 'lala';
        event = { ...defaultEvent, target: { files, value } };

        component.addFile(event);

        expect(event.target.value).toEqual('');
      });
    });
  });
});
