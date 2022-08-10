import { Component } from '@angular/core';

@Component({
  selector: 'sedo-timeout-warning-cellrenderer-component',
  templateUrl: './timeout-warning-cellrenderer-component.html',
})
export class TimeoutWarningRendererComponent {
  public showWarning: boolean;

  public agInit(params: any): void {
    this.showWarning = params.value;
  }
}
