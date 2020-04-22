import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ltp-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss']
})
export class UploadModalComponent {
  loadForm = new FormGroup({
    conversionFactor: new FormControl(0, [Validators.required]),
    repetitionFactor: new FormControl(0, [Validators.required]),
    meanStressCorrectionMethod: new FormControl('FKM', [Validators.required])
  });

  methods: string[] = ['FKM', 'Goodman'];
}
