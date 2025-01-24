import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { Priority } from '../../../../feature/alerts/model';

@Component({
  selector: 'd360-task-priorities',
  standalone: true,
  imports: [],
  templateUrl: './task-priorities.component.html',
  styleUrl: './task-priorities.component.scss',
})
export class TaskPrioritiesComponent implements ICellRendererAngularComp {
  protected params!: any;

  public agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  public refresh(params: ICellRendererParams): boolean {
    this.params = params;

    return false;
  }

  protected readonly Priority = Priority;
}
