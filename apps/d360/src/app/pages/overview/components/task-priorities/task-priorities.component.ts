import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-enterprise';

import { Priority } from '../../../../feature/alerts/model';

@Component({
  selector: 'd360-task-priorities',
  imports: [],
  templateUrl: './task-priorities.component.html',
  styleUrl: './task-priorities.component.scss',
})
export class TaskPrioritiesComponent implements ICellRendererAngularComp {
  protected params!: any;
  protected readonly Priority = Priority;

  public agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  public refresh(params: ICellRendererParams): boolean {
    this.params = params;

    return false;
  }
}
