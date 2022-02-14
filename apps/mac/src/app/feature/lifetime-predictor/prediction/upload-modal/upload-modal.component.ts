import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'mac-ltp-upload-modal',
  templateUrl: './upload-modal.component.html',
})
export class UploadModalComponent {
  loadForm = new FormGroup({
    conversionFactor: new FormControl(1, [
      Validators.required,
      Validators.min(0.01),
    ]),
    repetitionFactor: new FormControl(1, [
      Validators.required,
      Validators.min(0.01),
    ]),
    method: new FormControl('FKM', [Validators.required]),
  });

  methods: string[] = ['FKM', 'Goodman'];

  public trackByFn(index: number, _item: any): number {
    return index;
  }
}
